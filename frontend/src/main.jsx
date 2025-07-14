import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { TaskModalProvider } from "../src/contexts/TaskModalContext.jsx";
import { BoardModalProvider } from "./contexts/BoardModalContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BoardModalProvider>
        <TaskModalProvider>
          <App />
        </TaskModalProvider>
      </BoardModalProvider>
    </Provider>
  </StrictMode>
);
