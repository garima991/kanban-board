import React from "react";
import { FaCalendar, FaCheck, FaCheckCircle, FaList } from "react-icons/fa";
import { FaTimeline } from "react-icons/fa6";
import { FiTarget } from "react-icons/fi";
import { GoDeviceDesktop } from "react-icons/go";
import { LuTarget } from "react-icons/lu";
import { useSelector } from "react-redux";

const ListView = () => {
  const boards = useSelector((state) => state.kanban.value);
  const board = boards?.find((board) => board.isActive === true);
  const columns = board?.columns;

  return columns ? (
    <div className="mt-36 flex flex-col gap-4 w-full">
      {columns.map((column, index) => (
        <div key={index} className="mb-6">
          <div className="bg-gray-100 rounded-md p-2 flex flex-row items-center">
            <h2 className="text-md text-left ml-6 font-semibold border-b flex flex-row items-center justify-center gap-2">
              <div
                className={`h-6 w-2 rounded-sm ${
                  column.name === "Todo"
                    ? "bg-gray-500"
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
              {/* <tr className="w-full"> */}
              <td className="py-1 w-1/5 text-gray-500 ">
                <div className="flex flex-row items-center justify-center gap-1 font-semibold">
                  <LuTarget /> Task Name
                </div>
              </td>
              <td className="py-1 w-1/5  text-gray-500 ">
                <div className="flex flex-row items-center justify-center gap-1 font-semibold">
                  <FaList /> Description
                </div>
              </td>
              <td className="py-1 w-1/5  text-gray-500 ">
                <div className="flex flex-row items-center justify-center gap-1 font-semibold">
                  <FaCalendar /> Due Date
                </div>
              </td>
              <td className="py-1 w-1/5  text-gray-500 ">
                <div className="flex flex-row items-center justify-center gap-1 font-semibold">
                  Type
                </div>
              </td>
              <td className="py-1 w-1/5 text-gray-500 ">
                <div className="flex flex-row items-center justify-center gap-1 font-semibold">
                  <FaCheckCircle /> Priority
                </div>
              </td>
              {/* </tr> */}
            </thead>
            <tbody>
              {column?.tasks?.length > 0 ? (
                column.tasks.map((task, idx) => (
                  <TableRow key={idx} task={task} />
                ))
              ) : (
                <tr>
                  <td colSpan="100%" className="text-center py-4 text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  ) : (
    <div className="mt-40 flex flex-row justify-center align-center w-full font-semibold text-center text-xl text-gray-500 ">
      No active board. Please choose or create a board first.
    </div>
  );
};

const TableRow = ({ task }) => {
  return (
    <tr className="border-2">
      <td className="p-1 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        {task.title}
      </td>
      <td className="p-1 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        {task.description}
      </td>
      <td className="p-1 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        {task.dueDate}
      </td>
      <td className="p-1 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        {task.tags?.Other}
      </td>
      <td className="p-1 border-2 truncate max-w-[150px] overflow-hidden whitespace-nowrap">
        <span
          className={`px-2 rounded-md text-sm ${
            task.tags.priority === "High"
              ? "bg-red-200"
              : task.tags.priority === "Medium"
              ? "bg-yellow-200"
              : "bg-green-100"
          }`}
        >
          {task.tags.priority}
        </span>
      </td>
    </tr>
  );
};

export default ListView;
