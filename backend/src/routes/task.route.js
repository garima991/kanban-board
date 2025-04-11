import express from  'express';
import {verifyJWT} from '../middleware/auth.middleware.js';
import { addSubtask, assignTask, changeTaskStatus, createTask, deleteSubtask, deleteTask, getTaskById, getTasksByBoard, removeTaskMember, updateSubtask, updateTask } from '../controllers/task.controller.js';
import { isBoardAdmin, isBoardMember, isTaskMember, isTaskOrBoardAdmin } from '../middleware/role.middleware.js';

const app = express.Router();

app.post('/:boardId/tasks', verifyJWT, isBoardAdmin, createTask);

app.get('/:boardId/tasks', verifyJWT, isBoardMember, getTasksByBoard);

app.get('/:boardId/tasks/:taskId', verifyJWT, isTaskMember, getTaskById);

app.patch('/:boardId/tasks/:taskId', verifyJWT, isTaskMember, updateTask);

app.delete('/:boardId/tasks/:taskId', verifyJWT, isTaskMember, deleteTask);

app.post('/:boardId/tasks/:taskId/subtask', verifyJWT, isTaskMember, addSubtask);

app.delete('/:boardId/tasks/:taskId/subtask/:subtaskId', verifyJWT, isTaskMember, deleteSubtask);

app.patch('/:boardId/tasks/:taskId/subtask/:subtaskId', verifyJWT, isTaskMember, updateSubtask);

app.post('/:boardId/tasks/:taskId/assign', verifyJWT, isTaskOrBoardAdmin, assignTask);

app.delete('/:boardId/tasks/:taskId/assign/:userId', verifyJWT, isTaskOrBoardAdmin, removeTaskMember);

app.patch('/:boardId/tasks/:taskId/status', verifyJWT, isTaskMember, changeTaskStatus);

export default app;