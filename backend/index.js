// require('dotenv').config({path : "./env"});
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import app from './app.js'


dotenv.config();

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    })
})
.catch( (error) => {
    console.error("MongoDB connection failed", error);
})











// can connect the db here using IIFE
/*
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
           app.on("error", (error) => {
           console.log("error connecting tot databse", error);
           throw error;

        app.listen(process.env.PORT, () => {
            console.log("listening on port " + process.env.PORT);
        })
});
    }
    catch{
        console.error("Failed to connect to Databse");
        throw err;
    }
})

*/











