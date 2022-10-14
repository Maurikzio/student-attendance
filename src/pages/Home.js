import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserStudents } from '../store/students/studentsSlice';
import { getSubjects, selectSubjects } from '../store/subjects/subjectsSlice';
import { selectUserInfo, getUserInfo } from '../store/user/userSlice';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';
import { deleteAbsence, getAbsencesAddedByUser, getAbsencesByGrade, updateAbsenceType } from '../store/absences/absencesSlice';
import { getArrayFromCollection, makeClassTimeHoursReadable, spanishLocale, months, gradeLetters, grades } from '../helpers';
import Modal from '../components/Modal';
import ReactTooltip from 'react-tooltip';
import { differenceInBusinessDays, format, getMonth } from 'date-fns';
import { addDays } from 'date-fns/esm';
import { Link } from 'react-router-dom';
import OptionsPicker from '../components/OptionsPicker';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState({id: 8, value: "Octavo"});
  const [gradeLetter, setGradeLetter] = useState("");
  const userInfo = useSelector(selectUserInfo);
  const { list: listOfAbsences, loading: absencesLoading } = useSelector((state) => state.absences);

  const dispatch = useDispatch();

  const onCloseModal = () => {
    setAbsenceToDelete(null)
    setIsModalOpen(false);
  }

  const onYesButtonClick = () => {
    if(absenceToDelete) {
      const studentId = absenceToDelete.studentId;
      const absenceId = absenceToDelete.id;
      const absenceType = absenceToDelete.type;
      const studentGrade = absenceToDelete.grade;

      dispatch(deleteAbsence({studentId, absenceId, absenceType, studentGrade}));
    }
    onCloseModal();
  }

  const onDeleteClick = (absence) => {
    setAbsenceToDelete(absence);
    setIsModalOpen(true);
  }

  const onSelectGrade = (grade) => {
    setSelectedGrade(grade);
    setGradeLetter("");
    // dispatch(getAbsencesByGrade(grade.id))
  }

  useEffect(() => {
    if (userInfo?.tutorOf) {
      dispatch(getAbsencesAddedByUser(userInfo.tutorOf))
    } else if(userInfo?.role === "inspector" && selectedGrade) {
      dispatch(getAbsencesByGrade(selectedGrade.id))
    }
  }, [userInfo, dispatch, selectedGrade]);


  const absencesListByMonth = listOfAbsences?.reduce((acc, currAbsence) => {
    if(currAbsence.grade.includes(gradeLetter?.id || "")) {
      const month = getMonth(currAbsence.date);
      const curr = acc.get(month) ?? [];
      const isEditable =  differenceInBusinessDays(addDays(new Date(currAbsence.date), 2), new Date()) >= 0;
      acc.set(month, [...curr, {...currAbsence, isEditable}]);
    }
    return acc;
  }, new Map());

  const gradeLettersForGradeSelected = gradeLetters.filter((gradeLetter) => gradeLetter.grades.includes(selectedGrade.id));

  return (
    <>
    {absencesLoading ? (
      <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 bg-slate-600 bg-opacity-25 z-10 backdrop-blur-sm">
        <h2 className="text-3xl font-thin tracking-tight text-indigo-600">Cargando...</h2>
      </div>
    ) : null}
    <div className='w-full h-full text-black p-4'>
      {
        userInfo?.role === "inspector" ? (
          <div className='flex justify-center mb-2'>
            <div className='flex items-center justify-center gap-4 rounded-md bg-white p-2'>
              <div>
                <OptionsPicker options={grades} onChange={onSelectGrade} optionSelected={selectedGrade}/>
              </div>
              <div className='w-[190px]'>
                <OptionsPicker options={gradeLettersForGradeSelected} onChange={(value) => setGradeLetter(value.id === gradeLetter.id ? "" : value)} optionSelected={gradeLetter}/>
            </div>
            </div>
          </div>
        ) : (
          <h2 className="text-3xl mb-[20px] font-bold tracking-tight text-indigo-600 col-span-2 text-center">Mis registros</h2>
        )
      }

      <div className="grid grid-cols-2 overflow-auto h-[92%]">
        {absencesListByMonth.size > 0 ? (
          [...absencesListByMonth].map(([key, value]) => (
            <div className="relative col-span-2" key={key}>
              <div className="sticky top-0 bg-indigo-100 px-1 text-indigo-600 text-xs">{months[key]}</div>
              <div className='grid grid-cols-2 gap-4'>
                {value.map((absence) => (
                  <div className="rounded-md bg-white p-2" key={absence.id}>
                    <div className='font-bold pb-2 flex justify-between'>
                      <Link to={`/estudiante/${absence.grade}/${absence.studentId}`}>{absence.student}</Link>
                      <div className='flex gap-5 items-center font-normal text-xs text-indigo-600'>
                        <button
                          disabled={!absence.isEditable}
                          className="enabled:hover:bg-indigo-600 enabled:hover:text-white rounded-sm px-1 disabled:opacity-75"
                          onClick={() => onDeleteClick(absence)}
                        >Eliminar</button>
                        <button
                          disabled={!absence.isEditable}
                          onClick={() => dispatch(updateAbsenceType(absence))}
                          data-tip
                          data-for="absenceTypeBadge"
                          className={`${absence.type === "I" ? "text-red-700 bg-red-200" : "text-yellow-700 bg-yellow-200"} rounded-full text-xs px-1 font-bold disabled:opacity-75`}
                        >
                          {absence.type === "I" ? "Injustificada" : "Justificada"}
                        </button>
                        <ReactTooltip id="absenceTypeBadge" place="top" effect='solid'>
                          Haga click para cambiar el tipo de la falta.
                        </ReactTooltip>
                      </div>
                    </div>
                    <div className="flex gap-4 pb-2 text-sm text-gray-500">
                      <p>{absence.grade}</p> <i className='border-r '/>
                      <p>{absence.subject}</p> <i className='border-r '/>
                      <p>{makeClassTimeHoursReadable(absence.classTime)}</p> <i className='border-r '/>
                      <p>{format(absence.date, "iiii, dd LLLL yyyy", { locale: spanishLocale })}</p>
                    </div>
                    <div className='pb-2 border-b text-sm text-gray-500'>
                      <p><span className='text-indigo-400'>Reportado por:</span> {absence.createdBy}</p>
                    </div>
                    <div className="text-sm text-gray-500 pt-2">
                      <p><span className='text-indigo-400'>Motivo:</span> {absence.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className='flex items-center justify-center col-span-2'>
            <p className='text-2xl text-gray-500'>No se han registrado faltas</p>
          </div>
        )}
      </div>
    </div>
    <Modal
      isOpen={isModalOpen}
      closeModal={onCloseModal}
      title="¿Desea eliminar registro?"
      contentText="Este proceso es irreversible, no se podrán recuperar los datos asociados a este registro y de continuar se modificarán las estadíticas del estudiante."
      yesText="Si, continuar!"
      noText="No"
      onYesButton={onYesButtonClick}
    />
    </>
  );
}

export default Home;
