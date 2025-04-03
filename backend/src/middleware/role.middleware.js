import {Board} from '../models/board.model.js'

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



