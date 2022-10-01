import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import { auth } from "./firebase/firebaseConfig";
import { logoutUser } from "./store/user/userSlice";
import Students from "./pages/Students";
import NotFound from "./components/NotFound";

export default function App() {
  const { userId, userToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { userToken:uToken =null } = localStorage.getItem('ea') ? JSON.parse(localStorage.getItem('ea')) : {};


  //TODO: Needs checking...
 /* useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      console.log("token in localstorage:", uToken);
      console.log("userToken:", userToken);
      console.log("currentUser?.accessToken:", currentUser?.accessToken);
      if(userId === currentUser?.uid && userToken !== currentUser?.accessToken) {
        dispatch(logoutUser());
      }
    })

    return () => unsub()
  }, [])*/



  return (
    <div className="bg-slate-200 h-screen text-black flex">
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
          <Route path="/ingresar" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
    </div>
  )
};