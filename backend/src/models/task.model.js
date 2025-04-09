import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
});

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
    color:{
        type : String,
        required : true,
    },
    subtasks : [SubtaskSchema],
    comments : [{
        content : {
            type: String,
            required: true,
        },
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt : {
            type: Date,
            default: Date.now,
        },
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
    taskAdmin: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }

}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);