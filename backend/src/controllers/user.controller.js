import { User } from '../models/user.model.js';

/**
* @desc Get all users
* @route GET /api/v1/users
* @access Public
*/

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};


/**
* @desc Search users by name or email
* @route GET /api/v1/users/search?query=john
* @access Public
*/

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ]
        }).select('name email');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
};


/**
* @desc Get a user by ID
* @route GET /api/v1/users/:userId
* @access Public
*/

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user', error: error.message });
    }
};


/**
* @desc Update user role (Admin only)
* @route PATCH /api/v1/users/:userId/role
* @access Private (Admin only)
*/

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'Role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update role', error: error.message });
    }
};


/**
* @desc current user details
* @route GET /api/v1/users/me
*/


export const getMe = async (req, res) => {
        try {
            res.status(200).json({ user : req.user });
        } catch (error) {
            res.status(500).json({ message: "Server Error", error: error.message });
        }
};