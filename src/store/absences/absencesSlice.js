import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, doc, getDocs, updateDoc, increment, arrayUnion } from "firebase/firestore";
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
    try{
      //TODO: update this when adding inspector logic

      /* create the new absence record */
      const grade = data.grade.replace(/[A-Z]/g, "");
      const createdRecordRef = await addDoc(collection(db, `absences${grade}`), data);

      /* update the student fields related to the just created absence record  "absences: {J:"", I:"", absences: []}*/
      const studentRef = doc(db, `students${grade}`, data.studentId);
      const keyOfType = `absences.${data.type}`;
      const tmpObj = { [keyOfType]: increment(1) };
      await updateDoc(studentRef, {
        ...tmpObj,
        "absences.list": arrayUnion(createdRecordRef.id)
      })

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