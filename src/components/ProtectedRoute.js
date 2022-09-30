// import { useAuth } from "../context/auth.context";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useIsAuthenticated from "../hooks/useIsAuthenticated";
import Layout from "./Layout";
// import { useAuth } from "../context/auth.context";

const ProtectedRoute = ({ children}) => {
    // const isAuthenticated = useIsAuthenticated();
  const currUser =  useSelector(state => state.user);

  // const { user, loading } = useAuth();

  // if(loading) return <h1>Loading...</h1>

  if (!currUser.userId && !currUser.userToken) return <Navigate to="/login" />

  return (
    <>
      <Layout>
        {children}
      </Layout>
    </>
  )

}

export default ProtectedRoute;