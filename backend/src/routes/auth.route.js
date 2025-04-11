import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateAccountDetails,
  changePassword,
  deleteAccount,
} from '../controllers/auth.controller.js';
import {verifyJWT} from '../middleware/auth.middleware.js';

const app = express.Router();

app.post('/register', registerUser); 
            
app.post('/login', loginUser);       
           
app.post('/refresh', refreshAccessToken);    
   
app.post('/logout', verifyJWT, logoutUser);  
                
app.patch('/change-password', verifyJWT, changePassword); 

app.patch('/update', verifyJWT, updateAccountDetails);

app.delete('/delete-account', verifyJWT, deleteAccount);

export default app;
