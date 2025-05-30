import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Column from "../components/Column";
import { fetchTasks } from "../redux/features/taskSlice";

const Kanban = () => {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.kanban.value);
  const isBoardLoading = useSelector((state) => state.kanban.isLoading);
  
  const board = useMemo(() => boards?.find((b) => b.isActive), [boards]);
  const { columns, boardId } = useMemo(
    () => ({
      columns: board?.columns,
      boardId: board?._id,
    }),
    [board]
  );

  const { isTaskLoading } = useSelector(
    (state) => state.task
  );

  useEffect(() => {
    if (boardId) {
      dispatch(fetchTasks(boardId));
    }
  }, [dispatch, boardId]);


  if (isBoardLoading || isTaskLoading) {
    return (
      <div className="mt-40 flex flex-row justify-center items-center w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        <span className="ml-3 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return board ? (
    <div className="flex flex-row gap-4">
      {columns.map((col, index) => (
        <Column
          key={col._id || index}
          column = {col}
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
