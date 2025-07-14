import { use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles = [] }) => {

  const { user, authChecked } = useSelector((state) => state.auth);
  const isOnline = useSelector((state) => state.app.isOnline);


  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="w-screen h-screen mt-40 flex flex-row justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        <div className="ml-3 text-gray-600 ">Checking authentication...</div>
      </div>
    );
  }


  // Redirect to auth if not logged in
  if (!user) {
    // console.log(user);
   return <Navigate to="/auth" replace/>;
  }

  // Check if user has required role (if roles are specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
  return <Navigate to="/unauthorized" replace />;
}

  if (!isOnline) {
   return <div className="text-center mt-60 text-gray-600 font-bold text-2xl">You're offline. Connect to the internet to continue.</div>;
  }


  return <Outlet />;
};

export default PrivateRoute;