import React from "react";
import { useSelector } from "react-redux";

const TaskCard = ({ taskIndex, colIndex }) => {
  const boards = useSelector((state) => state.kanban);
  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;
  const column = columns.find((_, index) => index === colIndex);
  const task = column.tasks.find((_, index) => index === taskIndex);
  const tags = task.tags;

  return (
    <div className="w-full flex flex-col gap-2 bg-white shadow-lg p-3 rounded-md border-2 border-slate-300 hover:shadow-xl transition-all duration-200 ease-in-out">
      <div className="flex flex-row justify-start gap-4">
        <span className="p-1 bg-slate-100 rounded-md border-2">
          {tags.Other}
        </span>{" "}
        <span className="p-1 bg-slate-100 border-2">{tags.priority}</span>
      </div>
      <div className="w-[90%] flex flex-col items-start truncate">
        <h3 className=" text-lg font-medium">{task.title}</h3>
        <p className=" text-sm text-slate-500">{task.description}</p>
      </div>
      <hr className="text-gray-500" />
      <div className="flex flex-row justify-between items-center px-2">
        <div>
          <span>👤 {3}</span>
        </div>
        <div>
          <span>📎{task.attachments.length} </span>
          <span>💬 {task.comments.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
