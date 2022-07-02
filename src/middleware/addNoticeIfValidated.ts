import { Role } from '@prisma/client';
import type { Handler } from 'express';
import { z } from 'zod';
import { HttpException } from '../utils';

export const noticeValidator = z
  .object({
    title: z
      .string({ description: 'Notice title must be string' })
      .min(1, 'Notice title cannot be empty'),
    body: z
      .string({ description: 'Notice body must be string' })
      .min(1, 'Notice body cannot be empty'),
    audience: z
      .string({ description: 'Audience type must be a list of roles.' })
      .array()
      .refine(
        (audience): boolean => {
          return audience.every((role) => role in Role);
        },
        {
          message: `Invalid audience type. Audience type can only be ${Role}`,
        }
      ),
  })
  .strip();

const addNoticeIfValidated: Handler = (req, res, next) => {
  try {
    const notice = noticeValidator.parse(req.body);

    // @ts-ignore: zod refine is validating for Role type array
    req.notice = notice;
    next();
  } catch (err) {
    next(new HttpException(400, (err as Error).message));
  }
};

export default addNoticeIfValidated;
