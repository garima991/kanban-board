import { configureStore } from "@reduxjs/toolkit";
import boardSlice from '../redux/features/boardSlice.js';
import authSlice from '../redux/features/authSlice.js';
import taskSlice from '../redux/features/taskSlice.js';


const store = configureStore({
    reducer : {
        kanban : boardSlice,
        auth : authSlice,
        task : taskSlice
    }
});

// const saveToLocalStorage = (state) => {
//     localStorage.setItem('KanbanBoardState', JSON.stringify(state));
//   };
  
//   let timeoutId;
//    store.subscribe(() => {
//     clearTimeout(timeoutId);
    
//     timeoutId = setTimeout(() => {
//       const state = store.getState(); 
//       saveToLocalStorage(state.kanban);  
//     }, 500)
    
//   });

export default store;