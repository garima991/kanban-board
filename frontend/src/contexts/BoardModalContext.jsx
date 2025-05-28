import React, { createContext, useContext, useState } from "react";

const BoardModalContext = createContext();

export const useBoardModal = () => useContext(BoardModalContext);

export const BoardModalProvider = ({ children }) => {
  const [isBoardFormOpen, setBoardFormOpen] = useState(false);

  return (
    <BoardModalContext.Provider value={{ isBoardFormOpen, setBoardFormOpen }}>
      {children}
    </BoardModalContext.Provider>
  );
};
