import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useModal } from "../contexts/TaskModalContext";
import { useSelector, useDispatch } from "react-redux";
import { addTask } from "../redux/features/boardSlice";
import { useState } from "react";

const AddTaskForm = () => {
  const { setIsOpen } = useModal();
  const board = useSelector((state) => state.kanban).find(
    (board) => board.isActive
  );
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("To-Do");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState({ Other: "" }); // custom tags
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [subTasks, setSubTasks] = useState([
    { title: "", isComplete: false, id: uuidv4() },
    { title: "", isComplete: false, id: uuidv4() },
  ]);
  const [comments, setComments] = useState(["", ""]);

  const validStatus = ["To-Do", "In Progress", "Done"];
  const validPriorities = ["Low", "Medium", "High"];

  const onDeleteSubtask = (id) => {
    setSubTasks((prev) => prev.filter((subtask) => subtask.id !== id));
  };

  const onDeleteComment = (index) => {
    setComments((prevComment) => prevComment.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    dispatch(
      addTask({
        title,
        dueDate,
        status,
        tags: { priority, ...tags },
        description,
        attachments,
        subTasks,
        comments,
      })
    );
    setIsOpen(false);
  };

  return (
    <motion.div
      animate={{ scale: 1, rotate: "0deg" }}
      exit={{ scale: 0, rotate: "0deg" }}
      onClick={(e) => e.stopPropagation()}
      className="bg-gradient-to-br from-gray-100 to-gray-300 text-white py-2 rounded-3xl w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col justify-center items-center gap-4">
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

        {/* custom Tags */}
        <input
          type="text"
          placeholder="Other Tags (Project, Type)"
          value={tags.Other}
          onChange={(e) => setTags({ ...tags, Other: e.target.value })}
          className="w-5/6 p-2 border-2 border-gray-400 rounded-lg text-black"
        />

        {/* Description */}
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-5/6 p-2 border-2 border-gray-400 rounded-lg text-black"
        />

        {/* Subtasks */}
        <div className="flex flex-col justify-center items-center gap-1 w-full">
          <div className="flex gap-2">
            <h4 className="text-black font-semibold text-base">
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
        </div>

        {/* comments */}

        <div className="flex flex-col justify-center items-center gap-1 w-full">
          <div className="flex gap-2">
            <h4 className="text-black font-semibold text-base">
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
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-violet-900 text-white font-semibold p-2 rounded-xl hover:scale-105"
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
