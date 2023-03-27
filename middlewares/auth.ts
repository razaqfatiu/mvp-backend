import { type Request, type Response, type NextFunction } from 'express';
import { jsonResponse } from '../helpers/api.util';
import { verifyToken } from '../helpers/user.util';

interface RequestWithUser extends Request {
  user: any
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const access: string | undefined = req.cookies.access;
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
