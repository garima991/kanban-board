import { AnimatePresence, motion } from "framer-motion";
import { useTaskModal } from "../contexts/TaskModalContext";
import AddTaskForm from "../modals/AddTaskForm";

const AddTaskButton = () => {
  const {setTaskFormOpen} = useTaskModal();
  return (
    <div >
      <button
        onClick={() => setTaskFormOpen(true)}
        className="bg-black text-white font-medium px-4 py-1 rounded-lg hover:opacity-90"
      >
         + New Task
      </button>
      <AddTaskModal />
    </div>
  );
};

export const AddTaskModal = () => {
  const { isTaskFormOpen, setTaskFormOpen } = useTaskModal();

  return (
    <AnimatePresence>
      {isTaskFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setTaskFormOpen(false)}
          className="bg-slate-500/20 backdrop-blur-sm p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
         <AddTaskForm />
        </motion.div>
      )}
    </AnimatePresence>
  );
};



export default AddTaskButton;