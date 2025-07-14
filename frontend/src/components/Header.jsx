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
  updateBoard,
  removeBoardMember,
} from "../redux/features/boardSlice";
import { GoListUnordered, GoPersonAdd } from "react-icons/go";
import NewBoardModal from "../modals/NewBoardModal";
import { FiEdit2, FiSun, FiMoon } from "react-icons/fi";
import { setTheme } from "../redux/features/appSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);

  return (
    <button
      onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
      className="ml-2 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
      title="Toggle theme"
    >
      {theme === "dark" ? <FiSun className="w-5 h-5 " /> : <FiMoon className="w-5 h-5 text-black" />}
    </button>
  );
};

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
  const [showEditBoard, setShowEditBoard] = useState(false);

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

  // Handler for updating board
  const handleUpdateBoard = async (newName) => {
    if (!activeBoard?._id) return;
    dispatch(updateBoard({ boardId: activeBoard._id, name: newName }));
    setShowEditBoard(false);
  };

  return (
    <div className="top-0 px-2 flex flex-col gap-1 bg-white dark:bg-[#0E1118] text-black dark:text-white border-b-2 border-gray-300 z-6">
      <div className="flex flex-col md:flex-row justify-between items-center w-full bg-blue-100 dark:bg-[#0E1118] py-3 px-4 rounded-md xs:gap-2 md:gap-4">
        <h1 className="xs:text-3xl sm:text-4xl font-bold rounded-xl flex items-start xs:py-4 sm:py-1 truncate">
          {boardName}
          {activeBoard?.admin === user._id && (
            <button
              className="p-2 text-gray-500 hover:text-black dark:hover:text-gray-200 rounded"
              onClick={() => setShowEditBoard(true)}
            >
              <FiEdit2 className="size-4" />
            </button>
          )}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {boardMembers?.map((member) => (
              <span
                key={member._id}
                className="size-8 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-white dark:ring-gray-300 bg-blue-50 dark:bg-gray-900 text-blue-900 dark:text-gray-300 relative group"
                title={member.name}
              >
                {getInitials(member.name)}
                {activeBoard?.admin === user._id && member._id !== user._id && (
                  <button
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    title="Remove from board"
                    onClick={() => dispatch(removeBoardMember({ boardId: activeBoard._id, memberId: member._id }))}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {activeBoard?.admin === user._id && (
            <button
              className="flex items-center gap-2 bg-white px-2 py-1 text-black border-2 text-sm rounded-md hover:bg-blue-50 hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed"
              onClick={() => setShowUsers(!showUsers)}
              disabled={!isOnline}
            >
              <GoPersonAdd /> <span className="hidden xs:inline">Invite</span>
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
          <ThemeToggle />
        </div>
      </div>
      <hr />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 px-3 py-2">
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
        <div className="sm:flex items-center gap-1 p-2 hidden ">
          {/* <TaskModalProvider> */}
          <AddTaskButton />
          {/* </TaskModalProvider> */}
        </div>
      </div>

      {showEditBoard && (
        <div
          className="fixed bg-slate-900/30 p-8 inset-0 z-50 grid place-items-center cursor-pointer"
          onClick={() => setShowEditBoard(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <NewBoardModal
              initialName={activeBoard?.name || ""}
              submitText="Update Board"
              onSubmit={handleUpdateBoard}
            />
          </div>
        </div>
      )}
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
            ? "border-black border-b-2 dark:border-gray-400 "
            : "border-transparent hover:border-b-2 hover:border-gray-200"
        } 
        transition-all duration-200`}
    >
      {children}
    </button>
  );
};

export default Header;
