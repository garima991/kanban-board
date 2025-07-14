import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { logoutUser } from "../redux/features/authSlice";

const ProfileSection = ({ open }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    dispatch(logoutUser());
    navigate("/auth");
  };

  return (
    <motion.div className="absolute bottom-14 left-0 right-0 border rounded-md m-1 dark:border-gray-400">
      <div
        onClick={toggleDropdown}
        className="flex justify-center items-center gap-3 p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-[#222830] cursor-pointer m-1"
      >
        <div className="shrink-0">
          <div className="size-8 rounded-full bg-blue-900 dark:bg-[#121212] dark:border dark:border-gray-400 text-white flex items-center justify-center font-semibold uppercase">
            {user?.name[0]}
          </div>
        </div>

        {open && (
          <motion.div
           
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-start dark:text-white"
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
            className="bg-white shadow-lg rounded-md p-2 m-[2px] text-sm border border-slate-200 dark:bg-[#0E1118]"
          >
            <button
              // onClick={() => navigate('/my-profile')}
              className="block w-full text-left px-2 py-1 hover:bg-slate-100 rounded dark:hover:bg-[#222830]"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-2 py-1 hover:bg-slate-100 dark:hover:bg-[#222830] rounded text-red-600"
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
