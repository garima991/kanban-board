import {User} from '../models/user.model.js';
import {Board} from '../models/board.model.js';
import {Task} from '../models/task.model.js';

export const globalSearch = async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const regex = new RegExp(query, 'i'); // case-insensitive match

        const [users, boards, tasks] = await Promise.all([
            User.find({ $or: [{ name: regex }, { email: regex }] }).select('name email'),
            Board.find({ name: regex }).select('name'),
            Task.find({ $or: [{ title: regex }, { description: regex }] }).select('title description'),
        ]);

        res.status(200).json({
            users,
            boards,
            tasks,
        });
    } 
    catch (error) {
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
};
