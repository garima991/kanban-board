import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({allowedRoles}) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/auth"/>;
  }

  return <Outlet />;
}

export default PrivateRoute
