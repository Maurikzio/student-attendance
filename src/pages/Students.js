import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentsByGrade, getStudentsOfUser } from '../store/students/studentsSlice';
import { selectUserInfo } from "../store/user/userSlice";
import DownloadCSV from "../components/DownloadCSV/DownloadCSV";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import OptionsPicker from "../components/OptionsPicker";
import { getSubjectsAlerts, gradeLetters, grades, spanishLocale } from "../helpers";
import { format } from "date-fns";
import { getSubjects } from "../store/subjects/subjectsSlice";

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
      const {absences, grade, name, secondName, lastname, secondLastname, id} = student;
      acc.push({
        student: `${lastname} ${secondLastname} ${name} ${secondName}`,
        grade,
        justified: absences.J,
        unjustified: absences.I,
        totalAbsences: Object.values(absences?.list || {})?.length,
        studentId: id,
        alerts: getSubjectsAlerts(subjectsList, student?.absences?.list),
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
        const colors = {
          yellow: "bg-yellow-400",
          green: "bg-green-500",
          red: "bg-red-600"
        }

        const alerts = Object.entries(studentInfo.alerts).map(([k, v]) => {
          return (
            colors?.[k] ? <span key={k} className={`${colors[k]} w-4 h-4 rounded-full text-center flex items-center justify-center text-sm`}>{v}</span> : null
          )
        });

        return (
          <div className="flex items-center">
            <Link
              className="hover:text-indigo-600"
              to={`/estudiante/${studentInfo.grade}/${studentInfo.studentId}`}
            >
              {info.getValue()}
            </Link>
            <div className="ml-4 flex gap-1">{alerts}</div>
          </div>
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
    {(studentsLoading || loadingSubjects) ? (
      <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 bg-slate-600 bg-opacity-25 backdrop-blur-sm">
        <div className="spinner"></div>
      </div>
    ) : null}
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