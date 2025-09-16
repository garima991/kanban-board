import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const { user, authChecked } = useSelector((state) => state.auth);

  if (!authChecked) {
    return (
      <div className="h-screen w-full mt-40 flex flex-row justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        <div className="ml-3 text-gray-600 ">Checking authentication...</div>
      </div>
    );
  }

  if (user) {
    const role = user.role === 'admin' ? 'admin' : 'member';
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
