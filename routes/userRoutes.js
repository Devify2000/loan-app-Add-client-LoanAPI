import { Router } from 'express';
import { signup, login, verifyOTP } from '../controllers/userController.js';

const userRouter = Router()

userRouter
    .post('/signup', signup)
    .post('/login', login)
    .post('/verifyOTP', verifyOTP)

// Edit User
// userRouter.put('/:id', editUser);

export default userRouter;
