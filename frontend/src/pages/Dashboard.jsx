import React, { useState } from "react";
import Header from "../components/Header";
import Kanban from "./Kanban";
import ListView from "./ListView";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("kanban");

  const user = useSelector((state) => state.auth.user);

  return (
    <div className="w-full flex flex-col justify-between p-2 bg-white">
      <div className="sticky left-0 top-2 bg-white z-10">
        <Header activeView={activeView} setActiveView={setActiveView} />
      </div>
      {activeView === "kanban" ? (
          <Kanban />
      ) : (
        <ListView />
      )}
    </div>
  );
};

export default Dashboard;
