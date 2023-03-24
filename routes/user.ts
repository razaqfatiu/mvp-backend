import express, { Router } from 'express';
import {
  deleteProfile,
  deposit,
  login,
  reset,
  signup,
  updateProfile,
} from '../controllers/user.ct';
import { authMiddleware } from '../middlewares/auth';

const userRoutes: Router = express.Router();

userRoutes.post('/', signup);
userRoutes.post('/login', login);
userRoutes.patch('/profile', authMiddleware, updateProfile);
userRoutes.delete('/profile', authMiddleware, deleteProfile);
userRoutes.post('/deposit', authMiddleware, deposit);
userRoutes.post('/reset', authMiddleware, reset);

export default userRoutes;
