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

const TaskDetailView = ({ open, onClose, task, onTaskUpdate }) => {
  const [activeTab, setActiveTab] = useState("subtasks");
  const [boardMembers, setBoardMembers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteDropdown, setInviteDropdown] = useState([]);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const inviteRef = useRef(null);

  // Fetch board members on open
  const fetchBoardMembers = async (boardId) => {
    try {
      const response = await boardsApi.getBoardById(boardId);
      const memberIds = response.data.board.members;
      const memberPromises = memberIds.map((id) =>
        usersApi.getUserById(id.user)
      );
      const memberResponses = await Promise.all(memberPromises);
      const membersDetail = memberResponses.map((res) => res.data);
      setBoardMembers(membersDetail);
    } catch (e) {
      toast.error("Failed to fetch board members");
    }
  };

  useEffect(() => {
    if (open && task?.boardId) {
      fetchBoardMembers(task.boardId);
    } else {
      setBoardMembers([]);
    }
  }, [open, task]);

  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    if (task?.assignedTo && boardMembers.length > 0) {
      // Map user IDs to user objects from boardMembers
      const assignedUsers = task.assignedTo
        .map((userId) => boardMembers.find((user) => user._id === userId))
        .filter(Boolean); // remove undefined if no match

      setAssignees(assignedUsers);
    } else {
      setAssignees([]);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideInvite = (e) => {
      if (inviteRef.current && !inviteRef.current.contains(e.target)) {
        setShowInvite(false);
      }
    };

    if (showInvite) {
      document.addEventListener("mousedown", handleClickOutsideInvite);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideInvite);
    };
  }, [showInvite]);

  // Assign user to a task
  const handleAssign = async (user) => {
    if (!task?.boardId || !task?._id) return;
    setLoadingAssign(true);
    try {
      await tasksApi.assignTask(task.boardId, task._id, user._id);
      toast.success(`Assigned ${user.name}`);
      setShowInvite(false);
      setInviteInput("");
      setInviteDropdown([]);
      if (onTaskUpdate) onTaskUpdate(); // Refresh parent task state if provided
    } catch (e) {
      toast.error("Failed to assign user");
    } finally {
      setLoadingAssign(false);
    }
  };

  if (!open || !task) return null;

  // Progress for subtasks
  const completed = task.subtasks?.filter((s) => s.isCompleted).length || 0;
  const total = task.subtasks?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-0 relative overflow-y-auto max-h-[95vh] border border-gray-100">
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
                  <div
                    ref={inviteRef}
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
              <div className="flex rounded p-2 text-gray-900 text-sm border-2 border-gray-200">
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
        <div className="p-6 pb-16">
          {activeTab === "subtasks" && (
            <>
              <div className="mb-3">
                {completed} / {total} subtasks completed
              </div>
              {task.subtasks?.length > 0 ? (
                task.subtasks.map((subtask, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 items-center text-sm text-gray-900 ${
                      subtask.isCompleted ? "line-through" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      readOnly
                      className="cursor-pointer"
                    />
                    <span>{subtask.title}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">No subtasks added.</div>
              )}
            </>
          )}
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
