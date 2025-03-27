import { configureStore } from "@reduxjs/toolkit";
import boardSlice from '../redux/features/boardSlice'

const store = configureStore({
    reducer : {
        kanban : boardSlice,
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