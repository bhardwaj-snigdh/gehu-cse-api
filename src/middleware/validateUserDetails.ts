import type { Handler } from 'express';
import { z } from 'zod';

const loginDetailsValidator = z
  .object({
    email: z
      .string({ description: 'Email must be in a form of string' })
      .email('Invalid email passed while login'),
    password: z
      .string({ description: 'Password must be passed as string' })
      .min(1, 'Empty password while login'),
  })
  .strict({
    message: 'Additional fields passed while login',
  });

export const registerDetailsValidator = z
  .object({
    email: z
      .string({ description: 'Email must be in a form of string' })
      .email('Invalid email passed while registering'),
    name: z
      .string({ description: 'Name must be in a form of string' })
      .min(1, 'Empty name field while register'),
    phone: z
      .string({ description: 'Phone must be in a form of string' })
      .min(10, 'Phone number must have atleast 10 digits'),
    password: z
      .string({ description: 'Password must be in a form of string' })
      .min(1, 'Empty password field while registering'),
  })
  .strip();

const validateUserDetails = (type: 'login' | 'register'): Handler => {
  return (req, res, next) => {
    try {
      if (type == 'login') {
        loginDetailsValidator.parse(req.body);
      } else {
        registerDetailsValidator.parse(req.body);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateUserDetails;
