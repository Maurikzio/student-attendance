import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentsByGrade, getStudentsOfUser } from '../store/students/studentsSlice';
import { selectUserInfo } from "../store/user/userSlice";
import DownloadCSV from "../components/DownloadCSV/DownloadCSV";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import OptionsPicker from "../components/OptionsPicker";
import { gradeLetters, grades } from "../helpers";


const Students = () => {
  const [selectedGrade, setSelectedGrade] = useState({id: 8, value: "Octavo"});
  const [gradeLetter, setGradeLetter] = useState("");
  const userInfo = useSelector(selectUserInfo);
  const {loading: studentsLoading, list: studentsList} = useSelector((state) => state.students);
  const dispatch = useDispatch();

  const onSelectGrade = (grade) => {
    setSelectedGrade(grade);
    setGradeLetter("");
  }

  useEffect(() => {
    if(userInfo?.tutorOf) {
      dispatch(getStudentsOfUser(userInfo.tutorOf));
    } else if  (userInfo?.role === "inspector" && selectedGrade) {
      dispatch(getStudentsByGrade(selectedGrade.id));
    }
  }, [userInfo, dispatch, selectedGrade]);

  const headersForCSV = [
    {label: "Estudiante", key: "student"},
    {label: "Curso", key: "grade"},
    {label: "Justificadas", key: "justified"},
    {label: "Injustificadas", key: "unjustified"},
    {label: "Total de faltas", key: "totalAbsences"},
  ];

  const dataForTable = studentsList?.reduce((acc, student) => {
    if(student.grade.includes(gradeLetter?.id || "")) {
      const {absences, grade, name, secondName, lastname, secondLastname, id} = student;
      acc.push({
        student: `${lastname} ${secondLastname} ${name} ${secondName}`,
        grade,
        justified: absences.J,
        unjustified: absences.I,
        totalAbsences: absences.list.length,
        studentId: id,
      });
    }
    return acc;
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('student', {
      header: "Estudiante",
      cell: info => {
        const studentInfo = info.cell.row.original;
        return (
          <Link
            className="hover:text-indigo-600"
            to={`/estudiante/${studentInfo.grade}/${studentInfo.studentId}`}
          >
            {info.getValue()}
          </Link>
        )
      },
      accessorKey: "student"
    }),
    columnHelper.accessor(row => row.grade, {
      id: "grade",
      // cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Curso</span>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('justified', {
      header: () => 'Justificadas',
      cell: info => info.renderValue(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor('unjustified', {
      header: () => <span>Injustificadas</span>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('totalAbsences', {
      header: 'Total de faltas',
      cell: info => info.renderValue(),
      enableColumnFilter: false,
    }),
  ];

  const gradeLettersForGradeSelected = gradeLetters.filter((gradeLetter) => gradeLetter.grades.includes(selectedGrade.id));

  return (
    <>
    {studentsLoading ? (
      <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 bg-slate-600 bg-opacity-25">
        <h2 className="text-3xl font-thin tracking-tight text-indigo-600">Cargando...</h2>
      </div>
    ) : null}
    <div className="w-full text-black p-4 h-full max-h-full">
      <div className="bg-white rounded-md p-4 flex flex-col h-full overflow-auto">
        <div className="flex">
          <div className="flex gap-4">
            <div>
              <OptionsPicker options={grades} size="sm" onChange={onSelectGrade} optionSelected={selectedGrade}/>
            </div>
            <div>
              <OptionsPicker options={gradeLettersForGradeSelected} size="sm" onChange={(value) => setGradeLetter(value.id === gradeLetter.id ? "" : value)} optionSelected={gradeLetter}/>
            </div>
          </div>

          <div className="ml-auto">
            <DownloadCSV data={dataForTable} headers={headersForCSV} filename="students"/>
          </div>
        </div>
        <div className="px-[40px]">
          <Table data={dataForTable} columns={columns}/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Students;