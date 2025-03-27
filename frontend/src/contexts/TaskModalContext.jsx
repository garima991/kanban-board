import React, { createContext, useContext, useState } from "react";


const TaskModalContext = createContext();


export const useModal = () => useContext(TaskModalContext);


export const TaskModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TaskModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </TaskModalContext.Provider>
  );
};
