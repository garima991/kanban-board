import express from  'express';
import protect from '../middleware/auth.middleware.js';
import { addSubtask, assignTask, changeTaskStatus, createTask, deleteSubtask, deleteTask, getAllTasks, getTaskById, removeTaskMember, updateSubtask, updateTask } from '../controllers/task.controller.js';
import { isBoardAdmin, isBoardMember, isTaskMember, isTaskOrBoardAdmin } from '../middleware/role.middleware.js';

const app = express.Router();

app.post('/:boardId/tasks', protect, isBoardAdmin, createTask);

app.get('/:boardId/tasks', protect, isBoardMember, getAllTasks);

app.get('/:boardId/tasks/:taskId', protect, isTaskMember, getTaskById);

app.patch('/:boardId/tasks/:taskId', protect, isTaskMember, updateTask);

app.delete('/:boardId/tasks/:taskId', protect, isTaskMember, deleteTask);

app.post('/:boardId/tasks/:taskId/subtask', protect, isTaskMember, addSubtask);

app.delete('/:boardId/tasks/:taskId/subtask/:subtaskId', protect, isTaskMember, deleteSubtask);

app.patch('/:boardId/tasks/:taskId/subtask/:subtaskId', protect, isTaskMember, updateSubtask);

app.post('/:boardId/tasks/:taskId/assignee', protect, isTaskOrBoardAdmin, assignTask);

app.delete('/:boardId/tasks/:taskId/assignee/:userId', protect, isTaskOrBoardAdmin, removeTaskMember);

app.patch('/:boardId/tasks/:taskId/status', protect, isTaskMember, changeTaskStatus);

export default app;