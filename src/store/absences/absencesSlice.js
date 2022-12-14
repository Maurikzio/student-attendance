import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, doc, getDocs, updateDoc, increment, where, query, orderBy, deleteDoc, deleteField } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getArrayFromCollection } from "../../helpers";
import { toast } from 'react-toastify';

const initialState = {
  loading: false,
  error: null,
  success: false,
  list: [],
}

export const createAbsenceRecord = createAsyncThunk(
  "absences/createAbsence",
  async (data, { rejectWithValue }) => {
    try{
      /* create the new absence record */
      const grade = data.grade.replace(/[A-Z]/g, "");
      const createdRecordRef = await addDoc(collection(db, `absences${grade}`), data);

      /* update the student fields related to the just created absence record  "absences: {J:"", I:"", absences: []}*/
      const studentRef = doc(db, `students${grade}`, data.studentId);
      await updateDoc(studentRef, {
        ['absences.' + data.type]: increment(1),
        ['absences.list.'+createdRecordRef.id]: {'type': data.type, id: createdRecordRef.id, subjectId: data.subjectId}
        // "absences.list": arrayUnion(createdRecordRef.id)
      });

      toast.success("El nuevo registro ha sido creado", { bodyClassName: "bg-lime-50", className: "!bg-lime-50 text-white"});
    } catch(err) {
      console.log("err", err);
      toast.error("El registro no ha podido ser creado", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      return rejectWithValue(JSON.stringify(err));
    }
  }
);

export const getAbsencesAddedByUser = createAsyncThunk(
  "absences/getAbsencesByUser",
  async (data, { rejectWithValue }) => {
    const grade = data.replace(/[A-Z]/g, "");
    const gradeLetter = data.replace(/[0-9]/g, "");
    try {
      const colRef = collection(db, `absences${grade}` );
      const q = query(colRef, where("grade", "==", `${grade}${gradeLetter}`), orderBy("date", "asc"));
      const docsSnap = await getDocs(q);
      const listOfAbsences = getArrayFromCollection(docsSnap).sort((a, b) => b.date - a.date);
      return listOfAbsences;
    } catch (err) {
      toast.error("No se ha podido obtener los registros", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      return rejectWithValue(JSON.stringify(err));
    }
  }
)

export const getAbsencesByGrade = createAsyncThunk(
  "absences/getAbsencesByGrade",
  async (grade, { rejectWithValue }) => {
    try {
      const colRef = collection(db, `absences${grade}`);
      const docsSnap = await getDocs(colRef);
      const listOfAbsences = getArrayFromCollection(docsSnap).sort((a, b) => b.date - a.date);
      return listOfAbsences;
    } catch (err) {
      toast.error("No se ha podido obtener los registros", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      return rejectWithValue(JSON.stringify(err));
    }
  }
)

export const deleteAbsence = createAsyncThunk(
  "absences/deleteAbsence",
  async (data, { dispatch, rejectWithValue }) => {
    const { studentId, absenceId, absenceType, studentGrade } = data;
    const grade = studentGrade.replace(/[A-Z]/g, "");

    try {
      const docRef = doc(db, `absences${grade}`, absenceId);
      await deleteDoc(docRef);

      /* update the student fields related to the just created absence record  "absences: {J:"", I:"", absences: []}*/
      const studentRef = doc(db, `students${grade}`, studentId);
      await updateDoc(studentRef, {
        ['absences.' + absenceType]: increment(-1),
        // "absences.list": arrayRemove(absenceId)
        ['absences.list.' + absenceId]: deleteField(),
      });
      dispatch(filterAbsencesList(absenceId))
      toast.success("El registro ha sido borrado", { bodyClassName: "bg-lime-50", className: "!bg-lime-50 text-white"});
    } catch (err) {
      toast.error("No se ha podido borrar el registro", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      return rejectWithValue(JSON.stringify(err));
    }

  }
)

export const updateAbsenceType = createAsyncThunk(
  "absences/updateAbsenceType",
  async (data, { dispatch, rejectWithValue }) => {
    const { grade, id: absenceId, type, studentId, modifiedBy, modifiedById, modifiedWhen } = data;

    const gradeNumber = grade.replace(/[A-Z]/g, "");
    const typesToChange = {I : "J", J : "I"};

    try {
      const docRef = doc(db, `absences${gradeNumber}`, absenceId);
      await updateDoc(docRef, { type:  typesToChange[type], modifiedBy,  modifiedById, modifiedWhen });

      /* Update the student absences object */
      const studentRef = doc(db, `students${gradeNumber}`, studentId);
      await updateDoc(studentRef ,{
        'absences.I': increment(type === "I" ? -1 : 1),
        'absences.J': increment(type === "J" ? -1 : 1),
        ['absences.list.'+absenceId+'.type']: typesToChange[type],
      })
      dispatch(updateAbsence({ absenceId, nextType: typesToChange[type], modifiedBy }));
      toast.success("El registro ha sido actualizado", { bodyClassName: "bg-lime-50", className: "!bg-lime-50 text-white"});
    } catch (err) {
      toast.error("No se ha podido actualizar el registro", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      return rejectWithValue(JSON.stringify(err));
    }
  }
);

// export const getAbsencesOfStudent = createAsyncThunk(
//   "absences/getStudentAbsences",
//   async ({studentGrade, studentId}) => {
//     const grade = studentGrade.replace(/[A-Z]/g, "");
//     try {
//       const colRef = collection(db, `absences${grade}`);
//       const q = query(colRef, where("studentId", "==", studentId));
//       const dataSnap = await getDocs(q);
//       const listOfAbsences = getArrayFromCollection(dataSnap);
//       return listOfAbsences;
//     } catch (err) {
//       toast.error("Registro de asistencia del estudiante no encontrado", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
//       console.log(err);
//       throw new Error(err);
//     }
//   }
// )

export const absencesSlice = createSlice({
  name: "absences",
  initialState,
  reducers: {
    filterAbsencesList: (state, action) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
    updateAbsence: (state, action) => {
      state.list = state.list.map(item => item.id === action.payload.absenceId ? {...item, type: action.payload.nextType, modifiedBy: action.payload.modifiedBy } : item)
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createAbsenceRecord.pending, (state, action) => {
        state.loading = true;
        state.error = null
      })
      .addCase(createAbsenceRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createAbsenceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
      .addCase(getAbsencesAddedByUser.pending, (state, action) => {
        state.loading = true;
        state.error = null
      })
      .addCase(getAbsencesAddedByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = action.payload;
      })
      .addCase(getAbsencesAddedByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
      .addCase(getAbsencesByGrade.pending, (state, action) => {
        state.loading = true;
        state.error = null
      })
      .addCase(getAbsencesByGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = action.payload;
      })
      .addCase(getAbsencesByGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
      .addCase(deleteAbsence.pending, (state, action) => {
        state.loading = true;
        state.error = null
      })
      .addCase(deleteAbsence.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteAbsence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
      .addCase(updateAbsenceType.pending, (state, action) => {
        state.loading = true;
        state.error = null
      })
      .addCase(updateAbsenceType.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateAbsenceType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      })
  }
})

export const { filterAbsencesList, updateAbsence } = absencesSlice.actions;

export default absencesSlice.reducer;