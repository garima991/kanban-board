import React, { useState } from "react";
import {
  FiChevronsRight,
  FiHome,
} from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setBoardActive } from "../redux/features/boardSlice";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const boards = useSelector((state) => state.kanban);
  // console.log(boards);
  // boards.map((board, index) => {
  //   console.log(board.name);
  // })
  const activeBoard = boards?.find((board) => board.isActive);
  const dispatch = useDispatch();
  
  return (
    <motion.nav
      layout
      className="sticky shrink-0 border-r border-slate-300 bg-white p-2 z-20"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />
        
        <div className="space-y-1">
        {boards && boards.map((board, index) => (
          // console.log(board.name)
          <Option
            key={index}
            Icon={FiHome} 
            title={board.name}
            isActive={board.isActive}
            setIsActive={() => dispatch(setBoardActive(board.name))}
            open = {open}
          />
        ))}

        <Option Icon = {FaPlus} title = "Create Board" open={open} />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, isActive = false, setIsActive = "", open}) => {
  // console.log(title, isActive);
  return (
    <motion.button
      layout
      onClick={() => setIsActive()}
      title
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${isActive ? "bg-purple-100 text-purple-700" : "text-slate-500 hover:bg-slate-100"}`}
    >
      <motion.div
        layout
        className="flex w-10 justify-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-base font-medium"
          // title
        >
          {title}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
      <div className="flex items-center gap-2">
      <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xl font-extrabold">KanBan Board</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-purple-900"
    >
      <svg
        width="24"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-slate-50"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          stopColor="#000000"
        ></path>
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        ></path>
      </svg>
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

export default Sidebar;