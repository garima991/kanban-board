import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Column from "../components/Column";
import { tasksApi } from "../apis/axiosInstance";
import { toast } from "react-hot-toast";

const Kanban = () => {
  const boards = useSelector((state) => state.kanban.value);
  const board = boards?.find((board) => board.isActive === true);
  const columns = board?.columns;
  const boardId = board?._id;

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch tasks when board changes
  const fetchTasks = useCallback(async () => {
    if (!boardId) return;
    setIsLoading(true);
    try {
      const response = await tasksApi.getTasksByBoard(boardId);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  // Handle task status change
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const response = await tasksApi.changeTaskStatus(boardId, taskId, newStatus);
      // Update local state with the updated task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? response.data.task : task
        )
      );
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status");
      // Refresh tasks to ensure consistency
      await fetchTasks();
    }
  };

  // Handle new task added
  const handleTaskAdded = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [boardId, fetchTasks]);

  if (isLoading) {
    return (
      <div className="mt-40 flex flex-row justify-center align-center w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return board ? (
    <div className="mt-20 flex flex-row gap-4 w-full">
      {columns.map((col, index) => (
        <Column
          key={col._id || index}
          colIndex={index}
          column={col}
          tasks={tasks}
          onTaskStatusChange={handleTaskStatusChange}
          onTasksUpdate={handleTaskAdded}
        />
      ))}
    </div>
  ) : (
    <div className="mt-40 flex flex-row justify-center align-center w-full font-semibold text-center text-xl text-gray-500 ">
      No active board. Please choose or create a board first.
    </div>
  );
};

export default Kanban;
