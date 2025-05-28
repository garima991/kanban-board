import { createSlice, current } from "@reduxjs/toolkit";
import {boardData} from "../../data.json";

// Load data from local storage
// const loadDataFromLocalStorage = () => {
//     const savedState = localStorage.getItem("KanbanBoardState");
//     if (savedState) {
//         const data =  JSON.parse(savedState);
//         return data;
//     }

//     return boardData;
// };

const boardSlice = createSlice({
    name: "boards",
    initialState: boardData,
    reducers: {
        addBoard : (state, action) => {
            const { boardName, boardColumns } = action.payload;
            const isActive = state.length > 0 ? false : true;
            const board = {
                name: boardName,
                isActive,
                columns:[
                    { name: "Todo", tasks: [] },
                    { name: "On Progress", tasks: [] },
                    { name: "In Review", tasks: [] },
                    { name: "Done", tasks: [] },
                ]
            };

            state.push(board);
        },

        editBoardName: (state, action) => {
            const { boardName } = action.payload;
            const board = state.find((board) => board.isActive);
            if (board) {
                board.name = boardName;
            }
        },

        setBoardActive: (state, action) => {
            console.log(current(state));
            const boardName  = action.payload;
            state.forEach((board) => {
                board.isActive = board.name === boardName;
            });
          },

        deleteBoard: (state) => {
            const boardIndex = state.find((board) => board.isActive);
            state.splice(boardIndex, 1);
        },

        addTask: (state, action) => {
            const {
                title,
                dueDate,
                status,
                tags,
                description,
                subTasks,
                comments,
            } = action.payload;

            const task = {
                title,
                dueDate,
                status,
                tags,
                description,
                subTasks,
                comments
            };

            console.log(current(state));
            const board = state.find((board) => board.isActive);
            console.log(current(board));
            if (board) {
                const column = board.columns.find((col) => col.name === status);
                console.log(current(column));
                if (column) {
                    column.tasks.push(task);
                    console.log(current(column));
                }
            }
        },

        setTaskStatus: (state, action) => {
            const { taskIndex, newStatus, prevStatus } = action.payload;
            const board = state.find((board) => board.isActive);

            if (board) {
                const prevColumn = board.columns.find((col) => col.name === prevStatus);
                const task = prevColumn?.tasks[taskIndex];

                if (task && prevColumn) {
                    prevColumn.tasks.splice(taskIndex, 1);
                    const newColumn = board.columns.find((col) => col.name === newStatus);
                    if (newColumn) {
                        task.status = newStatus;
                        newColumn.tasks.push(task);
                    }
                }
            }
        },

        editTask: (state, action) => {
            const {
                title,
                dueDate,
                status,
                tags,
                description,
                subTasks,
                comments,
                newStatus,
            } = action.payload;

            const board = state.find((board) => board.isActive);
            if (board) {
                const currentColumn = board.columns.find((col) => col.name === status);
                const task = currentColumn?.tasks[taskIndex];

                if (task) {
                    task.title = title;
                    task.dueDate = dueDate;
                    task.status = newStatus || status;
                    task.description = description;
                    task.tags = tags;
                    task.subtasks = subTasks;
                    task.comments = comments;

                    if (newStatus && currentColumn.name !== newStatus) {
                        currentColumn.tasks.splice(taskIndex, 1);
                        const newColumn = board.columns.find((col) => col.name === newStatus);
                        newColumn?.tasks.push(task);
                    }
                }
            }
        },

        dragTask: (state, action) => {
            const { taskIndex, prevStatus, newStatus } = action.payload;
            const board = state.find((board) => board.isActive);
            if (board) {
                const prevColumn = board.columns.find((col) => col.name === prevStatus);
                const newColumn = board.columns.find((col) => col.name === newStatus);

                const task = prevColumn?.tasks[taskIndex];
                if (task) {
                    prevColumn.tasks.splice(taskIndex, 1);
                    newColumn?.tasks.push(task);
                }
            }
        },

        deleteTask: (state, action) => {
            const { taskIndex, columnName } = action.payload;
            const board = state.find((board) => board.isActive);
            if (board) {
                const column = board.columns.find((col) => col.name === columnName);
                if (column) {
                    column.tasks.splice(taskIndex, 1);
                }
            }
        },

        setTaskPriority: (state, action) => {
            const {taskIndex, columnName, priority} = action.payload;
            const board = state.find((board) => board.isActive);
            if(board){
                const column = board.columns.find((col) => col.name === columnName);
                const task = column?.tasks[taskIndex];

                if(task){
                    task.tags.priority = priority;
                }
            }
        },

        setSubtaskCompleted: (state, action) => {
            const { taskIndex, subtaskIndex, columnName } = action.payload;
            const board = state.find((board) => board.isActive);
            if (board) {
                const column = board.columns.find((col) => col.name === columnName);
                const task = column?.tasks[taskIndex];

                if (task) {
                    const subtask = task.subtasks[subtaskIndex];
                    if (subtask) {
                        subtask.isCompleted = !subtask.isCompleted;
                    }
                }
            }
        },

        deleteSubtask: (state, action) => {
            const { taskIndex, subtaskIndex, columnName } = action.payload;
            const board = state.find((board) => board.isActive);
            if (board) {
                const column = board.columns.find((col) => col.name === columnName);
                const task = column?.tasks[taskIndex];

                if (task) {
                    task.subtasks.splice(subtaskIndex, 1);
                }
            }
        },
    },
});

export const {
    addBoard,
    editBoardName,
    setBoardActive,
    deleteBoard,
    addTask,
    setTaskStatus,
    editTask,
    dragTask,
    deleteTask,
    setSubtaskCompleted,
    deleteSubtask,
} = boardSlice.actions;

export default boardSlice.reducer;