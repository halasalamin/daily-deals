import express from 'express';
import { loginUser, registerUser, socialLogin, getMe, updateProfile } from '../controllers/userController.js';
import authorize from '../middleware/authorize.js';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { uploadProfilePhoto } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/auth/social', socialLogin);
userRouter.get('/me', authUser, getMe);
userRouter.post('/upload-photo', authUser, upload.single('profilePhoto'), uploadProfilePhoto);
userRouter.put('/update-profile', authUser, updateProfile);


export default userRouter;