import { useState, useEffect } from 'react';
import { createAbsenceRecord } from '../store/absences/absencesSlice';
import { getStudentsByGrade, getStudentsOfUser } from '../store/students/studentsSlice';
import { getSubjects } from '../store/subjects/subjectsSlice';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from '../components/DatePicker/DatePicker';
import OptionsPicker from '../components/OptionsPicker';
import Select from '../components/Select';
import Toggle from '../components/Toggle';
import { gradeLetters, grades } from '../helpers';

const NewRecord = () => {
  const [student, setStudent] = useState(null);
  const [subject, setSubject] = useState(null);
  const [date, setDate] = useState(Date.now());
  const [classTime, setClassTime] = useState(null);
  const [isUnjustified, setIsUnjustified] = useState(true);
  const [reason, setReason] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [gradeLetter, setGradeLetter] = useState("");

  const { userId, userInfo } = useSelector((state) => state.user);
  const { loading: loadingSubjects, list: subjectsList } = useSelector((state) => state.subjects);
  const { loading: loadingStudents, list: studentsList } = useSelector((state) => state.students);
  const dispatch = useDispatch();

  const classTimesOptions = [
    {id: "CT1", value: 1},
    {id: "CT2", value: 2},
    {id: "CT3", value: 3},
    {id: "CT4", value: 4},
    {id: "CT5", value: 5},
    {id: "CT6", value: 6},
    {id: "CT7", value: 7},
  ]

  const handleOnClick = () => {
    const { name, secondName, lastname, secondLastname } = userInfo;

    const data = {
      classTime: classTime.value,
      createdBy:`${lastname} ${secondLastname} ${name} ${secondName}`,
      createdById: userId,
      createdWhen: Date.now(),
      date,
      grade: student.grade,
      modifiedBy: "",
      modifiedById: "",
      modifiedWhen: "",
      reason,
      student: student.value,
      studentId: student.id,
      subject: subject.value,
      subjectId: subject.id,
      type: isUnjustified ? "I" : "J",
    }

    dispatch(createAbsenceRecord(data));
    setStudent(null);
    setSubject(null);
    setClassTime(null);
    setReason("");
  }

  const onSelectGrade = (grade) => {
    setSelectedGrade(grade);
    setGradeLetter("");
  }

  useEffect(() => {
    dispatch(getSubjects());
  }, [])

  useEffect(() => {
    if(userInfo?.tutorOf) {
      dispatch(getStudentsOfUser(userInfo.tutorOf));
    } else if(userInfo?.role === "inspector" && selectedGrade) {
      dispatch(getStudentsByGrade(selectedGrade.id))
    }
  }, [userInfo, dispatch, selectedGrade]);

  const mappedStudents = studentsList?.reduce((acc, student) => {
    if(student.grade.includes(gradeLetter?.id || "")) {
      acc.push({id: student.id, value: `${student.lastname} ${student.secondLastname} ${student.name} ${student.secondName}`, grade: student.grade});
    }
    return acc;
  }, []);

  const mappedSubjects = subjectsList?.map(({ id, subjectName }) => ({id, value: subjectName}));

  const gradeLettersForGradeSelected = !selectedGrade ? gradeLetters : gradeLetters.filter((gradeLetter) => gradeLetter.grades.includes(selectedGrade?.id));

  return (
    <>
    {(loadingSubjects || loadingStudents)  ? (
      <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 bg-slate-600 bg-opacity-25 z-10">
        <h2 className="text-3xl font-thin tracking-tight text-indigo-600">Cargando...</h2>
      </div>
    ) : null}
    <div className='w-full h-full text-black p-4 flex items-center justify-center content-center'>
      <div className='bg-white rounded-md p-10 grid grid-cols-2 gap-5'>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 col-span-2 text-center">Registrar Falta</h1>
        {userInfo?.role === "inspector" ? (
          <>
            <div>
              <OptionsPicker
                options={grades}
                label="Curso"
                optionSelected={selectedGrade}
                onChange={onSelectGrade}
              />
            </div>
            <div>
              <OptionsPicker
                options={gradeLettersForGradeSelected}
                label="Paralelo"
                onChange={(value) => setGradeLetter(value.id === gradeLetter.id ? "" : value)}
                optionSelected={gradeLetter}
              />
            </div>
          </>
        ): null}
        <div>
          <Select options={mappedStudents} label="Estudiante" onChange={(value) => setStudent(value)} selectedOption={student}/>
        </div>
        <div>
          <Select options={mappedSubjects} label="Materia" onChange={(value) => setSubject(value)} selectedOption={subject}/>
        </div>
        <div>
          <DatePicker label="Fecha" onChange={(value) => setDate(value)} date={date}/>
        </div>
        <div>
          <OptionsPicker options={classTimesOptions} label="Hora de clase" onChange={(value) => setClassTime(value)} optionSelected={classTime}/>
        </div>
        <div>
          <Toggle
            isChecked={isUnjustified}
            label="Tipo de falta"
            onChange={(value) => setIsUnjustified(value)}
            textForChecked="Injustificada"
            textForUnchecked="Justificada"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="reason" className="text-sm font-medium text-gray-700">
            Razon:
          </label>
          <div className="mt-1">
            <textarea
              id="reason"
              name="reason"
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Una corta descripción acerca de esta falta"
              maxLength={300}
            />
          </div>
        </div>
        <button
          disabled={!student || !subject || !date || !classTime || !reason}
          className="col-span-2 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm enabled:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
          onClick={handleOnClick}
        >Registrar</button>
      </div>
    </div>
    </>
  )
};

export default NewRecord;
