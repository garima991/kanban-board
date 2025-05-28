import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useTaskModal } from "../contexts/TaskModalContext";
import { useSelector, useDispatch } from "react-redux";
import { addTask } from "../redux/features/boardSliceOld.js";
import { useState } from "react";
import { tasksApi } from "../apis/axiosInstance.js";
import toast from "react-hot-toast";

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
  // const [subTasks, setSubTasks] = useState([
  //   { title: "", isComplete: false, id: uuidv4() },
  // ]);
  // const [comments, setComments] = useState([""]);
 const validStatus = ["To Do", "On Progress", "In Review", "Completed"];
  const validPriorities = ["Low", "Medium", "High"];
  const validTags = ["Mobile App","Dashboard", "Web App"];


  const validateForm = () => {
    if (title.trim() === "") {
      alert("Task title is required");
      return false;
    }
    if (!dueDate) {
      alert("Due date is required");
      return false;
    }
    if (description.trim() === "") {
      alert("Description is required");
      return false;
    }
    if (title.length > 50) {
      alert("Task title cannot exceed 50 characters");
      return false;
    }
    if (description.length > 200) {
      alert("Description cannot exceed 200 characters");
      return false;
    }
    return true;
  }

  // const onDeleteSubtask = (id) => {
  //   setSubTasks((prev) => prev.filter((subtask) => subtask.id !== id));
  // };

  // const onDeleteComment = (index) => {
  //   setComments((prevComment) => prevComment.filter((_, i) => i !== index));
  // };

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
      // subTasks : subTasks.map(subtask => ({
      //   title : subtask.title,
      //   isComplete : subtask.isComplete,
      // })),
      // comments : comments.map(comment => ({
      //   comment : comment,
      // })),
      })
      toast.success("Task Created Successfully !");
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
      className="bg-white text-white py-2 rounded-xl w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
    >
      <div className="relative z-40 flex flex-col justify-center items-center gap-4">
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

        {/* Subtasks */}
        {/* <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex gap-2">
            <h4 className="text-black font-normal text-base">
              Subtasks
              <button
                className="text-black font-semibold text-xl px-1"
                onClick={() => {
                  setSubTasks((state) => [
                    ...state,
                    { title: "", isCompleted: false, id: uuidv4() },
                  ]);
                }}
              >
                +
              </button>
            </h4>
          </div>
          {subTasks.map((subtask, index) => (
            <div
              key={index}
              className="flex justify-center items-center gap-1 w-5/6"
            >
              <input
                key={subtask.id}
                type="text"
                placeholder={`Subtask ${index + 1}`}
                value={subtask.title}
                onChange={(e) => {
                  const newSubTasks = [...subTasks];
                  newSubTasks[index].title = e.target.value;
                  setSubTasks(newSubTasks);
                }}
                className="w-full p-2 border-2 border-gray-400 rounded-lg text-black"
              />
              <button
                onClick={() => onDeleteSubtask(subtask.id)}
                className="cursor-pointer"
              >
                <svg
                  width="34px"
                  height="34px"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M8.46445 15.5354L15.5355 8.46436"
                      stroke="#000000"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    ></path>{" "}
                    <path
                      d="M8.46446 8.46458L15.5355 15.5356"
                      stroke="#000000"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    ></path>{" "}
                  </g>
                </svg>
              </button>
            </div>
          ))}
        </div> */}

        {/* comments */}
{/* 
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex gap-2">
            <h4 className="text-black font-normal text-base">
              Comments
              <button
                className="text-black font-semibold text-xl px-1"
                onClick={() => {
                  setComments((state) => [...state, ""]);
                }}
              >
                +
              </button>
            </h4>
          </div>
          {comments.map((comment, index) => (
            <div
              key={index}
              className="flex justify-center items-center gap-1 w-5/6"
            >
              <input
                key={index}
                type="text"
                placeholder={`Comment ${index + 1}`}
                value={comment}
                onChange={(e) => {
                  const newCommentArray = [...comments];
                  newCommentArray[index] = e.target.value;
                  setComments(newCommentArray);
                }}
                className="w-full p-2 border-2 border-gray-400 rounded-lg text-black"
              />
              <button
                onClick={() => onDeleteComment(index)}
                className="cursor-pointer"
              >
                <svg
                  width="34px"
                  height="34px"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M8.46445 15.5354L15.5355 8.46436"
                      stroke="#000000"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    ></path>{" "}
                    <path
                      d="M8.46446 8.46458L15.5355 15.5356"
                      stroke="#000000"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    ></path>{" "}
                  </g>
                </svg>
              </button>
            </div>
          ))}
        </div> */}

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
