import { addDoc, collection } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import { getStudentsOfUser } from '../store/students/studentsSlice';
import { selectUserInfo } from "../store/user/userSlice";

const Students = () => {
  const userInfo = useSelector(selectUserInfo);
  const {loading: studentsLoading, list: studentsList} = useSelector((state) => state.students);
  const dispatch = useDispatch();

  useEffect(() => {
    if(userInfo) {
      const grade = userInfo.tutorOf.replace(/[A-Z]/g, "");
      const gradeLetter = userInfo.tutorOf.replace(/[0-9]/g, "");
      dispatch(getStudentsOfUser({grade, gradeLetter}));
    }
  }, [userInfo, dispatch]);

  if (studentsLoading) {
    return (
      <div className="w-full h-full bg-slate-500 flex justify-center items-center">
        <h1>Cargando...</h1>
      </div>
    )
  }

  return (
    <div className="w-full min-h-full text-black p-4">
      <h1>Students</h1>
    </div>
  )
}

export default Students;