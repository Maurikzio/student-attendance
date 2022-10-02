import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getArrayFromCollection } from "../helpers";

const initialState = {
  loading: false,
  error: null,
  success: false,
  list: [],
}

export const createAbsenceRecord = createAsyncThunk(
  "absences/createAbsence",
  async (data) => {
    const { student, subject, dayOfWeek, classTime, isUnjustified, reason, userId, userInfo } = data;
    const dataToSend = {
      studentId: student.id,
      studentName: student.value,
      day: dayOfWeek.value,
      type: isUnjustified ? "I" : "J",
      addedWhen: Date.now(),
      addedBy: userId,
      modifiedBy: "",
      modifiedWhen: "",
      subjectId: subject.id,
      subjectName: subject.value,
      classTime: classTime.value,
      reason,
    };

    try{
      //TODO: update this when adding inspector logic
      //TODO: add logic to update the student object "absences: {J:"", I:"", absences: []}
      await addDoc(collection(db, `absences${userInfo.tutorOf}`), dataToSend);
    } catch(err) {
      console.log("err", err);
      throw new Error(err);
    }
  }
);

export const getAbsencesAddedByUser = createAsyncThunk(
  "absences/getAbsencesByUser",
  async(grade) => {
    try {
      const colRef = collection(db, `absences${grade}`);
      const docsSnap = await getDocs(colRef);
      const listOfAbsences = getArrayFromCollection(docsSnap);
      return listOfAbsences;
    } catch (err) {
      throw new Error(err);
    }
  }
)

export const absencesSlice = createSlice({
  name: "absences",
  initialState,
  reducers: {},
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
  }
})

export default absencesSlice.reducer;