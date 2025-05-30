// import { useSelector } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';

// const PrivateRoute = () => {
//   const user = useSelector((state) => state.auth.user);

//   if (!user) {
//     return <Navigate to="/auth"/>;
//   }

//   return <Outlet />;
// }

// export default PrivateRoute

import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  console.log(user);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has required role (if roles are specified)
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.map((role) => 
      user.role === role
    );
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;