import {Board} from '../models/board.model.js'
import { Task } from '../models/task.model.js';

// middleware to check if user is a member of the board

export const isBoardMember = async (req, res, next) => {
    try {
        const {boardId} = req.params;
        const userId = req.user._id; 

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        const member = board.members.find((member) => member.user.toString() === userId.toString());
        if(!member){
            return res.status(403).json({ message: 'You are not a member of this board' });
        }

        next();
    }
    catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// middleware to check if user is an admin of the board

export const isBoardAdmin = async (req, res, next) => {
    try {
        const {boardId} = req.params;
        const userId = req.user._id;

        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        if(!board.admin.toString() === userId.toString()){
            return res.status(403).json({ message: 'You are not an admin of this board' });
        }

        next();
    }
    catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// middleware to check if user is an admin of the task or board admin
export const isTaskOrBoardAdmin = async (req, res, next) => {
    try {
        const { boardId, taskId } = req.params;
        const userId = req.user._id;
        const task = await Task.findById(taskId).populate("boardId");
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const isBoardAdmin = task.boardId.admin.toString() === userId.toString();
        const isTaskAdmin = task.taskAdmin && task.taskAdmin.toString() === userId.toString(); // Check taskAdmin
        if (!isBoardAdmin &&!isTaskAdmin) {
            return res.status(403).json({ message: "Access denied. You are not an admin of the task or a board admin." });
        }
        next();
    } catch (error) {
        console.error("Error in isTaskOrBoardAdmin middleware:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// middleware to check if task owner or assignee or board admin

export const isTaskMember = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const userId = req.user._id;

        const task = await Task.findById(taskId).populate("boardId");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const isAssigned = task.assignedTo.some(assignee => assignee.toString() === userId.toString());
        const isBoardAdmin = task.boardId.admin.toString() === userId.toString();
        const isTaskAdmin = task.taskAdmin && task.taskAdmin.toString() === userId.toString(); // Check taskAdmin

        if (!isAssigned && !isBoardAdmin && !isTaskAdmin) {
            return res.status(403).json({ message: "Access denied. You are not assigned, a task admin, or a board admin." });
        }

        next();
    } catch (error) {
        console.error("Error in isTaskMemberOrAdmin middleware:", error);
        res.status(500).json({ message: "Server error" });
    }
};