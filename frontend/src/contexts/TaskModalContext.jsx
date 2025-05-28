import React, { createContext, useContext, useState } from "react";


const TaskModalContext = createContext();


export const useTaskModal = () => useContext(TaskModalContext);


export const TaskModalProvider = ({ children }) => {
  const [isTaskFormOpen, setTaskFormOpen] = useState(false);

  return (
    <TaskModalContext.Provider value={{ isTaskFormOpen, setTaskFormOpen }}>
      {children}
    </TaskModalContext.Provider>
  );
};
