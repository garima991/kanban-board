import express from 'express';
import { addMember, createBoard, deleteBoard, getBoardById, getBoardMembers, getBoards, removeMember, updateBoard } from '../controllers/board.controller.js';
import { isBoardAdmin, isBoardMember } from '../middleware/role.middleware.js';
import {verifyJWT} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, createBoard);

router.get('/', verifyJWT, getBoards);

router.get('/:boardId', verifyJWT, isBoardMember, getBoardById);

router.patch('/:boardId', verifyJWT, isBoardMember, updateBoard);

router.delete('/:boardId', verifyJWT, isBoardAdmin, deleteBoard);

router.post('/:boardId/members', verifyJWT, isBoardAdmin, addMember);

router.get('/:boardId/members', verifyJWT, isBoardMember, getBoardMembers);

router.delete('/:boardId/members/:userId', verifyJWT, isBoardAdmin, removeMember);


export default router;
