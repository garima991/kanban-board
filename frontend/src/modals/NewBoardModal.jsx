import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {useBoardModal} from "../contexts/BoardModalContext"
import { useDispatch } from "react-redux";
import { createBoard } from "../redux/features/boardSlice";

const NewBoardModal = ({ initialName = "", onSubmit, submitText = "Create Board" }) => {
  const { setBoardFormOpen } = useBoardModal();
  const [name, setName] = useState(initialName);
  const dispatch = useDispatch();

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const validateForm = () => {
    if (name.trim() === "") {
      toast.error("Please fill all the details");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (onSubmit) {
      await onSubmit(name);
    } else {
      dispatch(createBoard({ name }));
    }
    setBoardFormOpen(false);
  };

  return (
    <div
      className="flex flex-col gap-4 p-8 bg-white dark:bg-[#0E1118] dark:text-[#e8e8eb] rounded-lg shadow-lg z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col space-y-1">
        {/* <label className=" text-md text-left text-gray-900">Board Name</label> */}
        <input
          className=" bg-white dark:bg-[#171C22] px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-1  ring-0  "
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
        {submitText}
      </button>
    </div>
  );
};

export default NewBoardModal;
