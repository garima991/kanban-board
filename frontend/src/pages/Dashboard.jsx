import React, { useState } from "react";
import Header from "../components/Header";
import Kanban from "./Kanban";
import ListView from "./ListView";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("kanban");

  const user = useSelector((state) => state.auth.user);

  return (
    <div className="w-full flex flex-col justify-between py-0 p-2 bg-white dark:bg-[#0E1118]">
      <div className="sticky left-0 top-0 bg-white dark:bg-[#0E1118] z-10">
        <Header activeView={activeView} setActiveView={setActiveView} />
      </div>
      {/* <div className="overflow-y-scroll"> */}
      {activeView === "kanban" ? (
          <Kanban />
      ) : (
        <ListView />
      )}
      {/* </div> */}
    </div>
  );
};

export default Dashboard;
