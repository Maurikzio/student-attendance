import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import { auth } from "./firebase/firebaseConfig";
import { logoutUser } from "./store/user/userSlice";
import Students from "./pages/Students";
import NotFound from "./components/NotFound";
import NewRecord from "./pages/NewRecord";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentInfo from "./pages/StudentInfo";

export default function App() {
  const { userId, userToken, isLoggedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { userToken:uToken =null } = localStorage.getItem('ea') ? JSON.parse(localStorage.getItem('ea')) : {};

  //TODO: CASE-001: Needs checking..., maybe move out off App, since loing does not need to know if the user is logged in or not
 /*useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      console.log("token in localstorage:", uToken);
      console.log("userToken:", userToken);
      console.log("from onAuthStateChanged:", currentUser?.accessToken);
      if(currentUser?.accessToken !== uToken && isLoggedIn){
        console.log("needs logout")
        dispatch(logoutUser());
      } else {
        console.log("can continue..")
      }
      // if(userId === currentUser?.uid && userToken !== currentUser?.accessToken) {
      //   dispatch(logoutUser());
      // }
    })

    return () => unsub()
  }, [])*/

  return (
    <div className="bg-[#f2f2f2] h-screen text-black flex">
        <Routes>
          <Route path='*' element={<NotFound/>} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }/>
          <Route path="/estudiantes" element={
            <ProtectedRoute>
              <Students/>
            </ProtectedRoute>
          }/>
          <Route path="/estudiante/:grade/:studentId" element={
            <ProtectedRoute>
              <StudentInfo/>
            </ProtectedRoute>
          }/>
          <Route path="/nuevo-registro" element={
            <ProtectedRoute>
              <NewRecord />
            </ProtectedRoute>
          }/>
          <Route path="/ingresar" element={<Login/>} />
          {/* <Route path="/register" element={<Register/>} /> */}
        </Routes>
        <ToastContainer/>
    </div>
  )
};