import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegCircle } from "react-icons/fa";
import TaskCard from './TaskCard';

const Column = ({colIndex}) => {
    const boards = useSelector((state) => state.kanban);
    const board = boards.find((board) => board.isActive === true);
    // console.log(board);
    const column = board.columns.find((col, index) => index === colIndex);
    // console.log(column);
    const tasks = column.tasks;
    console.log(column.tasks);
    {tasks.map((task) => {
      console.log(task.title);
    })}

    const dispatch = useDispatch(); // dispatch dragTask

    const circleColor = () => {
        if (column.name === "Todo") {
          return "#808080"; 
        }
        else if (column.name === "On Progress") {
          return "#0000FF"; 
        }
        else if (column.name === "In Review") {
          return "#FFA500"; 
        }
        else {
          return "#008000";  
        }
      };
    
  return (
    <div className='flex flex-col justify-start flex-1 min-w-32 gap-2 h-screen'>
      <div className='sticky top-0 flex items-center justify-center gap-2 font-semibold bg-[#F3F5F9] px-2 py-2 rounded-md'>
        <FaRegCircle color={circleColor()}/>
        <h3 className='text-nowrap'>{column.name}({column.tasks.length})</h3>
      </div>
        <div className='flex flex-col gap-3 py-2 px-1'>
            {tasks.map((_, index) => {
                return <TaskCard key = {index} taskIndex = {index} colIndex = {colIndex}/>
            })}
        </div>
    </div>
  )
}

export default Column;
