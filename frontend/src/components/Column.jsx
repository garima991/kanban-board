import React, { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import { useTaskModal } from "../contexts/TaskModalContext";
import { AddTaskModal } from "./AddTaskButton";
import { FaRegCircle } from "react-icons/fa";
import TaskDetailView from "../components/TaskDetailView";
import { useDispatch, useSelector } from "react-redux";
import {
  makeSelectTasksByStatus,
  updateTaskStatus,
} from "../redux/features/taskSlice";

const Column = ({ column }) => {
  const dispatch = useDispatch();
  const selectTasksByStatus = useMemo(makeSelectTasksByStatus, []); // memoized selector instance for this component instance
  const columnTasks = useSelector((state) =>
    selectTasksByStatus(state, column.name)
  );
  const isOnline = useSelector((state) => state.app.isOnline);

  const { setTaskFormOpen } = useTaskModal();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();

    if (!isOnline) return;

    const { boardId, taskId, prevStatus } = JSON.parse(
      e.dataTransfer.getData("text")
    );

    if (prevStatus !== column.name) {
      try {
        dispatch(updateTaskStatus({ boardId, taskId, newStatus: column.name }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
     if (!isOnline) return;
  };

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
    <div className="relative flex flex-col justify-start flex-1 min-w-64 h-screen px-1 min-h-fit">
      <div className="sticky xs:top-[180px] md:top-[131px] z-2 flex items-center justify-between gap-2 bg-[#F3F5F9] dark:bg-[#0E1118] px-3 py-2 rounded-md font-semibold">
        <div className="flex flex-row items-center gap-2">
          <FaRegCircle color={circleColor} />
          <h3 className="text-nowrap dark:text-white">
            {column.name} ({columnTasks.length})
          </h3>
        </div>
        <button
          className="text-gray-100 cursor-pointer hover:text-blue-600 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
          onClick={() => setTaskFormOpen(true)}
          disabled={!isOnline}
        >
          +
        </button>
      </div>
      <AddTaskModal />
      <div
        className="flex flex-1 flex-col gap-3 py-2"
        onDrop={handleDrop}
        onDragOver={handleOnDragOver}
      >
        {columnTasks?.map((task) => (
          <TaskCard key={task._id} task={task} onTaskClick={handleTaskClick} />
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
