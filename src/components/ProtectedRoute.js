import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { logoutUser } from "../store/user/userSlice";
import Layout from "./Layout";

const ProtectedRoute = ({ children}) => {
  const currUser =  useSelector(state => state.user);
  const dispatch = useDispatch();

  const { userToken:uToken = null, isLoggedIn } = localStorage.getItem('ea') ? JSON.parse(localStorage.getItem('ea')) : {};

  /* To check if the token in local is the same as the one from  onAuthStateChanged */
 useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.accessToken !== uToken && isLoggedIn){ //TODO: test
        dispatch(logoutUser());
      }
    })
    return () => unsub()
  }, [])


  if (!currUser.userId && !currUser.userToken) return <Navigate to="/ingresar" />

  return (
    <>
      <Layout>
        {children}
      </Layout>
    </>
  )

}

export default ProtectedRoute;