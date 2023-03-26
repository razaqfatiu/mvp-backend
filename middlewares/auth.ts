import { Request, Response, NextFunction } from 'express';
import { jsonResponse } from '../helpers/api.util';
import { verifyToken } from '../helpers/user.util';

interface RequestWithUser extends Request {
  user: any;
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { access } = req.cookies;
    if (!access) {
      return jsonResponse({ res, message: 'UnAuthorized', status: 401 });
    }
    const verified = verifyToken({ token: access });
    req.user = verified;
    next();
  } catch (error) {
    next(error);
  }
};
