import React from "react";
import AddTaskButton from "./AddTaskButton";
import { useSelector } from "react-redux";
import { TaskModalProvider } from "../contexts/TaskModalContext";

const Header = () => {
  const boards = useSelector((state) => state.kanban);
  //  console.log(boards);
  const activeBoard = boards?.find((board) => board.isActive);
  // console.log(activeBoard);
  const boardName = activeBoard ? activeBoard.name : "No Board";

  return (
    <div className="p-2 flex items-center justify-between bg-white text-black shadow-sm">
      <div className="text-2xl font-bold ml-72 ">{boardName}</div>
      <div>
      <TaskModalProvider>
        <AddTaskButton/>
      </TaskModalProvider>
      </div>
    </div>
  );
};

export default Header;
