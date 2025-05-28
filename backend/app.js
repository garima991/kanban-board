import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173', // frontend origin
    credentials: true
  }));
app.use(express.json({limit : '16kb'}));
app.use(express.urlencoded({extended: true, limit : '16kb'}));
app.use(cookieParser());


// Routes
import authRoute from './src/routes/auth.route.js';
import userRoute from './src/routes/user.route.js';
import boardRoute from './src/routes/board.route.js';
import taskRoute from './src/routes/task.route.js';
import searchRoute from './src/routes/search.route.js';

app.get('/api/v1', (req, res) => {
    res.send( 'Welcome to the Kanban Board API' );
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/boards', taskRoute);
app.use('/api/v1/boards', boardRoute);
app.use('/api/v1/search', searchRoute);

export default app;







