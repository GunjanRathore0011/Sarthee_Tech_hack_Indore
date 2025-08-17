import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RoleBasedRoute = ({ allowedRoles }) => {
  // user ko sahi tarike se Redux se lao
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/login" />; // agar login nahi hai
  }

  // case-insensitive match safe side ke liye
  const role = user.accountType?.toLowerCase();
  const allowed = allowedRoles.map(r => r.toLowerCase());

  return allowed.includes(role) ? <Outlet /> : <Navigate to="/" />;
};

export default RoleBasedRoute;
