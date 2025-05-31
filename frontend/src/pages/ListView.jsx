import React, { useEffect } from "react";
import { FaCalendar, FaCheckCircle, FaList } from "react-icons/fa";
import { LuTarget } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/features/taskSlice";

const ListView = () => {
  const boards = useSelector((state) => state.kanban.value);
  const board = boards?.find((board) => board.isActive === true);
  const columns = board?.columns;
  const tasks = useSelector((state) => state.task.tasks);
  const dispatch = useDispatch();


  useEffect(() => {
    if(board){
      dispatch(fetchTasks(board._id))
    }
  }, [board])

  return columns ? (
    <div className="flex flex-col gap-4 w-full">
      {columns.map((column, index) => {
        // Filter tasks based on status
        const columnTasks = tasks.filter((task) => task.status === column.name);

        return (
          <div key={index} className="mb-6">
            <div className="bg-gray-100 rounded-md p-2 flex flex-row items-center">
              <h2 className="text-md text-left ml-6 font-semibold border-b flex flex-row items-center justify-center gap-2">
                <div
                  className={`h-6 w-2 rounded-sm ${
                    column.name === "To Do"
                      ? "bg-gray-600"
                      : column.name === "On Progress"
                      ? "bg-blue-500"
                      : column.name === "In Review"
                      ? "bg-yellow-500"
                      : column.name === "Completed"
                      ? "bg-green-500"
                      : "bg-red-50"
                  }`}
                ></div>
                {column.name}
              </h2>
            </div>

            <table className="w-full bg-white shadow-lg rounded-lg">
              <thead className="w-full border-2">
                <tr>
                  <th className="py-2 w-1/5 text-gray-500">
                    <div className="flex flex-row items-center justify-center gap-1 font-normal">
                      <LuTarget /> Task Name
                    </div>
                  </th>
                  <th className="py-2 w-1/5 text-gray-500">
                    <div className="flex flex-row items-center justify-center gap-1 font-normal">
                      <FaList /> Description
                    </div>
                  </th>
                  <th className="py-2 w-1/5 text-gray-500">
                    <div className="flex flex-row items-center justify-center gap-1 font-normal">
                      <FaCalendar /> Due Date
                    </div>
                  </th>
                  <th className="py-2 w-1/5 text-gray-500">
                    <div className="flex flex-row items-center justify-center gap-1 font-normal">
                      Type
                    </div>
                  </th>
                  <th className="py-2 w-1/5 text-gray-500">
                    <div className="flex flex-row items-center justify-center gap-1 font-normal">
                      <FaCheckCircle /> Priority
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {columnTasks.length > 0 ? (
                  columnTasks.map((task, idx) => (
                    <TableRow key={task.id || idx} task={task} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No tasks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="mt-40 flex flex-row justify-center items-center w-full font-semibold text-center text-xl text-gray-500">
      No active board. Please choose or create a board first.
    </div>
  );
};

const TableRow = ({ task }) => {
  return (
    <tr className="border-2">
      <td className="px-3 py-2 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        {task.title}
      </td>
      <td className="px-3 py-2 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        {task.description}
      </td>
      <td className="px-3 py-2 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        {new Date(task.dueDate).toLocaleDateString()}
      </td>
      <td className="px-3 py-2 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        {Array.isArray(task.tags) ? task.tags.join(", ") : task.tags}
      </td>
      <td className="px-3 py-2 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        <span
          className={`px-2 rounded-md text-sm ${
            task.priority === "High"
              ? "bg-red-200"
              : task.priority === "Medium"
              ? "bg-yellow-200"
              : "bg-green-100"
          }`}
        >
          {task.priority}
        </span>
      </td>
    </tr>
  );
};

export default ListView;
