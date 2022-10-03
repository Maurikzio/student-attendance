import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getArrayFromCollection } from "../helpers";

const initialState = {
  loading: false,
  error: null,
  success: false,
  list: [],
}

export const getStudentsOfUser = createAsyncThunk(
  "students/getUserStudents",
  async ({grade, gradeLetter}) => {
    try {
      const colRef = collection(db, `students${grade}`);
      const q = query(colRef, where("grade", "==", `${grade}${gradeLetter}`));
      const dataSnap = await getDocs(q);
      const listOfStudents = getArrayFromCollection(dataSnap);
      return listOfStudents;
    } catch (err) {
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
  }
})

export default studentsSlice.reducer;