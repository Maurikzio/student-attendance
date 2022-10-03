import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginUser } from "../store/user/userSlice";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "",});
  const currUser =  useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { target: { value, name}} = event;
    setUser({...user, [name]: value});
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(loginUser(user))
  }

  useEffect(() => {
    if(currUser.userId && currUser.userToken) {
      navigate('/');
    }
  }, [currUser.userId, currUser.userToken, navigate])

  return (
    <div className='w-full max-w-xs m-auto'>
      {/* {error && <Alert message={error}/>} */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className='mb-4'>
          <label htmlFor="email" className='block text-gray-700 text-sm font-medium mb-2'>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            onChange={handleChange}
            value={user.email}
            autoComplete="off"
            // className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
        </div>
        <div className='mb-4'>
          <label
            htmlFor="password"
            className='block text-gray-700 text-sm font-medium mb-2'
          >Password</label>
          <input
            type="password"
            name="password"
            placeholder="Your password"
            onChange={handleChange}
            value={user.password}
            autoComplete="off"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            // className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >Login</button>

          {/* <a
            href="#!"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            onClick={handleResetPassword}
          >Forgot password?</a> */}
        </div>
      </form>
    </div>
  );

}

export default Login;
