import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const useIsAuthenticated = () => {
  const { userToken, userId } = useSelector((state) => state.user);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setIsAuthenticated(currentUser?.accessToken === userToken && currentUser?.uid === userId);
    })
    return () => unsub();
  }, []);

  return isAuthenticated;
}

export default useIsAuthenticated;