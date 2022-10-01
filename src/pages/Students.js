import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserStudents } from '../store/students/studentsSlice';


const Students = () => {

  const {loading: studentsLoading, list} = useSelector((state) => state.students);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserStudents());
  }, [])

  if(studentsLoading) {
    return (
      <div className="w-full h-full bg-slate-500 flex justify-center items-center">
        <h1>Cargando...</h1>
      </div>
    )
  }

  return (
    <div className="w-full h-full text-black p-4">
      <h1>Students</h1>
    </div>
  )
}

export default Students;