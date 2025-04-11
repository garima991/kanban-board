import express from 'express';
import { globalSearch } from '../controllers/search.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const app = express.Router();

app.get('/', verifyJWT, globalSearch); 

export default app;
