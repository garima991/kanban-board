import React, { useState, useEffect, useRef } from "react";
import { boardsApi, tasksApi, usersApi } from "../apis/axiosInstance";
import toast from "react-hot-toast";
import {
  FaCalendar,
  FaCircleNotch,
  FaRegFileAlt,
  FaTags,
} from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import SubtasksSection from "./SubtasksSection";
import { assignTask, fetchTasks } from "../redux/features/taskSlice";
import { useDispatch, useSelector } from "react-redux";

const TaskDetailView = ({ open, onClose, task }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("subtasks");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteDropdown, setInviteDropdown] = useState([]);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [assignees, setAssignees] = useState([]);

  const boardMembers = useSelector((state) => state.kanban.activeBoardMembers);

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    if (task?.assignedTo && boardMembers.length > 0) {
      const assignedUsers = task.assignedTo
        .map((userId) => boardMembers.find((user) => user._id === userId))
        .filter(Boolean);
      setAssignees(assignedUsers);
    }
  }, [task, boardMembers]);

  useEffect(() => {
    if (inviteInput.trim() !== "") {
      const filtered = boardMembers.filter((user) =>
        user.name.toLowerCase().includes(inviteInput.toLowerCase())
      );
      setInviteDropdown(filtered);
    } else {
      setInviteDropdown(boardMembers);
    }
  }, [inviteInput, boardMembers]);

  // Assign user to a task
  const handleAssign = async (user) => {
    if (!task?.boardId || !task?._id) return;
    dispatch(
      assignTask({
        boardId: task.boardId,
        taskId: task._id,
        userId: user._id,
      })
    );
    setShowInvite(false);
  };

  if (!open || !task) return null;

  return (
    <div
      className="fixed bg-slate-900/30 inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-0 relative overflow-y-auto max-h-[95vh] border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-6 text-gray-400 hover:text-black text-3xl font-bold z-10"
          onClick={onClose}
        >
          &times;
        </button>
        {/* Header Section */}
        <div className="px-8 py-4 border-b border-gray-100">
          <h2 className="text-2xl font-semibold p-3 my-4">{task.title}</h2>
          <div className="flex flex-col gap-3">
            {/* Status */}
            <div className="flex items-center gap-6">
              <h3 className="flex text-sm text-gray-500 gap-2 items-center mr-8">
                {" "}
                <FaCircleNotch className="text-gray-500" />
                Status{" "}
              </h3>
              <span className="flex items-center text-sm font-medium gap-2 text-blue-800">
                {task.status}
              </span>
            </div>
            {/* Due date */}
            <div className="flex items-center text-sm text-gray-500 gap-2">
              <FaCalendar className="text-gray-500" />
              Due date{" "}
              <span className="font-medium text-black ml-8">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            {/* Assignees */}
            <div className="flex items-center gap-2">
              <h3 className="flex text-sm text-gray-500 gap-2 items-center mr-6">
                {" "}
                <GoPeople className="text-gray-500" />
                Assignees{" "}
              </h3>
              <div className="flex -space-x-2">
                {assignees?.map((user) => (
                  <span
                    key={user._id}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white bg-blue-100 text-blue-800"
                    title={user.name}
                  >
                    {getInitials(user.name)}
                  </span>
                ))}
              </div>
              <div className="relative">
                <button
                  className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded text-gray-600 border border-gray-200 hover:bg-gray-200"
                  onClick={() => setShowInvite((v) => !v)}
                >
                  Invite
                </button>
                {showInvite && (
                  <>
                    <div
                      className="fixed inset-0 w-screen h-screen bg-transparent"
                      onClick={() => setShowInvite(false)}
                    />
                    <div
                      // ref={inviteRef}
                      className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-20 w-48 p-2"
                    >
                      <input
                        className="w-full p-1 border rounded mb-2 text-xs"
                        placeholder="Type name..."
                        value={inviteInput}
                        onChange={(e) => setInviteInput(e.target.value)}
                      />
                      <div className="max-h-32 overflow-y-auto">
                        {inviteDropdown.length > 0 ? (
                          inviteDropdown.map((user) => (
                            <div
                              key={user._id}
                              className="flex justify-start p-1 hover:bg-blue-100 rounded cursor-pointer text-sm"
                              onClick={() => handleAssign(user)}
                            >
                              {user.name}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-400">
                            No users found
                          </div>
                        )}
                      </div>
                      {loadingAssign && (
                        <div className="text-xs text-blue-500 mt-1">
                          Assigning...
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Tags */}
            <div className="flex gap-2">
              <h3 className="flex text-sm text-gray-500 gap-2 items-center mr-16">
                {" "}
                <FaTags className="text-gray-500" />
                Tags{" "}
              </h3>
              <div className="flex gap-1 flex-wrap">
                {(Array.isArray(task.tags) ? task.tags : []).map((tag, idx) => (
                  <div
                    key={idx}
                    className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded flex items-center"
                  >
                    {tag}
                  </div>
                ))}
              </div>
              <span
                className={`px-2 py-1 text-xs ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "Medium"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                } rounded flex items-center gap-1`}
              >
                {task.priority}
              </span>
            </div>
            {/* Description */}
            <div className="flex flex-col gap-2">
              <h3 className="flex text-sm text-gray-500 gap-2 items-center">
                {" "}
                <FaRegFileAlt className="text-gray-500" />
                Description{" "}
              </h3>
              <div className="flex rounded p-3 text-gray-900 text-sm border-2 border-gray-200">
                {task.description || "No description provided."}
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="px-8 pt-4 pb-0 flex gap-8 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button
            className={`pb-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "subtasks"
                ? "border-blue-700 text-blue-800"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("subtasks")}
          >
            Subtasks
          </button>
          <button
            className={`pb-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "comments"
                ? "border-blue-700 text-blue-800"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
        </div>
        {/* Tab content */}
        <div className="p-6 pb-16 max-h-[60vh] overflow-y-auto">
          {activeTab === "subtasks" && <SubtasksSection task={task} />}
          {activeTab === "comments" && (
            <div className="text-sm text-gray-500">
              Comments section coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;
