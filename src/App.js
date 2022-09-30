import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";
import { auth } from "./firebase/firebaseConfig";
import { logoutUser } from "./store/user/userSlice";

export default function App() {
  const { userId, userToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if(userId === currentUser?.uid && userToken !== currentUser?.accessToken) {
        dispatch(logoutUser());
      }
    })

    return () => unsub()
  }, [])

  return (
    <div className="bg-slate-300 h-screen text-black flex">
      {/* <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </AuthProvider> */}
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
    </div>
  )
};