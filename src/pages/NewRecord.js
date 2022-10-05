import { useState, useEffect } from 'react';
import { createAbsenceRecord } from '../store/absences/absencesSlice';
import { getStudentsOfUser } from '../store/students/studentsSlice';
import { getSubjects } from '../store/subjects/subjectsSlice';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from '../components/DatePicker/DatePicker';
import OptionsPicker from '../components/OptionsPicker';
import Select from '../components/Select';
import Toggle from '../components/Toggle';

const NewRecord = () => {
  const [student, setStudent] = useState(null);
  const [subject, setSubject] = useState(null);
  const [date, setDate] = useState(Date.now());
  const [classTime, setClassTime] = useState(null);
  const [isUnjustified, setIsUnjustified] = useState(true);
  const [reason, setReason] = useState("");

  const { userId, userInfo } = useSelector((state) => state.user);
  const { loading: loadingSubjects, list: subjectsList } = useSelector((state) => state.subjects);
  const { loading: loadingStudents, list: studentsList } = useSelector((state) => state.students);
  const dispatch = useDispatch();

  const mappedStudents = studentsList?.map(({id, name, secondName, lastname, secondLastname, grade}) => ({ id, value: `${lastname} ${secondLastname} ${name} ${secondName}`, grade}));

  const mappedSubjects = subjectsList?.map(({ id, subjectName }) => ({id, value: subjectName}));

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

    dispatch(createAbsenceRecord(data))
  }

  useEffect(() => {
    dispatch(getSubjects());
  }, [])

  useEffect(() => {
    if(userInfo) {
      dispatch(getStudentsOfUser(userInfo.tutorOf));
    }
  }, [userInfo, dispatch]);

  if(loadingSubjects || loadingStudents) {
    return (
      <div className="w-full h-full bg-slate-100 flex justify-center items-center">
        <h2 className="text-3xl font-thin tracking-bold text-indigo-600">Cargando...</h2>
      </div>
    )
  }

  return (
    <div className='w-full h-full text-black p-4'>
      <div className='bg-white rounded-md p-4 grid grid-cols-2 gap-5'>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 col-span-2 text-center">Registrar Falta</h1>
        <div>
          <Select options={mappedStudents} label="Estudiante" onChange={(value) => setStudent(value)}/>
        </div>
        <div>
          <Select options={mappedSubjects} label="Materia" onChange={(value) => setSubject(value)}/>
        </div>
        <div>
          <DatePicker label="Fecha" onChange={(value) => setDate(value)} date={date}/>
        </div>
        <div>
          <OptionsPicker options={classTimesOptions} label="Hora de clase" onChange={(value) => setClassTime(value)}/>
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
            />
          </div>
        </div>
        <button
          className="col-span-2 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleOnClick}
        >Registrar</button>
      </div>
    </div>
  )
};

export default NewRecord;
