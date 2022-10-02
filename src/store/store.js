import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import subjectReducer from "./subjects/subjectsSlice";
import studentsReducer from "./students/studentsSlice";
import absencesReducer from "./absences/absencesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    subjects: subjectReducer,
    students: studentsReducer,
    absences: absencesReducer,
  },
})