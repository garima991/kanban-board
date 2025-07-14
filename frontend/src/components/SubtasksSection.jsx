import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addSubtask,
  updateSubtask,
  deleteSubtask, 
} from "../redux/features/taskSlice";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const SubtasksSection = ({ task }) => {
  const dispatch = useDispatch();
  const [newSubtask, setNewSubtask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    dispatch(
      addSubtask({ boardId: task.boardId, taskId: task._id, title: newSubtask })
    );
    setNewSubtask("");
  };

  const toggleSubtaskCompletion = (subtask) => {
    dispatch(
      updateSubtask({
        boardId: task.boardId,
        taskId: task._id,
        subtaskId: subtask._id,
        subtaskData: {
          title: subtask.title,
          isCompleted: !subtask.isCompleted,
        },
      })
    );
  };

  const handleEditClick = (subtask) => {
    setEditingId(subtask._id);
    setEditedTitle(subtask.title);
  };

  const handleDelete = (subtask) => {
    dispatch(
      deleteSubtask({
        boardId: task.boardId,
        taskId: task._id,
        subtaskId: subtask._id,
      })
    );
  };

  const handleSaveEdit = (subtask) => {
    if (!editedTitle.trim()) return;
    dispatch(
      updateSubtask({
        boardId: task.boardId,
        taskId: task._id,
        subtaskId: subtask._id,
        subtaskData: {
          title: editedTitle,
          isCompleted: subtask.isCompleted,
        },
      })
    );
    setEditingId(null);
    setEditedTitle("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedTitle("");
  };


  const handleNewSubtaskKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddSubtask();
    }
  };

  const handleEditKeyDown = (e, subtask) => {
    if (e.key === "Enter") {
      handleSaveEdit(subtask);
    }
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {task.subtasks?.map((subtask) => {
        const isEditing = editingId === subtask._id;

        return (
          <div
            key={subtask._id}
            className="group flex items-center gap-3 text-sm border-2 p-3 rounded-md justify-between"
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={subtask.isCompleted}
                onChange={() => toggleSubtaskCompletion(subtask)}
              />

              {isEditing ? (
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, subtask)}
                  className="flex-1 border rounded px-2 py-1 text-sm dark:text-white"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 dark:text-white ${
                    subtask.isCompleted ? "line-through text-gray-400" : ""
                  }`}
                >
                  {subtask.title}
                </span>
              )}

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {!isEditing && (
                  <>
                    <FiEdit2
                      className="cursor-pointer text-gray-500 hover:text-yellow-500"
                      onClick={() => handleEditClick(subtask)}
                      title="Edit"
                    />
                    <FiTrash2
                      className="cursor-pointer text-gray-500 hover:text-red-500"
                      onClick={() => handleDelete(subtask)}
                      title="Delete"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing && (
                <>
                  <button
                    className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleSaveEdit(subtask)}
                  >
                    Save
                  </button>
                  <button
                    className="text-xs px-2 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}

      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 text-sm border rounded px-2 py-1"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyDown={handleNewSubtaskKeyDown}
          placeholder="New subtask"
        />
        <button
          onClick={handleAddSubtask}
          disabled={!newSubtask.trim()}
          className={`text-sm px-3 py-1 rounded hover:bg-blue-600 text-white ${
            newSubtask.trim() ? "bg-blue-500" : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default SubtasksSection;
