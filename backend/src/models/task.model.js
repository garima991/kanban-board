import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, 'Task title is required'],
    },
    dueDate : {
        type: Date,
        required : true,
    },
    status : {
        type: String,
        enum : ['Todo', 'On Progress', 'In Review', 'Done'],
        default : 'Todo',
    },
    priority : {
        type: String,
        enum : ['Low', 'Medium', 'High'],
        default : 'Low',
        required : true,
    },
    tags : [{
        type: String,
    }],
    description : {
        type: String
    },
    subtasks : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Subtask",
        required: false,
    }],
    comments : [{
        text : {
            type: String,
            required: true,
        },
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt : {
            type: Date,
            default: Date.now,
        },
        required: false,
    }],
    boardId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    assignedTo : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    }],

}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);