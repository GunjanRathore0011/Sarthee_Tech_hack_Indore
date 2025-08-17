import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const currentUser=useSelector((state)=>state.user.user);
    // console.log(currentUser.accountType);
  return currentUser ? <Outlet></Outlet> : <Navigate to={"/login"}></Navigate>
}

export default PrivateRoute;