import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import Column from "../components/Column";
import { tasksApi } from "../apis/axiosInstance";
import { toast } from "react-hot-toast";

const Kanban = () => {
  const boards = useSelector((state) => state.kanban.value);
  const isBoardLoading = useSelector((state) => state.kanban.isLoading);

  // memoized active board to prevent unnecessary re-renders
  const board = useMemo(
    () => boards?.find((board) => board.isActive === true),
    [boards]
  );

  const {columns, boardId} = useMemo(() => ({
    columns : board?.columns,
    boardId : board?._id
  }), [board])

  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const isLoading = isBoardLoading || isLoadingTasks;
  
  // Optimistic task Fetching tasks when board changes
  const fetchTasks = useCallback(async () => {
    if (!boardId) return;
    setIsLoadingTasks(true);
    try {
      const response = await tasksApi.getTasksByBoard(boardId);
      setTasks(response.data.tasks);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch tasks';
      console.error("Failed to fetch tasks:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [boardId]);

  // optimistic update for handling task status change
  const handleTaskStatusChange = useCallback(async (taskId, newStatus) => {
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
      console.log(error);
      console.error("Failed to update task status:", error);
      toast.error(error.response.data.message);
      // Refresh tasks to ensure consistency
      await fetchTasks();
    }
  }, [boardId, tasks, fetchTasks]);


  // Handle new task added with optinised refetch
  const handleTaskAdded = useCallback(async (newTask) => {
    if(newTask){
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }else{
    await fetchTasks();
    }
  }, [fetchTasks]);

  // fetch tasks when board changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

   const LoadingComponent = useMemo(() => (
    <div className="mt-40 flex flex-row justify-center items-center w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      <span className="ml-3 text-gray-600">Loading tasks...</span>
    </div>
  ), []);

   if (isLoading) {
    return LoadingComponent;
  }

  return board ? (
    <div className="flex flex-row gap-4 w-full">
      {columns.map((col, index) => (
        <Column
          key={col._id || index}
          colIndex={index}
          column={col}
          tasks={tasks}
          onTaskStatusChange={handleTaskStatusChange}
          onTaskAdded={handleTaskAdded}
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
