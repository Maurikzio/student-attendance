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
      dispatch(getStudentsOfUser(userInfo.tutorOf));
    }
  }, [userInfo, dispatch]);

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
      justified: absences.J,
      unjustified: absences.I,
      totalAbsences: absences.list.length,
    }
  })

  // if (studentsLoading) {
  //   return (
  //     <div className="w-full h-full bg-slate-100 flex justify-center items-center">
  //       <h2 className="text-3xl font-thin tracking-tight text-indigo-600">Cargando...</h2>
  //     </div>
  //   )
  // }

  return (
    <>
    {studentsLoading ? (
      <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 bg-slate-600 bg-opacity-25">
        <h2 className="text-3xl font-thin tracking-tight text-indigo-600">Cargando...</h2>
      </div>
    ) : null}
    <div className="w-full min-h-full text-black p-4">
      <div className="bg-white rounded-md p-4 flex flex-col">
        <div className="ml-auto">
          <DownloadCSV data={dataForTable} headers={headersForCSV} filename="students"/>
        </div>
        <div className="px-[40px]">
          <Table data={dataForTable}/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Students;