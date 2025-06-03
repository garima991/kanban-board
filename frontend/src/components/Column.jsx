import React, { useCallback, useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { useTaskModal } from "../contexts/TaskModalContext";
import { AddTaskModal } from "./AddTaskButton";
import { FaRegCircle } from "react-icons/fa";
import TaskDetailView from "./TaskDetailView";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskStatus } from "../redux/features/taskSlice";

const Column = ({column}) => {
  const dispatch = useDispatch();
 const columnTasks = useSelector((state) => state.task.tasks.filter((task) => task.status === column.name));

  const { setTaskFormOpen } = useTaskModal();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);

  
  const handleDrop = (e) => {
    e.preventDefault();
    const {boardId, taskId, prevStatus } = JSON.parse(e.dataTransfer.getData("text"));
    
    if (prevStatus !== column.name) {
      try {
       dispatch(updateTaskStatus({boardId, taskId, newStatus: column.name }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleOnDragOver = (e) => e.preventDefault();

  const handleTaskClick = (taskId) => {
    setSelectedTaskIndex(taskId);
    setModalOpen(true);
  };


  const colorMap = {
    "To Do": "#808080",
    "On Progress": "#0000FF",
    "In Review": "#FFA500",
    "Completed": "#008000",
  };

  const circleColor = colorMap[column.name];

  return (
    <div className="relative flex flex-col justify-start flex-1 min-w-64 gap-2 h-screen ">
      <div className="sticky top-36 flex items-center justify-between gap-2 font-semibold bg-[#F3F5F9] px-4 py-2 rounded-md ">
        <div className="flex items-center gap-2">
          <FaRegCircle color={circleColor} />
          <h3 className="text-nowrap">
            {column.name} ({columnTasks.length})
          </h3>
        </div>
        <button
          className="text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => setTaskFormOpen(true)}
        >
          +
        </button>
      </div>
      <AddTaskModal />
      <div
        className="max-h-[72vh] flex flex-col flex-1 gap-3 py-2 px-1 "
        onDrop={handleDrop}
        onDragOver={handleOnDragOver}
      >
        {columnTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>
      <TaskDetailView
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={columnTasks.find((t) => t._id === selectedTaskIndex)}
      />
    </div>
  );
};

export default Column;
