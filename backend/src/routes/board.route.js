import express from 'express';
import { addMember, createBoard, deleteBoard, getBoardById, getBoards, removeMember, updateBoard } from '../controllers/board.controller.js';
import { isBoardAdmin, isBoardMember } from '../middleware/role.middleware.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createBoard);

router.get('/', protect, getBoards);

router.get('/:boardId', protect, isBoardMember, getBoardById);

router.patch('/:boardId', protect, isBoardMember, updateBoard);

router.delete('/:boardId', protect, isBoardAdmin, deleteBoard);

router.post('/:boardId/members', protect, isBoardAdmin, addMember);

router.delete('/:boardId/members/:userId', protect, isBoardAdmin, removeMember);


export default router;
