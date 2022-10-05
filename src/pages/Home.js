import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserStudents } from '../store/students/studentsSlice';
import { getSubjects, selectSubjects } from '../store/subjects/subjectsSlice';
import { selectUserInfo, getUserInfo } from '../store/user/userSlice';
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';
import { deleteAbsence, getAbsencesAddedByUser, updateAbsencesList } from '../store/absences/absencesSlice';
import { getArrayFromCollection } from '../store/helpers';
import Modal from '../components/Modal';

const createAbsenceTypeBadge = (type) => {
  const absenceTypeText = type === "I" ? "Injustificada" : "Justificada";
  return (
    <div className={`${type === "I" ? "text-red-700 bg-red-200" : "text-yellow-700 bg-yellow-200"} rounded-full text-xs px-1 font-bold`}>
      {absenceTypeText}
    </div>
  )
}

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState(null);
  const userInfo = useSelector(selectUserInfo);
  const { list: listOfAbsences, loading: absencesLoading } = useSelector((state) => state.absences);

  const dispatch = useDispatch();

  // const [student, setStudent] = useState({name: "", secondName: "", lastName: "", secondLastname: ""});

  // const handleOnClick = async () => {
  //   const {name, secondName, lastName, secondLastname} = student;

  //   const data = {
  //     absences: {I: 0, J: 0, list: []},
  //     grade: "8D",
  //     lastName,
  //     secondLastname,
  //     name,
  //     secondName,
  //   };
  //   try {
  //     await addDoc(collection(db, "students"), data);
  //     console.log("Successfully added");
  //   } catch(err) {
  //     throw new Error(err);
  //   }
  // }

  // const handleOnChange = (event) => {
  //   const { target: { name, value}} = event;
  //   setStudent({...student, [name]: value});
  // }

  const makeClassTimeHoursReadable = (hour) => {
    const classTimeHours = {
      1: "Primera",
      2: "Segunda",
      3: "Tercera",
      4: "Cuarta",
      5: "Quinta",
      6: "Sexta",
      7: "Septima"
    };
    return `${classTimeHours[hour]} hora`
  };

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

  useEffect(() => {
    if (userInfo) {
      dispatch(getAbsencesAddedByUser(userInfo.tutorOf))
    }
  }, [userInfo, dispatch]);

  if (absencesLoading) {
    return (
      <div className="w-full h-full bg-slate-100 flex justify-center items-center">
        <h2 className="text-3xl font-thin tracking-tight text-indigo-600">Cargando...</h2>
      </div>
    )
  }

  return (
    <>
    <div className='w-full h-full text-black p-4'>
      <h2 className="text-3xl m-[20px] font-bold tracking-tight text-indigo-600 col-span-2 text-center">Mis registros</h2>
      <div className="grid grid-cols-2 gap-5">
        {
          listOfAbsences?.map(absence => (
            <div className="rounded-md bg-white p-4" key={absence.id}>
              <div className='font-bold pb-2 flex justify-between'>
                <p>{absence.student}</p>
                <div className='flex gap-5 items-center font-normal text-xs text-indigo-600'>
                  <button
                    className="hover:bg-indigo-600 hover:text-white rounded-sm px-1"
                    onClick={() => onDeleteClick(absence)}
                  >Eliminar</button>
                  {createAbsenceTypeBadge(absence.type)}
                </div>
              </div>
              <div className="flex gap-4 pb-2 text-sm font-medium text-gray-700">
                <p>{absence.grade}</p>
                <p>{absence.subject}</p>
                <p>{makeClassTimeHoursReadable(absence.classTime)}</p>
              </div>
              <div className='pb-2 border-b text-sm font-medium text-gray-700'>
                <p><span className='text-indigo-600 font-medium'>Reportado por:</span> {absence.createdBy}</p>
              </div>
              <div className="text-sm font-medium text-gray-700 pt-2">
                <p><span className='text-indigo-600'>Razón:</span> {absence.reason}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
    <Modal
      isOpen={isModalOpen}
      closeModal={onCloseModal}
      title="Desea eliminar registro?"
      contentText="Este proceso es irreversible, no se podrán recuperar los datos asociados a este registro y de continuar se modificarán las estadíticas del estudiante relacionado con este registro. "
      yesText="Si, continuar!"
      noText="No"
      onYesButton={onYesButtonClick}
    />
    </>
  );
}

export default Home;


{/* <label>
        <h3>Lastname:</h3>
        <input name="lastName" value={student.lastName} onChange={handleOnChange} autoComplete="off"/>
      </label>
      <label>
        <h3>SecondLastname:</h3>
        <input name="secondLastname" value={student.secondLastname} onChange={handleOnChange} autoComplete="off"/>
      </label>
      <label>
        <h3>Name:</h3>
        <input name="name" value={student.name} onChange={handleOnChange} autoComplete="off"/>
      </label>
      <label>
        <h3>SecondName:</h3>
        <input name="secondName" value={student.secondName} onChange={handleOnChange} autoComplete="off"/>
      </label>
      <hr className='mt-3'/>
      <button
        className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm"
        onClick={handleOnClick}
      >Add student</button> */}