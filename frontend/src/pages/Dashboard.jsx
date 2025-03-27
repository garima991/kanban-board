import React from "react";
const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-screen h-52 overflow-hidden">
        
      </div>
      <div className="flex flex-col gap-4">
        <h1>Project Name</h1>
        <p>Project Description</p>
        <div className="flex justify-between">
          <ul>
           <li>Kanban </li>
            <li>Table</li>
            <li>List</li>
          </ul>
          <input type="search" name="" id="" />
        </div>
      </div>
      <div>
        {/* {KanBan Board} */}
       {/* {List} */}
      </div>
    </div>
  );
};

export default Dashboard;
