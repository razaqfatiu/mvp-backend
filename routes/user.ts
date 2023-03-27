import express, { type Router } from 'express';
import {
  deleteProfile,
  deposit,
  login,
  logout,
  reset,
  signup,
  updateProfile,
} from '../controllers/user.ct';
import { authMiddleware } from '../middlewares/auth';

const userRoutes: Router = express.Router();

userRoutes.post('/', signup);
userRoutes.post('/login', login);
userRoutes.post('/logout', authMiddleware, logout);
userRoutes.patch('/profile', authMiddleware, updateProfile);
userRoutes.delete('/profile', authMiddleware, deleteProfile);
userRoutes.post('/deposit', authMiddleware, deposit);
userRoutes.post('/reset', authMiddleware, reset);

export default userRoutes;
