import React from 'react';
import { auth } from "../firebase/firebaseConfig";
// import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/user/userSlice';
// import { useAuth } from '../context/auth.context';

const Home = () => {
  // const { user, logout, loading } = useAuth();
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logoutUser());
  }

  // if(loading) {
  //   return (
  //     <h1>Loading....</h1>
  //   )
  // }

  return (
    <div className='w-full max-w-xs m-auto text-black'>
      {/* Home, {user.email} */}
      <br/>
      <button onClick={handleLogOut}>LogOut</button>
    </div>
  );
}

export default Home;
