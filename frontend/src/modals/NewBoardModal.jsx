import React, { useState } from "react";
import toast from "react-hot-toast";
import { useBoardModal } from "../contexts/BoardModalContext";
import { useDispatch } from "react-redux";
import { boardsApi } from "../apis/axiosInstance";
import { setBoards } from "../redux/features/boardSlice";

const NewBoardModal = () => {
  const { setBoardFormOpen } = useBoardModal();
  const [name, setName] = useState("");
  const [admin, setAdmin] = useState("");
  const [columns, setColumns] = useState([
    { name: "Todo", tasks: [] },
    { name: "On Progress", tasks: [] },
    { name: "In Review", tasks: [] },
    { name: "Done", tasks: [] },
  ]);
  const dispatch = useDispatch();

  const validateForm = () => {
    if (name.trim() === "") {
      alert("Board name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Step 1: Create the new board via API
      const res = await boardsApi.createBoard({
        name,
        admin,
        columns,
      });

      // Step 2: Fetch the updated list of boards
      const response = await boardsApi.getBoards();
      console.log(response);
      console.log(response.data.boards);
      const updatedBoardsRes = await response.data.boards;
      console.log(updatedBoardsRes);

      // Step 3: Add the newly created board to the list and update the Redux state
      // const updatedBoards = [...updatedBoardsRes.data, res.data];

      // Step 4: Dispatch the updated boards list to Redux
      dispatch(setBoards(updatedBoardsRes));

      setBoardFormOpen(false);
    }
     catch (error) {
      console.error("Failed to create board:", error);
      toast.error("Something went wrong while creating the board.");
      setBoardFormOpen(false);
    }

    
  };

  return (
    <div
      className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col space-y-1">
        <label className=" text-md text-left text-gray-900">Board Name</label>
        <input
          className=" bg-white px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
          placeholder="Enter Board Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="board-name-input"
        />
      </div>

       <div className="flex flex-col space-y-1">
        <label className="text-md text-left text-gray-900">Admin</label>
        <input
          className="bg-white px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1"
          placeholder="Enter Admin Username"
          value={admin}
          onChange={(e) => setAdmin(e.target.value)}
          id="board-admin-input"
        />
      </div> 
      <button
        className="p-1 bg-blue-900 rounded-lg text-white"
        onClick={handleSubmit}
      >
        Create Board
      </button>
    </div>
  );
};

export default NewBoardModal;
