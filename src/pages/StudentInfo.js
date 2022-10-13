import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getStudentInfo } from "../store/students/studentsSlice";
import { getSubjects } from "../store/subjects/subjectsSlice";
import { format } from "date-fns";
import { spanishLocale, makeClassTimeHoursReadable } from "../helpers";
import _ from "lodash";
import Subject from "../components/Subject";

const StudentInfo = () => {
  const params = useParams();
  const {loading: studentsLoading, studentInfo, studentAbsences = []} = useSelector((state) => state.students);
  const {loading: loadingSubjects, list: subjectsList} = useSelector((state) => state.subjects);
  const [selectedSubject, setSelectedSubject] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const { grade, studentId } = params;
    if(grade && studentId) {
      dispatch(getStudentInfo({studentGrade: grade, studentId}))
    }
  }, []);

  useEffect(() => {
    dispatch(getSubjects())
  }, []);


  const onClickSubject = (subjectId) => {
    setSelectedSubject(selectedSubject === subjectId ? "" : subjectId)
  }

  const absencesList = studentAbsences.reduce((acc, currentItem) => {
    const month = format(currentItem.date, "LLLL", {locale: spanishLocale});
    // acc[month] = acc?.[month] ? [...acc?.[month], currentItem] : [currentItem];
    const curr = acc.get(month) ?? [];
    acc.set(month, [...curr, currentItem])
    return acc;
  }, new Map())

  const absencesBySubject = subjectsList?.map((subject) => {
    const absencesOfSubject = studentAbsences?.filter((absence) => absence.subjectId === subject.id);
    return {...subject, absences: absencesOfSubject.length}
  });

  return (
    <>
      {(studentsLoading || loadingSubjects) ? (
      <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 bg-slate-600 bg-opacity-25 z-10">
        <h2 className="text-3xl font-thin tracking-tight text-indigo-600">Cargando...</h2>
      </div>
    ) : null}
      <div className="w-full h-full p-4 flex flex-col gap-4">
          <div className="p-4 bg-white rounded-md flex justify-between">
            {studentInfo ? (
              <div className="flex flex-col justify-between grow">
                <div>
                  <p className="text-5xl">{studentInfo.lastname} {studentInfo.secondLastname}</p>
                  <p className="text-5xl">{studentInfo.name} {studentInfo.secondName}</p>
                  <p className="text-4xl font-thin">{studentInfo.grade}</p>
                </div>
                <div className="text-2xl">
                  <p className="text-indigo-600">Faltas</p>
                  <p className="text-xl font-thin">Injustificadas: <span className="px-2 rounded-md font-normal">{studentInfo.absences.I}</span></p>
                  <p className="text-xl font-thin">Justificadas: <span className="px-2 rounded-md font-normal">{studentInfo.absences.J}</span></p>
                </div>
              </div>
            ) : null}
            {absencesBySubject.length ? (
              <div className="grow text-sm">
                {absencesBySubject.map(subject => <Subject subject={subject} key={subject.id} onClickSubject={onClickSubject} selectedSubject={selectedSubject}/>)}
              </div>
            ) : null}
          </div>

          <div className="w-full h-[70%] bg-white rounded-md overflow-auto relative">
            {absencesList.size > 0 ? (
              [...absencesList].map(([key, value]) => (
                <div className="relative" key={key}>
                  <div className="sticky top-0 bg-indigo-600 px-1 text-white text-xs">{key}</div>
                  {
                    value.map(v => (
                      <div className={`p-2 border-b ${selectedSubject === v.subjectId ? 'bg-indigo-100' : ''}`} key={v.id} onClick={() => console.log(v)}>
                        <p className="">
                          {format(v.date, "iiii, dd LLLL yyyy", {locale: spanishLocale})}
                        </p>
                        <div className="text-sm flex gap-4 text-gray-500">
                          <p>{makeClassTimeHoursReadable(v.classTime)}</p> <i className='border-r '/>
                          <p>{v.subject}</p> <i className='border-r '/>
                          <p className={`${v.type === "I" ? 'text-red-700 bg-red-200' : 'text-yellow-700 bg-yellow-200' } rounded-full px-1`}>
                            {v.type === "I" ? "Injustificada" : "Justificada"}
                          </p> <i className='border-r '/>
                          <p><span className="text-indigo-400">Motivo:</span> {v.reason}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-2xl text-gray-500">No faltas registradas</p>
              </div>
            )}
          </div>
        </div>

    </>
  )
};

export default StudentInfo;