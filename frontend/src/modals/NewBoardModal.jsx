import React, { useState } from "react";
import toast from "react-hot-toast";
import { useBoardModal } from "../contexts/BoardModalContext";
import { useDispatch } from "react-redux";
import { createBoard } from "../redux/features/boardSlice";

const NewBoardModal = () => {
  const { setBoardFormOpen } = useBoardModal();
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const validateForm = () => {
    if (name.trim() === "") {
      toast.error("Please fill all the details")
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(createBoard(
      {name}
    ));
    setBoardFormOpen(false);
  };

  return (
    <div
      className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col space-y-1">
        {/* <label className=" text-md text-left text-gray-900">Board Name</label> */}
        <input
          className=" bg-white px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
          placeholder="Board Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="board-name-input"
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
