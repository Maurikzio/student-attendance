import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import subjectReducer from "./subjects/subjectsSlice";
import studentsReducer from "./students/studentsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    subjects: subjectReducer,
    students: studentsReducer,
  },
})