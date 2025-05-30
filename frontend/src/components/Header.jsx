import React, { useEffect, useRef, useState } from "react";
import AddTaskButton from "./AddTaskButton";
import { useSelector } from "react-redux";
import { TaskModalProvider } from "../contexts/TaskModalContext";
import { LuLayoutDashboard } from "react-icons/lu";
import { GoListUnordered, GoPerson, GoPersonAdd } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { boardsApi, globalSearchApi, usersApi } from "../apis/axiosInstance";
import toast from "react-hot-toast";

const Header = ({ activeView, setActiveView }) => {
  const boards = useSelector((state) => state.kanban.value);
  const activeBoard = boards?.find((board) => board.isActive);
  const boardName = activeBoard ? activeBoard.name : " ";

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const modalRef = useRef(null);
  const [boardMembers, setBoardMembers] = useState([]);
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

  useEffect(() => {
    fetchAllUsers();
  }, []); // fetch users when component mounts

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
    try {
      await boardsApi.addMember(activeBoard._id, { userId });
      toast.success("User added to the board!");
      setInviteInput("");
      fetchBoardMembers(activeBoard._id); // Refresh the member list
    } catch (err) {
      toast.error("Failed to add user to the board");
      console.error(err);
    }
  };

  
  // fetch all board members
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

  // get the initials of the user
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    if (activeBoard) {
      fetchBoardMembers(activeBoard._id);
    }
  }, [activeBoard]);

  // // Open search modal
  // const handleOpenModal = () => {
  //   setIsSearchModalOpen(true);
  //   setSearchTerm("");
  //   setSearchResults([]);
  // };

  // // Close modal
  // const handleCloseModal = () => {
  //   setIsSearchModalOpen(false);
  //   setSearchTerm("");
  //   setSearchResults([]);
  // };

  
  // Debounced search
  const handleSearch = debounce(async (term) => {
    if (!term.trim()) return;
    try {
      const { data } = await globalSearchApi.globalSearch(term);
      setSearchResults(data?.results || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  }, 500);

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="px-3 py-1 flex flex-col gap-1 bg-white text-black border-b-2 border-gray-300">
      <div className="flex justify-between items-center w-full bg-blue-100 py-3 px-6 mt-2 rounded-md">
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
          <button
            className="flex items-center gap-2 bg-white px-2 py-1 text-black border-2 text-sm rounded-md hover:bg-blue-50 hover:scale-105 transition-all duration-200"
            onClick={() => setShowUsers(!showUsers)}
          >
            <GoPersonAdd /> Invite
          </button>
          {showUsers && (
            <>
              <div onClick={() => {
                setShowUsers(false);
              }} className="fixed inset-0 w-screen h-screen bg-black/10 z-30" />
             
                <div
                  className="absolute right-4 top-14 z-40 bg-white border border-gray-300 rounded-md shadow-md p-3 mt-2 w-64"
                >
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
                          <span className="text-sm text-nowrap">
                            {user.name}
                          </span>{" "}
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
          <div className="flex items-center gap-1">
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
          <div className="flex flex-row justify-between items-center px-2 py-1 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500">
            <input
              type="search"
              className="no-clear outline-none"
              placeholder="Search..."
              onClick={() => setIsSearchModalOpen(true)}
            />
            <FaSearch
              onClick={() => {
                setIsSearchModalOpen(true);
              }}
              className="cursor-pointer text-gray-600 hover:text-black transition"
            />
          </div>
          <TaskModalProvider>
            <AddTaskButton />
          </TaskModalProvider>

          {/* Search Dropdown Modal */}
          {isSearchModalOpen && (
            <>
            <div className="fixed inset-0 bg-slate-500/30 w-full h-full p-20 z-50" onClick={() => setIsSearchModalOpen(false)}/>
              <div
                // ref={modalRef}
                className="absolute right-[40%] z-50 w-72 max-h-80 overflow-y-auto bg-white border border-gray-300 shadow-md rounded-md p-4"
              >
                <input
                  autoFocus
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchResults.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {searchResults.map((result, idx) => (
                      <li
                        key={idx}
                        className="p-2 rounded hover:bg-blue-100 cursor-pointer"
                      >
                        {result.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  searchTerm && (
                    <p className="mt-2 text-sm text-gray-500">
                      No results found.
                    </p>
                  )
                )}
              </div>
            </>
          )}
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
            : "border-transparent hover:border-gray-500"
        } 
        transition-all duration-200`}
    >
      {children}
    </button>
  );
};

export default Header;

const handleGlobalSearch = () => {};

// Custom debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
