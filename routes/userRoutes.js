import { Router } from 'express';
import { signup, login, verifyOTP, getDashboardData } from '../controllers/userController.js';

const userRouter = Router()

userRouter
    .post('/signup', signup)
    .post('/login', login)
    .post('/verifyOTP', verifyOTP)
    .get('/dashboard', getDashboardData);

// Edit User
// userRouter.put('/:id', editUser);

export default userRouter;
