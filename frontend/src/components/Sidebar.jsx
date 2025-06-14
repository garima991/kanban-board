import { useEffect, useState } from "react";
import { FiChevronsRight, FiHome } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useBoardModal } from "../contexts/BoardModalContext";
import NewBoardModal from "../modals/NewBoardModal";
import { boardsApi } from "../apis/axiosInstance.js";
import { setBoardActive, setBoards } from "../redux/features/boardSlice.js";
import ProfileSection from "./ProfileSection.jsx";
import taskoraIcon from "../assets/taskora-icon.png"

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const {setBoardFormOpen} = useBoardModal();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Fetch boards on mount
  useEffect(() => {
    const fetchBoards = async () => {
      try{
        const response = await boardsApi.getBoards();
        console.log(response);
        dispatch(setBoards(response.data.boards)); 
      }
      catch(error){
        const {response} = error;
        const err = response?.data
        console.log("Error fetching boards", err);
      }
    }

    fetchBoards();
  }, [dispatch, user]);

  const boards = useSelector((state) => state.kanban.value);

  return (
    <motion.nav
      layout
      className="sticky shrink-0 border-r border-slate-300 bg-white p-2 z-20 h-screen"
      style={{
        width: open ? "225px" : "fit-content",
      }}
      // onMouseEnter={() => setOpen(true)} 
      // onMouseLeave={() => setOpen(false)}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        {boards &&
          boards.map((board, index) => (
            // console.log(board.name)
            <Option
              key={index}
              Icon={FiHome}
              title={board.name}
              isActive={board.isActive}
              setIsActive={() => dispatch(setBoardActive(board.name))}
              open={open}
            />
          ))}

         <Option Icon={FaPlus} title="Create Board" open={open}  setBoardForm={() => {setBoardFormOpen(true)}}/>
          <AddBoardModal/>
      </div>

      <div>
          <ProfileSection open={open} />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, isActive, setIsActive , open, setBoardForm}) => {
  // console.log(title, isActive);
  return (
    <motion.button
      layout
      onClick={() => {
        if (setBoardForm) setBoardForm();
        if (setIsActive) setIsActive();
      }}
      
      title
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <motion.div layout className="flex w-10 justify-center text-lg">
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-base font-medium"
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
              <span className="block text-xl font-extrabold">Taskora</span>
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
      className="grid size-10 shrink-0 place-content-center rounded-md bg-blue-900"
    >
      <img src = {taskoraIcon} alt = "logo"/>
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

const AddBoardModal = () => {
  const { isBoardFormOpen, setBoardFormOpen } = useBoardModal();

    const isOnline = useSelector((state) => state.app.isOnline);

  return (
    <AnimatePresence>
      {isBoardFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setBoardFormOpen(false)}
          className="fixed bg-slate-900/30 p-8 inset-0 z-50 grid place-items-center cursor-pointer"
          disable={!isOnline}
        >
         <NewBoardModal />
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default Sidebar;
