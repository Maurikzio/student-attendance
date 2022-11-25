import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
// import Register from "./components/Register";
import Students from "./pages/Students";
import NotFound from "./components/NotFound";
import NewRecord from "./pages/NewRecord";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentInfo from "./pages/StudentInfo";
import NewStudent from "./pages/NewStudent";

export default function App() {


  return (
    // <div className="bg-[#f2f2f2] h-screen text-black flex">
    <div className="bg-zinc-700 h-screen text-black flex">
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
          {<Route path="/nuevo-estudiante" element={
            <ProtectedRoute>
              <NewStudent />
            </ProtectedRoute>
          }/>}
          <Route path="/ingresar" element={<Login/>} />
          {/* <Route path="/register" element={<Register/>} /> */}
        </Routes>
        <ToastContainer/>
    </div>
  )
};