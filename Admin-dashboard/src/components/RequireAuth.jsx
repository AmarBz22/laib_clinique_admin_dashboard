import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth";

const RequireAuth = ({ children, allowedRoles }) => {
  const { authState, isUserAuthenticated } = useContext(AuthContext);
  const userRole = authState?.user?.usertype;
  const location = useLocation();

  // Check if authentication state is still being loaded
  if (authState.isLoading) {
    return <div>Loading...</div>; // You might want to replace this with a spinner component
  }

  // If the user is not authenticated, redirect to login
  if (!isUserAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user role is not allowed, redirect to home
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child components
  return children;
};

export default RequireAuth;
