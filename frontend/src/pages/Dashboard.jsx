import React, { useState } from "react";
import Header from "../components/Header";
import Kanban from "./Kanban";
import ListView from "./ListView";
import { TaskModalProvider } from "../contexts/TaskModalContext";
import Login from "./AuthForm";
import LandingPage from "./LandingPage";
import { useSelector } from "react-redux";
const Dashboard = () => {
  const [activeView, setActiveView] = useState("kanban");

  const user = useSelector((state) => state.auth.user);
  
  return (
    <div className="w-full flex flex-row justify-between gap-4 p-2">
      <div className="w-full fixed top-0 left-auto right-0 bg-white z-10">
        <Header activeView={activeView} setActiveView={setActiveView} />
      </div>
      {/* <div className='mt-14'> */}
      {activeView === "kanban" ? (
        <TaskModalProvider>
          <Kanban />
        </TaskModalProvider>
      ) : (
        <ListView />
      )}
      {/* </div> */}
      
    </div>
  );
};

export default Dashboard;
