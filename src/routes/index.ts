import { Router } from 'express';
import noticesRouter from './notices.router';
import usersRouter from './users.router';

const baseRouter = Router();

baseRouter.use('/notices', noticesRouter);
baseRouter.use('/users', usersRouter);

export default baseRouter;
