import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo, getUserInfo } from '../store/user/userSlice';

const Home = () => {
  const dispatch = useDispatch();

  // if(loading) {
  //   return (
  //     <h1>Loading....</h1>
  //   )
  // }

  useEffect(() => {
    dispatch(getUserInfo());
  }, [])

  return (
    <div className='w-full h-full text-black'>
      <h1>Home</h1>
    </div>
  );
}

export default Home;
