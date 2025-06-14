import React, { useEffect, useRef, useState } from "react";
import AddTaskButton from "./AddTaskButton";
import { useDispatch, useSelector } from "react-redux";
import { TaskModalProvider } from "../contexts/TaskModalContext";
import { LuLayoutDashboard } from "react-icons/lu";
import { boardsApi, globalSearchApi, usersApi } from "../apis/axiosInstance";
import toast from "react-hot-toast";
import {
  addBoardMember,
  getActiveBoardMembers,
} from "../redux/features/boardSlice";
import { GoListUnordered, GoPersonAdd } from "react-icons/go";

const Header = ({ activeView, setActiveView }) => {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.kanban.value);
  const activeBoard = boards?.find((board) => board.isActive);
  const boardMembers = useSelector((state) => state.kanban.activeBoardMembers);
  const user = useSelector((state) => state.auth.user);
  const isOnline = useSelector((state) => state.app.isOnline);

  const boardName = activeBoard ? activeBoard.name : " ";
  const [allUsers, setAllUsers] = useState([]); // Store all users initially
  const [userDropdown, setUserDropdown] = useState([]);
  const [inviteInput, setInviteInput] = useState("");
  const [showUsers, setShowUsers] = useState(false);

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await usersApi.getAllUsers();
      setAllUsers(response.data); // Keep all users here
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  // fetch users when component mounts
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // fetch board members
  useEffect(() => {
    if (activeBoard?._id) {
      dispatch(getActiveBoardMembers(activeBoard._id));
    }
  }, [activeBoard, dispatch]);

  // Filter users based on inviteInput
  useEffect(() => {
    if (inviteInput.trim() !== "") {
      const filtered = allUsers.filter(
        (user) =>
          (user.name.toLowerCase().includes(inviteInput.toLowerCase()) ||
            user.email.toLowerCase().includes(inviteInput.toLowerCase())) &&
          !boardMembers.some((member) => member._id === user._id) // Exclude existing members
      );
      setUserDropdown(filtered);
    } else {
      const nonMembers = allUsers.filter(
        (user) => !boardMembers.some((member) => member._id === user._id)
      );
      setUserDropdown(nonMembers);
    }
  }, [inviteInput, allUsers, boardMembers]);

  const handleAddBoardMember = async (userId) => {
    if (!activeBoard) return;
    dispatch(
      addBoardMember({
        boardId: activeBoard._id,
        memberData: { userId },
      })
    );
    setInviteInput("");
    setShowUsers(false);
  };

  // get the initials of the user
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  
  return (
    <div className="px flex flex-col gap-1 bg-white text-black border-b-2 border-gray-300">
      <div className="flex justify-between items-center w-full bg-blue-100 py-3 px-4 rounded-md">
        <h1 className="text-4xl font-bold rounded-xl">{boardName}</h1>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {boardMembers?.map((user) => (
              <span
                key={user._id}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white bg-blue-100 text-blue-800"
                title={user.name}
              >
                {getInitials(user.name)}
              </span>
            ))}
          </div>
          
          {activeBoard?.admin === user._id && (
            <button
              className="flex items-center gap-2 bg-white px-2 py-1 text-black border-2 text-sm rounded-md hover:bg-blue-50 hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed"
              onClick={() => setShowUsers(!showUsers)}
              disabled={!isOnline}
            >
              <GoPersonAdd /> Invite
            </button>
          )}
          {showUsers && (
            <>
              <div
                onClick={() => {
                  setShowUsers(false);
                }}
                className="fixed inset-0 w-screen h-screen bg-black/10 z-30"
              />

              <div className="absolute right-4 top-14 z-40 bg-white border border-gray-300 rounded-md shadow-md p-3 mt-2 w-64">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  className="w-full px-2 py-1 border rounded-md mb-2 outline-none "
                />
                {userDropdown.length > 0 ? (
                  <ul className="max-h-40 overflow-y-auto space-y-1">
                    {userDropdown.map((user) => (
                      <li
                        key={user._id}
                        onClick={() => handleAddBoardMember(user._id)}
                        className="flex justify-start items-center gap-1 cursor-pointer hover:bg-blue-100 px-2 py-1 rounded"
                      >
                        <span className="text-sm text-nowrap">{user.name}</span>{" "}
                        -{" "}
                        <span className="text-gray-500 text-sm truncate">
                          {user.email}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No users found.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <hr />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 px-3">
          <div className="flex items-center gap-1 ">
            <LuLayoutDashboard />
            <Button
              isActive={activeView === "kanban"}
              onClick={() => setActiveView("kanban")}
            >
              Kanban
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <GoListUnordered />
            <Button
              isActive={activeView === "list"}
              onClick={() => setActiveView("list")}
            >
              Table
            </Button>
          </div>
        </div>

        {/* Search & Add Task */}
        <div className="flex items-center gap-1 p-2">
          {/* <TaskModalProvider> */}
            <AddTaskButton />
          {/* </TaskModalProvider> */}
        </div>
      </div>
    </div>
  );
};

const Button = ({ children, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-row justify-center items-center gap-2 font-medium text-md
        ${
          isActive
            ? "border-black border-b-2"
            : "border-transparent hover:border-b-2 hover:border-gray-200"
        } 
        transition-all duration-200`}
    >
      {children}
    </button>
  );
};

export default Header;

