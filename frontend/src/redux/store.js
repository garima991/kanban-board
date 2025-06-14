import { configureStore } from "@reduxjs/toolkit";
import boardSlice from '../redux/features/boardSlice.js';
import authSlice from '../redux/features/authSlice.js';
import taskSlice from '../redux/features/taskSlice.js';
import appSlice from '../redux/features/appSlice.js'


const store = configureStore({
    reducer : {
        app: appSlice,
        kanban : boardSlice,
        auth : authSlice,
        boardTasks : taskSlice
    }
});


export default store;