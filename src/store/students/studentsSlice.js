import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getArrayFromCollection, spanishLocale } from "../../helpers";
import { toast } from 'react-toastify';
import { getAbsencesOfStudent } from "../absences/absencesSlice";

const initialState = {
  loading: false,
  error: null,
  success: false,
  list: [],
  studentInfo: null,
  studentAbsences: [],
}

export const getStudentsOfUser = createAsyncThunk(
  "students/getUserStudents",
  async (data) => {
    const grade = data.replace(/[A-Z]/g, "");
    const gradeLetter = data.replace(/[0-9]/g, "");
    try {
      const colRef = collection(db, `students${grade}`);
      const q = query(colRef, where("grade", "==", `${grade}${gradeLetter}`), orderBy("lastname"));
      const dataSnap = await getDocs(q);
      const listOfStudents = getArrayFromCollection(dataSnap);
      return listOfStudents;
    } catch (err) {
      throw new Error(err);
    }
  }
)

export const getStudentsByGrade = createAsyncThunk(
  "students/getStudentByGrade",
  async (grade) => {
    try {
      const colRef = collection(db, `students${grade}`);
      const docsSnap = await getDocs(colRef);
      const listOfStudents = getArrayFromCollection(docsSnap).sort((a, b) => a.lastname.localeCompare(b.lastname, 'es', {sensitivity: 'base'}));
      return listOfStudents;
    } catch (err) {
      toast.error("No se ha podido obtener los estudiantes", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      return err;
    }
  }
)

export const getStudentInfo = createAsyncThunk(
  "students/getStudentInfo",
  async ({studentId, studentGrade}, {dispatch}) => {
    const grade = studentGrade.replace(/[A-Z]/g, "");

    try {
      const docRef = doc(db, `students${grade}`, studentId);
      const docSnap = await getDoc(docRef);
      const studentInfo = docSnap.data();
      const res = { studentInfo, }
      if(studentInfo?.absences?.list.length) {
        const absences = studentInfo?.absences?.list.map(item => getDoc(doc(db, `absences${grade}`, item)))
        const absencesList = await Promise.all(absences);
        const absencesListInfo = absencesList
          .map(doc => ({...doc.data(), id: doc.id}))
          .sort((a, b) => b.date - a.date);
        res.studentAbsences = absencesListInfo;
      }
      return res;
    } catch (err) {
      console.log("ERR", err);
      toast.error("Estudiante no encontrado", { bodyClassName: "bg-rose-50", className: "!bg-rose-50 text-white"});
      throw new Error(err);
    }

  }
)

export const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getStudentsOfUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentsOfUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = action.payload;
      })
      .addCase(getStudentsOfUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStudentsByGrade.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentsByGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = action.payload;
      })
      .addCase(getStudentsByGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStudentInfo.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.studentInfo = action.payload.studentInfo;
        state.studentAbsences = action.payload.studentAbsences;
      })
      .addCase(getStudentInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
})

export default studentsSlice.reducer;