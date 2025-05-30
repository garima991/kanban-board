import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { authApi } from "../apis/axiosInstance";
import { logout } from "../redux/features/authSlice"; 
import { useNavigate } from "react-router-dom"; 

const ProfileSection = ({ open }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logout()); 
      navigate("/auth"); 
    } catch (error) {
      console.error("Logout failed:", error?.response?.data || error.message);
    }
  };

  return (
    <motion.div className="absolute bottom-14 left-0 right-0 px-2 border-2 rounded-md m-1">
      <div
        onClick={toggleDropdown}
        className="flex justify-center items-center gap-3 p-2 rounded-md transition-colors hover:bg-slate-100 cursor-pointer"
      >
        <div className="shrink-0">
          <div className="size-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-semibold uppercase">
            {user?.name[0]}
          </div>
        </div>

        {open && (
          <motion.div
           
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-start"
          >
            <span className="text-sm font-semibold">
              {user?.name }
            </span>
            <span className="text-xs text-slate-500 truncate max-w-[130px]">
              {user?.email}
            </span>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {dropdownOpen && open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white shadow-lg rounded-md p-2 my-2 text-sm border border-slate-200"
          >
            <button
              // onClick={() => navigate('/my-profile')}
              className="block w-full text-left px-2 py-1 hover:bg-slate-100 rounded"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-2 py-1 hover:bg-slate-100 rounded text-red-600"
            >
              Logout
            </button>
          </motion.div>
        )}
       </AnimatePresence>
    </motion.div>
  );
};

export default ProfileSection;
