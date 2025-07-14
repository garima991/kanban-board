import { motion } from "framer-motion";
import { useTaskModal } from "../contexts/TaskModalContext";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { tasksApi } from "../apis/axiosInstance.js";
import toast from "react-hot-toast";
import { createTask } from "../redux/features/taskSlice.js";

const AddTaskForm = ({ initialTask = null, onSubmit, onClose }) => {
  const { setTaskFormOpen } = useTaskModal();
  const board = useSelector((state) => state.kanban.value).find(
    (board) => board.isActive
  );
  const boardId = board?._id;
  const dispatch = useDispatch();

  // If editing, prefill with initialTask, else defaults
  const [title, setTitle] = useState(initialTask?.title || "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ? initialTask.dueDate.slice(0,10) : "");
  const [status, setStatus] = useState(initialTask?.status || "To Do");
  const [priority, setPriority] = useState(initialTask?.priority || "Medium");
  const [tags, setTags] = useState(initialTask?.tags || "Web App");
  const [description, setDescription] = useState(initialTask?.description || "");
  const validStatus = ["To Do", "On Progress", "In Review", "Completed"];
  const validPriorities = ["Low", "Medium", "High"];
  const validTags = ["Mobile App","Dashboard", "Web App"];

  // Update state if initialTask changes (for edit mode)
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || "");
      setDueDate(initialTask.dueDate ? initialTask.dueDate.slice(0,10) : "");
      setStatus(initialTask.status || "To Do");
      setPriority(initialTask.priority || "Medium");
      setTags(initialTask.tags || "Web App");
      setDescription(initialTask.description || "");
    }
  }, [initialTask]);

  const validateForm = () => {
    if (title.trim() === "") {
      toast.error("Task title is required");
      return false;
    }
    if (!dueDate) {
      toast.error("Due date is required");
      return false;
    }
    if (description.trim() === "") {
      toast.error("Description is required");
      return false;
    }
    if (title.length > 50) {
      toast.error("Task title cannot exceed 50 characters");
      return false;
    }
    if (description.length > 200) {
      toast.error("Description cannot exceed 200 characters");
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    const taskData = {
      title,
      description,
      dueDate,
      priority,
      status,
      tags,
      color: initialTask?.color || 'blue-50',
    };
    try {
      if (initialTask && onSubmit) {
        // Edit mode: call onSubmit with updated data
        await onSubmit(taskData);
        // dispatch(fetchTasks(boardId));
      } else {
        // Add mode: create new task
        await dispatch(createTask({boardId, taskData}));
        setTaskFormOpen(false)
        // dispatch(fetchTasks(boardId));
      }
    } catch (error) {
      console.log("Error while saving task!", error);
    }
    if (onClose) onClose();
    else setTaskFormOpen(false);
  };

  return (
    <motion.div
      animate={{ scale: 1}}
      exit={{ scale: 0}}
      onClick={(e) => e.stopPropagation()}
      className="fixed text-white rounded-xl w-full max-w-lg shadow-xl cursor-default overflow-hidden"
    >
      <div className="relative z-40 flex flex-col justify-center items-center gap-4 bg-[#FFFFFF] dark:bg-[#0E1118] dark:text-[#e8e8eb]">
        <h3 className="font-bold text-black dark:text-[#DADADB] text-2xl p-3">
          {initialTask ? "Edit Task" : "Add New Task"}
        </h3>
        {/* title */}
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 dark:bg-[#171C22] rounded-lg text-black"
        />
        {/* due date */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 dark:bg-[#171C22] rounded-lg text-black dark:text-[#e8e8eb]"
        />
        <div className="flex justify-between items-center w-5/6 gap-2">
        {/* status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 dark:bg-[#171C22] rounded-lg text-black dark:text-[#e8e8eb]"
        >
          {validStatus.map((status, idx) => (
            <option key={idx} value={status} className="dark:bg-[#171C22] dark:text-[#e8e8eb]">
              {status}
            </option>
          ))}
        </select>
        {/* priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 dark:bg-[#171C22] rounded-lg text-black dark:text-[#e8e8eb]"
        >
          {validPriorities.map((priority, idx) => (
            <option key={idx} value={priority} className="dark:bg-[#171C22] dark:text-[#e8e8eb]">
              {priority}
            </option>
          ))}
        </select>
        {/* tags */}
        <select
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 dark:bg-[#171C22] rounded-lg text-black dark:text-[#e8e8eb]"
        >
          {validTags.map((tags, idx) => (
            <option key={idx} value={tags}>
              {tags}
            </option>
          ))}
        </select>
        </div>
        {/* Description */}
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 dark:bg-[#171C22] rounded-lg text-black"
        />
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-2 mb-2 bg-blue-900 text-white font-normal p-2 rounded-md hover:scale-105"
        >
          {initialTask ? "Update Task" : "Add Task"}
        </button>
      </div>
    </motion.div>
  );
};

export default AddTaskForm;

// title
// dueDate
// status
// tags -> priority , other(projects , type)
// description
// attachments
// subtasks -> title , isComplete
// comments
