import express from 'express';
import { getAllUsers, getUserById, searchUsers, updateUserRole } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { isBoardAdmin, isTaskOrBoardAdmin } from '../middleware/role.middleware.js';

const app = express.Router();

app.get('/', verifyJWT, getAllUsers);

app.get('/search', verifyJWT, searchUsers); 

app.get('/:userId', verifyJWT, getUserById); 

app.patch('/:userId/role', verifyJWT, isBoardAdmin, updateUserRole); 

export default app;