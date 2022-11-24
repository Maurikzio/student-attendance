import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentsByGrade, getStudentsOfUser } from '../store/students/studentsSlice';
import { selectUserInfo } from "../store/user/userSlice";
import DownloadCSV from "../components/DownloadCSV/DownloadCSV";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import OptionsPicker from "../components/OptionsPicker";
import { getSubjectsAlerts, gradeLetters, grades } from "../helpers";
import { getSubjects } from "../store/subjects/subjectsSlice";
import Spinner from "../components/Spinner";
import StudentName from "../components/StudentName";

const Students = () => {
  const [selectedGrade, setSelectedGrade] = useState({id: 8, value: "Octavo"});
  const [gradeLetter, setGradeLetter] = useState("");
  const userInfo = useSelector(selectUserInfo);
  const {loading: studentsLoading, list: studentsList} = useSelector((state) => state.students);
  const { loading: loadingSubjects, list: subjectsList } = useSelector((state) => state.subjects);

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
    dispatch(getSubjects())
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
      const {absences, grade, name, secondName, lastname, secondLastname, id, locked=false} = student;
      acc.push({
        student: `${lastname} ${secondLastname} ${name} ${secondName}`,
        grade,
        justified: absences.J,
        unjustified: absences.I,
        totalAbsences: Object.values(absences?.list || {})?.length,
        studentId: id,
        alerts: getSubjectsAlerts(subjectsList, student?.absences?.list),
        locked
      });
    }
    return acc;
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('student', {
      header: "Estudiante",
      cell: info => <StudentName info={info}/>,
      accessorKey: "student"
    }),
    columnHelper.accessor(row => row.grade, {
      id: "grade",
      header: () => <span>Curso</span>,
      cell: info => <div className={`${info.row.original?.locked ? 'opacity-50' : 'opacity-100'}`}>{info.renderValue()}</div>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('justified', {
      header: () => 'Justificadas',
      cell: info => <div className={`${info.row.original?.locked ? 'opacity-50' : 'opacity-100'}`}>{info.renderValue()}</div>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('unjustified', {
      header: () => <span>Injustificadas</span>,
      cell: info => <div className={`${info.row.original?.locked ? 'opacity-50' : 'opacity-100'}`}>{info.renderValue()}</div>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('totalAbsences', {
      header: 'Total de faltas',
      cell: info => <div className={`${info.row.original?.locked ? 'opacity-50' : 'opacity-100'}`}>{info.renderValue()}</div>,
      enableColumnFilter: false,
    }),
  ];

  const gradeLettersForGradeSelected = gradeLetters.filter((gradeLetter) => gradeLetter.grades.includes(selectedGrade.id));

  return (
    <>
    <Spinner isLoading={studentsLoading || loadingSubjects}/>
    <div className="w-full text-black p-4 h-full max-h-full">
      <div className="bg-white rounded-md p-4 flex flex-col h-full overflow-auto">
        <div className="flex">
          {userInfo?.role === "inspector" ? (
            <div className="flex gap-4">
              <div>
                <OptionsPicker options={grades} size="sm" onChange={onSelectGrade} optionSelected={selectedGrade}/>
              </div>
              <div>
                <OptionsPicker options={gradeLettersForGradeSelected} size="sm" onChange={(value) => setGradeLetter(value.id === gradeLetter.id ? "" : value)} optionSelected={gradeLetter}/>
              </div>
            </div>
          ) : null}
          <div className="ml-auto">
            <DownloadCSV data={dataForTable} headers={headersForCSV} filename={`estudiantes-faltas}`}/>
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