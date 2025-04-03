import express from 'express';
import {Board} from '../models/board.model.js';
import {User} from '../models/user.model.js';

/*
@desc create a new board (admin)
@route POST /api/v1/boards
@access Private (Authenticated ones)
*/

export const createBoard = async (req, res) => {
    try {
        const {name , color } = req.body;
        const adminId = req.user._id;   // get user id to set the admin
        if(!name){
            return res.status(400).json({msg: 'Please include a name for the board'});
        }
        if(!color){
            return res.status(400).json({msg: 'Please include a color for the board'});
        }

        // create a new board with admin as the only member and admin role
        const board = await Board.create({
            name, 
            color,
            admin: adminId,
            members: [{user: adminId, role: 'admin'}]
        });
 
        res.status(201).json({message: 'Board created successfully', board});
    }
    catch (error){
        res.status(500).json({error: error.message});
    }
}


/*
@desc get boards (boards, user is part of)
@route GET /api/v1/boards
@access Private (Authenticated ones)
*/

export const getBoards = async (req, res) => {
    try {
        const userId = req.user._id; // extract user id from middleware
        // console.log('Getting boards for user:', userId);
        const boards = await Board.find({'members.user' : userId}) // double quotes are used when the key contains special chars

        res.status(200).json({message: 'Boards fetched successfully', boards});
    }
    catch(error){
        res.status(404).json({error: error.message});
    }
}



/*
@desc get a specific board (admin or member)
@route GET /api/v1/GET/boards/:boardId
@access Private (Authenticated ones)
*/

export const getBoardById = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const board = await Board.findById(boardId);  
        res.status(200).json({message: 'Board fetched successfully', board});
    }
    catch (error){
        res.status(404).json({error: error.message});
    }
}



/*
@desc update a board (admin only)
@route PATCH /api/v1/boards/:boardId
@access Private (Authenticated ones)
*/

export const updateBoard = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const {name, color} = req.body;

        const board = await Board.findOneAndUpdate({ _id: boardId },{name, color}, {new: true});

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }


        res.status(200).json({message: 'Board updated successfully', board});
    }
    catch (error){
        res.status(500).json({error: error.message});
    }
}



/*
@desc delete a board (admin only)
@route DELETE /api/v1/boards/:boardId
@access Private (Authenticated ones)
*/

export const deleteBoard = async (req, res) => {
    try {
        const boardId = req.params.boardId;

        const board = await Board.findOneAndDelete({_id: boardId});

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        res.status(200).json({ message: 'Board deleted successfully', board });
    }
    catch (error){
        res.status(500).json({error: error.message});
    }
}

/*
@desc add a member to a board (admin only)
@route POST /api/v1/boards/:boardId/members
@access Private (Authenticated ones)
*/

export const addMember = async ( req, res) => {
    try {
        const boardId = req.params.boardId;
        const {userId, role} = req.body;

        const board = await Board.findOneAndUpdate({_id: boardId}, {$push: {members: {user: userId, role}}}, {new: true});
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        res.status(200).json({message: 'Member added successfully', board});
    }
    catch (error){
        res.status(500).json({error: error.message});
    }
}

/*
@desc remove a member from a board (admin only)
@route DELETE /api/v1/boards/:boardId/members/:userId
@access Private (Authenticated ones)
*/

export const removeMember = async(req, res) => {
    try {
        const boardId = req.params.boardId;
        const userId = req.params.userId;

        const board = await Board.findOneAndUpdate({_id: boardId}, {$pull: {members: {user: userId}}}, {new: true});

        if(!board) {
            return res.status(404).json({ message: 'Board not found' });    
        }
        res.status(200).json({message: 'Member removed successfully', board});
    }
    catch (error){
        res.status(500).json({error: error.message});
    }
}