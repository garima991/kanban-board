import React, { useEffect } from "react";
import { FaCalendar, FaCheckCircle, FaList } from "react-icons/fa";
import { LuTarget } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/features/taskSlice";

const ListView = () => {
  const boards = useSelector((state) => state.kanban.value);
  const board = boards?.find((board) => board.isActive === true);
  const columns = board?.columns;
  const tasks = useSelector((state) => state.boardTasks.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    if (board) {
      dispatch(fetchTasks(board._id));
    }
  }, [board]);

  const list = [
    { icon: <LuTarget />, label: "Task Name" },
    { icon: <FaList />, label: "Description" },
    { icon: <FaCalendar />, label: "Due Date" },
    { icon: null, label: "Type" },
    { icon: <FaCheckCircle />, label: "Priority" },
  ];

  return columns ? (
    <div className="flex flex-col gap-6 w-full ">
      {columns.map((column, index) => {
        const columnTasks = tasks.filter((task) => task.status === column.name);

        return (
          <div key={index} className="mb-6 w-full">
            <div className="bg-gray-200 rounded-md p-2 flex items-center">
              <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 ml-2 sm:ml-6">
                <div
                  className={`h-5 w-2 rounded-sm  ${
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

            <div className="overflow-x-auto">
              <table className="min-w-[700px] w-full bg-white shadow-lg rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {list.map(({ icon, label }) => (
                      <th
                        key={label}
                        className="py-3 px-2 text-gray-500 text-sm bg-gray-100"
                      >
                        <div className="flex items-center justify-center gap-1 font-medium whitespace-nowrap">
                          {icon} {label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task, idx) => (
                      <TableRow key={task.id || idx} task={task} />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-gray-500 text-sm"
                      >
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="mt-40 flex justify-center items-center w-full text-center text-gray-500 text-lg sm:text-xl font-medium">
      No active board. Please choose or create a board first.
    </div>
  );
};

const TableRow = ({ task }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-3 py-2 truncate max-w-[200px] text-sm">{task.title}</td>
      <td className="px-3 py-2 truncate max-w-[200px] text-sm">
        {task.description}
      </td>
      <td className="px-3 py-2 text-sm">
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
      </td>
      <td className="px-3 py-2 truncate max-w-[200px] text-sm">
        {Array.isArray(task.tags) ? task.tags.join(", ") : task.tags}
      </td>
      <td className="px-3 py-2 text-sm">
        <span
          className={`px-2 py-1 rounded-md text-xs ${
            task.priority === "High"
              ? "bg-red-200 text-red-800"
              : task.priority === "Medium"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {task.priority}
        </span>
      </td>
    </tr>
  );
};

export default ListView;
