import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    admin : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members : [{
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        role : {
            type: String,
            enum: ['admin', 'member'],
            default: 'member',
        },
    }],
    color : {
        type : String,
        required : true,
    },
    columns : {
        type: [{
            name: {
                type: String,
                enum: ["To-Do", "On Progress", "In Review", "Completed"],
                required: true,
            },
            tasks: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Task",
                },
            ],
        },
    ],
    default: [
        { name: "To-Do", tasks: [] },
        { name: "On Progress", tasks: [] },
        { name: "In Review", tasks: [] },
        { name: "Completed", tasks: [] },
    ]},

}, {timestamps: true});


export const Board = mongoose.model('Board', boardSchema);

    // members field is added so that there could be multiple members in a board
    // and each member can have different roles (admin/member) in a board

    // else the user field would be enough to identify the user in the board
   