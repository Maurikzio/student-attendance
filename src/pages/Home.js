import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserStudents } from '../store/students/studentsSlice';
import { getSubjects, selectSubjects } from '../store/subjects/subjectsSlice';
import { selectUserInfo, getUserInfo } from '../store/user/userSlice';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';

const Home = () => {
  const dispatch = useDispatch();
  const { loading: loadingSubjects} = useSelector((state) => state.subjects);
  const { loading: loadingStudents} = useSelector((state) => state.students);

  // const [student, setStudent] = useState({name: "", secondName: "", lastName: "", secondLastname: ""});

  useEffect(() => {
    dispatch(getSubjects());
  }, [])

  useEffect(() => {
    dispatch(getUserStudents());
  }, [])

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

  if(loadingSubjects || loadingStudents) {
    return (
      <div className="w-full h-full bg-slate-500 flex justify-center items-center">
        <h1>Cargando...</h1>
      </div>
    )
  }

  return (
    <div className='w-full h-full text-black p-4'>
      <h1>Home</h1>

    </div>
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