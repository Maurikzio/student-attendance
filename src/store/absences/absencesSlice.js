import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, doc, getDocs, updateDoc, increment, arrayUnion, where, orderBy, deleteDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getArrayFromCollection } from "../helpers";
import { toast } from 'react-toastify';

const initialState = {
  loading: false,
  error: null,
  success: false,
  list: [],
}

export const createAbsenceRecord = createAsyncThunk(
  "absences/createAbsence",
  async (data) => {
    try{
      //TODO: update this when adding inspector logic

      /* create the new absence record */
      const grade = data.grade.replace(/[A-Z]/g, "");
      const createdRecordRef = await addDoc(collection(db, `absences${grade}`), data);

      /* update the student fields related to the just created absence record  "absences: {J:"", I:"", absences: []}*/
      const studentRef = doc(db, `students${grade}`, data.studentId);
      await updateDoc(studentRef, {
        ['absences.' + data.type]: increment(1),
        "absences.list": arrayUnion(createdRecordRef.id)
      });

      toast.success("El nuevo registro ha sido creado", { bodyClassName: "bg-lime-50", className: "!bg-lime-50 text-white"});
    } catch(err) {
      console.log("err", err);
      toast.error("El registro no ha podido ser creado", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      throw new Error(err);
    }
  }
);

export const getAbsencesAddedByUser = createAsyncThunk(
  "absences/getAbsencesByUser",
  async (data) => {
    const grade = data.replace(/[A-Z]/g, "");
    const gradeLetter = data.replace(/[0-9]/g, "");
    try {
      const colRef = collection(db, `absences${grade}` );
      const docsSnap = await getDocs(colRef, where("grade", "==", `${grade}${gradeLetter}`), orderBy("createdWhen"));
      const listOfAbsences = getArrayFromCollection(docsSnap);
      return listOfAbsences;
    } catch (err) {
      throw new Error(err);
    }
  }
)

export const deleteAbsence = createAsyncThunk(
  "absences/deleteAbsence",
  async (data, { dispatch }) => {
    const { studentId, absenceId, absenceType, studentGrade } = data;
    const grade = studentGrade.replace(/[A-Z]/g, "");

    try {
      const docRef = doc(db, `absences${grade}`, absenceId);
      await deleteDoc(docRef);

      /* update the student fields related to the just created absence record  "absences: {J:"", I:"", absences: []}*/
      const studentRef  =  doc(db, `students${grade}`, studentId);
      await updateDoc(studentRef, {
        ['absences.' + absenceType]: increment(-1),
        "absences.list": arrayRemove(absenceId)
      });
      dispatch(updateAbsencesList(absenceId))
      toast.success("El registro ha sido borrado", { bodyClassName: "bg-lime-50", className: "!bg-lime-50 text-white"});
    } catch (err) {
      console.log(err);
      toast.error("No se ha podido borrar el registro", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      throw new Error(err);
    }

  }
)

export const absencesSlice = createSlice({
  name: "absences",
  initialState,
  reducers: {
    updateAbsencesList: (state, action) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    }
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
  }
})

export const { updateAbsencesList } = absencesSlice.actions;

export default absencesSlice.reducer;