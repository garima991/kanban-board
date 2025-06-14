import { motion } from "framer-motion";
import { useTaskModal } from "../contexts/TaskModalContext";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { tasksApi } from "../apis/axiosInstance.js";
import toast from "react-hot-toast";
import { fetchTasks } from "../redux/features/taskSlice.js";

const AddTaskForm = () => {
  const { setTaskFormOpen } = useTaskModal();
  const board = useSelector((state) => state.kanban.value).find(
    (board) => board.isActive
  );
  const boardId = board._id;
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState("Web App"); // custom tags
  const [description, setDescription] = useState("");
  const validStatus = ["To Do", "On Progress", "In Review", "Completed"];
  const validPriorities = ["Low", "Medium", "High"];
  const validTags = ["Mobile App","Dashboard", "Web App"];


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

  const newTask = {
    title,
    description,
    dueDate,
    priority,
    status,
    tags,
    color :  'blue-50',
  }

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    try{
      await tasksApi.createTask(boardId, {
      title,
      description,
      dueDate,
      priority,
      status,
      tags,
      color :  'blue-50',

      })
      toast.success("Task Created Successfully !");
      dispatch(fetchTasks(boardId))
    }
    catch(error){
      console.log("Error while creating task !", error);
      toast.error("Error while creating task !");
    }
   
    setTaskFormOpen(false);
  };

  return (
    <motion.div
      animate={{ scale: 1}}
      exit={{ scale: 0}}
      // transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
      className="fixed text-white rounded-xl w-full max-w-lg shadow-xl cursor-default overflow-hidden"
    >
      <div className="relative z-40 flex flex-col justify-center items-center gap-4 bg-[#FFFFFF]">
        <h3 className="font-bold text-black text-2xl p-3">Add New Task</h3>

        {/* title */}
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 rounded-lg text-black"
        />

        {/* due date */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 rounded-lg text-black"
        />
        

        <div className="flex justify-between items-center w-5/6 gap-2">
        {/* status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 rounded-lg text-black"
        >
          {validStatus.map((status, idx) => (
            <option key={idx} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 rounded-lg text-black"
        >
          {validPriorities.map((priority, idx) => (
            <option key={idx} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        {/* tags */}
        <select
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 rounded-lg text-black"
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
          className="w-5/6 p-2 border-2 border-gray-400 rounded-lg text-black"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-2 mb-2 bg-blue-900 text-white font-normal p-2 rounded-md hover:scale-105"
        >
          Add Task
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
