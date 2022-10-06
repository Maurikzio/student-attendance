import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { getArrayFromCollection } from "../../helpers";

const initialState = {
  loading: false,
  error: null,
  success: false,
  list: [],
}

export const getSubjects = createAsyncThunk(
  "subjects/getSubjects",
  async () => {
    try {
      const colRef = collection(db, "subjects");
      const docsSnap = await getDocs(colRef);
      const listOfSubjects = getArrayFromCollection(docsSnap);
      return listOfSubjects;
    } catch (err) {
      throw new Error(err);
    }
  }
)

export const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getSubjects.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = action.payload;
      })
      .addCase(getSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
})

export const selectSubjects = (state) => state.subjects.items;

export default subjectsSlice.reducer;