import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  console.log(user);

  // Show loading state while checking authentication
  if (isLoading) {
    return (<div className="mt-40 flex flex-row justify-center items-center w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>)
  }


  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace/>;
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