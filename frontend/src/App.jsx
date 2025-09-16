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
import PublicRoute from "./components/PublicRoute";

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(getMe());
        console.log("User is logged in");
      } catch (err) {
        try {
          await dispatch(refreshUser());
        } catch (refreshErr) {
          console.log("User not logged in");
        }
      }
    };
    initAuth();
  }, [dispatch]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="dark:bg-[#0E1118]">
      <BrowserRouter>
        <NetworkListener />
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthForm />} />
          </Route>

          <Route
            path="/unauthorized"
            element={
              <div className="text-center mt-60 text-gray-600 font-bold text-2xl">
                You are not authorized to view this page.
              </div>
            }
          />

          {/* Admin */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<DashboardLayout />} />
          </Route>

          {/* Member */}
          <Route element={<PrivateRoute allowedRoles={["member"]} />}>
            <Route path="/member/dashboard" element={<DashboardLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;