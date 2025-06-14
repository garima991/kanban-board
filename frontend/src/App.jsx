import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthForm from "./pages/AuthForm";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMe, refreshUser } from "./redux/features/authSlice";
import NetworkListener from "./components/NetworkListener";

function App() {
   const dispatch = useDispatch();
  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(getMe()); // try to get user with accessToken

      } catch (err) {
        try {
          await dispatch(refreshUser()); // If failed, try refreshing token
        } catch (refreshErr) {
          console.log("User not logged in");
        }
      }
    };

    initAuth();
  }, [dispatch]);

  return (
    <BrowserRouter>
    <NetworkListener />
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/unauthorised" />

        {/* Admin Routes*/}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<DashboardLayout />} />
          {/* <Route path ="/admin/tasks" element={<ManageTasks />}/> */}
        </Route>

        <Route element={<PrivateRoute allowedRoles={["member"]} />}>
          <Route path="/member/dashboard" element={<DashboardLayout />} />
          {/* <Route path ="/user/task-detail/:taskId" element={<TaskDetailView/>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
