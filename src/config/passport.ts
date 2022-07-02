import type { PassportStatic } from 'passport';
import {
  ExtractJwt,
  Strategy as JWTStragegy,
  type StrategyOptions,
  type VerifyCallbackWithRequest,
} from 'passport-jwt';
import prisma from './database';
import { constants } from '../utils';

const strategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: ['RS256'],
  secretOrKey: constants.PUBLIC_KEY,
  passReqToCallback: true,
  jsonWebTokenOptions: {
    maxAge: '30d',
  },
};

const verifyCallback: VerifyCallbackWithRequest = async (
  req,
  payload,
  done
) => {
  try {
    const userId = payload.sub;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return done(null, false, { message: 'User not found.' });
    }

    req.user = user;
    done(null, user);
  } catch (err) {
    done(err);
  }
};

export default (passport: PassportStatic) => {
  passport.use(new JWTStragegy(strategyOptions, verifyCallback));
};
