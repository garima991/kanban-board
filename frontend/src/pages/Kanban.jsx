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
    (state) => state.boardTasks
  );

  useEffect(() => {
    if (boardId) {
      dispatch(fetchTasks(boardId));
    }
  }, [dispatch, boardId, board]);


  if (isBoardLoading || isTaskLoading) {
    return (
      <div className="mt-20 flex flex-row justify-center items-center w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-100 " />
        <span className="ml-3 text-gray-600 dark:text-gray-50">Loading tasks...</span>
      </div>
    );
  }

  return board ? ( 
    <div className="xs:grid xs:grid-cols-1 sm:grid sm:grid-cols-1 md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 xs:gap-9 md:py-[1px]" >
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
