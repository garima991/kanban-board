import React, { useEffect, useState } from "react";
import { TbSubtask } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

const TaskCard = ({ task, onTaskClick }) => {
  if (!task) return null;

  const handleDrag = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "text",
      JSON.stringify({
        boardId: task.boardId,
        taskId: task._id,
        prevStatus: task.status,
      })
    );
  };

  const boardMembers = useSelector((state) => state.kanban.activeBoardMembers);
  const isOnline = useSelector((state) => state.app.isOnline);

  const [assignees, setAssignees] = useState([]);

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

  return (
    <div
      className={`w-full flex flex-col gap-2 bg-white shadow-lg p-3 rounded-md border-[1.5px] border-gray-300 border-l-4 border-l-blue-300 hover:shadow-xl transition-all duration-200 ease-in-out cursor-${
        isOnline ? "grab" : "not-allowed"
      }`}
      draggable={isOnline}
      onDragStart={handleDrag}
      onClick={() => onTaskClick(task._id)}
    >
      <div className="flex gap-2">
        {task?.tags && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 border rounded">
            {task?.tags}
          </span>
        )}
        {task.priority && (
          <span
            className={`px-2 py-1 text-xs bg-gray-100 border rounded ${
              task.priority === "Low"
                ? "bg-green-200 text-green-800"
                : task.priority === "Medium"
                ? "bg-orange-200 text-orange-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {task.priority}
          </span>
        )}
      </div>
      <div className="flex flex-col items-start ml-4 w-[90%] truncate">
        <h3 className="text-lg font-semibold truncate">{task.title}</h3>
        <p className="text-sm text-gray-600 truncate">{task.description}</p>
      </div>
      <hr className="my-1 text-gray-300" />
      <div className="flex justify-between items-center text-xs text-gray-500 px-1">
        <div className="flex -space-x-1">
          {assignees?.map((user) => (
            <span
              key={user._id}
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white bg-blue-50 text-blue-900 border-2 border-gray-300"
              title={user.name}
            >
              {getInitials(user.name)}
            </span>
          ))}
        </div>
        <span className="flex gap-1">
          {task.subtasks?.length > 0 && (
            <span className="flex gap-1">
              {" "}
              <TbSubtask />
              {task.subtasks.length}{" "}
            </span>
          )}
          💬 {task.comments?.length || 0}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
