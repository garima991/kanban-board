// components/SubtasksSection.js
import React, { useState } from "react";
import { tasksApi } from "../apis/axiosInstance";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../redux/features/taskSlice";

const SubtasksSection = ({ task }) => {
  const dispatch = useDispatch();
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    try {
      await tasksApi.addSubtask(task.boardId, task._id, { title: newSubtask });
      dispatch(fetchTasks(task.boardId));
      setNewSubtask("");
    } catch (error) {
      toast.error("Failed to add subtask");
      console.error(error);
    }
  };

  const toggleSubtaskCompletion = async ({ subtask }) => {
    try {
      console.log(subtask._id);
      await tasksApi.updateSubtask(task.boardId, task._id, subtask._id, {
        title: subtask.title,
        isCompleted: !subtask.isCompleted,
      });
      dispatch(fetchTasks(task.boardId)); // Refetch task
    } catch (error) {
      toast.error("Failed to update subtask");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {task.subtasks?.map((subtask) => {
        console.log(subtask);
        return (
          <div
            key={subtask._id}
            className="flex items-center gap-3 text-sm border-2 p-3 rounded-md"
          >
            <input
              type="checkbox"
              checked={subtask.isCompleted}
              onChange={() => toggleSubtaskCompletion(subtask)}
            />
            <span
              className={
                subtask.isCompleted ? "line-through text-gray-400" : ""
              }
            >
              {subtask.title}
            </span>
          </div>
        );
      })}

      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 text-sm border rounded px-2 py-1"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="New subtask"
        />
        <button
          onClick={handleAddSubtask}
          className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default SubtasksSection;
