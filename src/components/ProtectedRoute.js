import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";

const ProtectedRoute = ({ children}) => {
  const currUser =  useSelector(state => state.user);

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