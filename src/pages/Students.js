import { addDoc, collection } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase/firebaseConfig";
import { getStudentsOfUser } from '../store/students/studentsSlice';
import { selectUserInfo } from "../store/user/userSlice";
import DownloadCSV from "../components/DownloadCSV/DownloadCSV";
import Table from "../components/Table";

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

  const headersForCSV = [
    {label: "Estudiante", key: "student"},
    {label: "Curso", key: "grade"},
    {label: "Justificadas", key: "justified"},
    {label: "Inustificadas", key: "unjustified"},
    {label: "Total de faltas", key: "totalAbsences"},
  ]

  const dataForTable = studentsList.map((student) => {
    const {absences, grade, name, secondName, lastname, secondLastname} = student;
    return {
      student: `${lastname} ${secondLastname} ${name} ${secondName}`,
      grade,
      justified: absences.I,
      unjustified: absences.J,
      totalAbsences: absences.list.length,
    }
  })

  return (
    <div className="w-full min-h-full text-black p-4">
      <div className="bg-white rounded-md p-4">
        <DownloadCSV data={dataForTable} headers={headersForCSV} filename="students"/>
        <div className="px-[40px]">
          <Table data={dataForTable}/>
        </div>
      </div>
    </div>
  )
}

export default Students;