import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from '../components/Select';
import Toggle from '../components/Toggle';
import { selectUserInfo } from '../store/user/userSlice';
import { getSubjects } from '../store/subjects/subjectsSlice';
import { getStudentsOfUser } from '../store/students/studentsSlice';
import OptionsPicker from '../components/OptionsPicker';
import { createAbsenceRecord } from '../store/absences/absencesSlice';
import DatePicker from '../components/DatePicker/DatePicker';


const NewRecord = () => {
  const [student, setStudent] = useState(null);
  const [subject, setSubject] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [classTime, setClassTime] = useState(null);
  const [isUnjustified, setIsUnjustified] = useState(true);
  const [reason, setReason] = useState("");

  const { userId, userInfo } = useSelector((state) => state.user);
  const { loading: loadingSubjects, list: subjectsList } = useSelector((state) => state.subjects);
  const { loading: loadingStudents, list: studentsList } = useSelector((state) => state.students);
  const dispatch = useDispatch();

  const mappedStudents = studentsList?.map(({id, name, secondName, lastName, secondLastname}) => ({ id, value: `${name} ${secondName} ${lastName} ${secondLastname}`}));

  const mappedSubjects = subjectsList?.map(({ id, subjectName }) => ({id, value: subjectName}));

  const daysOfTheWeekOptions = [
    {id: "L1", value: "Lunes", valueToDisplay: "L"},
    {id: "M2", value: "Martes", valueToDisplay: "M"},
    {id: "Mi3", value: "Miércoles", valueToDisplay: "Mi"},
    {id: "J4", value: "Jueves", valueToDisplay: "J"},
    {id: "V5", value: "Viernes", valueToDisplay: "V"},
    {id: "S6", value: "Sabado", valueToDisplay: "S"},
    {id: "D7", value: "Domingo", valueToDisplay: "D"},
  ];

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
    const data = {
      student,
      subject,
      dayOfWeek,
      classTime,
      isUnjustified,
      reason,
      userId,
      userInfo,
    };

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
      <div className="w-full h-full bg-slate-500 flex justify-center items-center">
        <h1>Cargando...</h1>
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
          {/* <OptionsPicker options={daysOfTheWeekOptions} label="Día de la semana" onChange={(value) => setDayOfWeek(value)}/> */}
          <DatePicker label="Fecha"/>
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
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Una corta descripción acerca de esta falta.
          </p>
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

/*
<div key={option.value} className="flex items-center">
  <input
    id={`filter-mobile-${section.id}-${optionIdx}`}
    name={`${section.id}[]`}
    defaultValue={option.value}
    type="checkbox"
    defaultChecked={option.checked}
    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
  />
  <label
    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
    className="ml-3 min-w-0 flex-1 text-gray-500"
  >
    {option.label}
  </label>
</div>
*/