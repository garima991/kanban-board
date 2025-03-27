import { AnimatePresence, motion } from "framer-motion";
import { useModal } from "../contexts/TaskModalContext";
import AddTaskForm from "../modals/AddTaskForm";

const AddTaskButton = () => {
  const {setIsOpen} = useModal();
  return (
    <div >
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white font-medium px-4 py-2 rounded hover:opacity-90"
      >
         + New Task
      </button>
      <AddTaskModal />
    </div>
  );
};

const AddTaskModal = () => {
  const { isOpen, setIsOpen } = useModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
         <AddTaskForm />
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default AddTaskButton;