import './App.css';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import AuthForm from './pages/AuthForm';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path = "/unauthorised" />

        {/* Admin Routes*/}
        <Route element = {<PrivateRoute allowedRoles = {['admin']}/>}>
          <Route path="/admin/dashboard" element={<DashboardLayout />}/>
          {/* <Route path ="/admin/tasks" element={<ManageTasks />}/> */}
        </Route>

        <Route element = {<PrivateRoute allowedRoles = {['member']}/>}>
          <Route path="/user/dashboard" element={<DashboardLayout />}/>
          {/* <Route path ="/user/task-detail/:taskId" element={<ViewTaskDetail/>} /> */}
        </Route>

         </Routes>
    </BrowserRouter>
  );
}

export default App;
