import express from 'express';
import passport from 'passport';
import logger from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import router from './routes';
import { errorHandlerMiddleware } from './middleware';
import configureJwtStrategy from './config/passport';

const PORT = process.env.PORT ?? 3000;

/**
 * Extending request interface to add notice property
 */
import type { Notice } from '@prisma/client';
declare module 'express-serve-static-core' {
  interface Request {
    notice?: Partial<Notice> & Pick<Notice, 'body' | 'audience'>;
  }
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger('dev'));

/**
 * Initialize and configure passport, using JWT for authentication
 */
app.use(passport.initialize());
configureJwtStrategy(passport);

/**
 * App routers and Error handling middleware
 */
app.use(router);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
