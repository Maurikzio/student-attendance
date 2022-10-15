import React, { useState } from 'react';
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    secondName: "",
    lastname: "",
    secondLastname: "",
    role: "tutor",
    grade: "8",
    gradeLetter: "A",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { target: { name, value }} = event;
    setUserInfo({ ...userInfo, [name]: value})
  }

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setError(null);
  //   try {
  //     await signUp(user);
  //     navigate("/");
  //   } catch(err) {
  //     console.log("errr", err);
  //     setError(err.message);
  //   }
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();
     try {
       const createdUser = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password);

      const docRef = doc(db, `users/${createdUser.user.uid}`)
      const { name, secondName, lastname, secondLastname, email, role, grade, gradeLetter } = userInfo;
      const objToSave = { name, secondName, lastname, secondLastname, email, role };

      if(role === "tutor") {
        objToSave.tutorOf = `${grade}${gradeLetter}`;
      }

      await setDoc(docRef, {...objToSave})

     } catch (err) {
        throw new Error(err.message);
     }
  }

  return (
    <>
      <div className="mt-10 sm:mt-0 self-center mx-auto">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Informacion de Usuario</h3>
              <p className="mt-1 text-sm text-gray-600 max-w-xs">El correo y contraseña ingresados se utilizarán para el ingreso al sistema.</p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit}>
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="off"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={handleChange}
                        value={userInfo.name}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="secondName" className="block text-sm font-medium text-gray-700">
                        Segundo nombre
                      </label>
                      <input
                        type="text"
                        name="secondName"
                        id="secondName"
                        autoComplete="off"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={handleChange}
                        value={userInfo.secondName}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        autoComplete="off"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={handleChange}
                        value={userInfo.lastname}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="secondLastname" className="block text-sm font-medium text-gray-700">
                        Segundo apellido
                      </label>
                      <input
                        type="text"
                        name="secondLastname"
                        id="secondLastname"
                        autoComplete="off"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={handleChange}
                        value={userInfo.secondLastname}
                      />
                    </div>

                    <hr className='col-span-6'/>

                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo electronico
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        autoComplete="off"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={handleChange}
                        value={userInfo.email}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="off"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={handleChange}
                        value={userInfo.password}
                      />
                    </div>

                    <hr className='col-span-6'/>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Rol
                      </label>
                      <select
                        id="role"
                        name="role"
                        autoComplete="off"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={handleChange}
                        value={userInfo.role}
                      >
                        <option value="tutor">Tutor</option>
                        <option value="inspector">Inspector</option>
                      </select>
                    </div>

                    {userInfo.role === "tutor" ? <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                        Curso
                      </label>
                      <select
                        id="grade"
                        name="grade"
                        autoComplete="off"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={handleChange}
                        value={userInfo.grade}
                      >
                        <option value="8">Octavo</option>
                        <option value="9">Noveno</option>
                        <option value="10">Décimo</option>
                      </select>
                    </div> : null}

                    {userInfo.role === "tutor" ? <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label htmlFor="gradeLetter" className="block text-sm font-medium text-gray-700">
                        Paralelo
                      </label>
                      <select
                        id="gradeLetter"
                        name="gradeLetter"
                        autoComplete="off"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={handleChange}
                        value={userInfo.gradeLetter}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                      </select>
                    </div> : null}

                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Registrar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register;
