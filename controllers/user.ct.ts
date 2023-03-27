import { type Request, type Response, type NextFunction } from 'express';
import { jsonResponse } from '../helpers/api.util';
import {
  comparePassword,
  hashPassword,
  signToken,
  validateDeposit,
  validateUpdateUser,
  validateUser,
  verifyToken,
} from '../helpers/user.util';
import { type IUserInput, UserRole } from '../interface/user';
import {
  createUser,
  deleteUser,
  findUser,
  updateUser,
} from '../models/dal/user.dal';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
        username: string;
      };
    }
  }
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = validateUser(req.body);

    if (error != null) {
      return jsonResponse({
        res,
        message: error?.message || '',
        status: 403,
      });
    }

    const { username, role } = req.body;
    let { password } = req.body;

    const userExists = await findUser({ username });

    if (userExists != null) {
      return jsonResponse({
        res,
        message: 'User Exists, kindly choose another username',
        status: 400,
      });
    }

    password = await hashPassword(password);

    const user = await createUser({
      username,
      password,
      role,
      deposit: 0,
      totalSpent: 0,
    });

    return jsonResponse({
      res,
      message: 'User created successfully',
      status: 201,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const userExists = await findUser({ username }, true);

    if (userExists == null) {
      return jsonResponse({ res, message: 'User not found', status: 404 });
    }

    const isMatch = await comparePassword(password, userExists.password);

    if (!isMatch) {
      return jsonResponse({
        res,
        message: 'Invalid Username or Password',
        status: 401,
      });
    }

    const { access } = req.cookies;

    if (access) {
      const ver: any = verifyToken({ token: access });
      if (ver?.username === username) {
        return jsonResponse({
          res,
          message: 'This user is previously signed in',
          status: 200,
        });
      }
    }

    const token: string = signToken({
      id: userExists?.id,
      role: userExists?.role,
      username,
    });

    res.cookie('access', token, { httpOnly: true });

    return jsonResponse({ res, message: 'Signin Successful', status: 200 });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('access');
    return jsonResponse({
      res,
      message: 'Logged out successfully',
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, role } = req.body;
    let { password } = req.body;

    const { error } = validateUpdateUser(req.body);

    if (error != null) {
      return jsonResponse({
        res,
        message: error?.message || '',
        status: 403,
      });
    }

    const { id } = req.user;
    const userExists = await findUser({ username });

    if (userExists != null && userExists.username !== req.user.username) {
      return jsonResponse({
        res,
        message: 'The specified username is taken',
        status: 404,
      });
    }

    password = password ? await hashPassword(password) : undefined;

    const data: Partial<IUserInput> = {
      username: username || undefined,
      role: role || undefined,
      password,
    };

    const isAllEmpty: boolean = Object.values(data).every((x) => !x);

    if (isAllEmpty) {
      return jsonResponse({
        res,
        message: 'Nothing to update',
        status: 200,
      });
    }

    await updateUser(data, { id });

    return jsonResponse({
      res,
      message: 'Update successful',
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    await deleteUser({ id });

    res.clearCookie('access');

    return jsonResponse({
      res,
      message: 'User deleted successfully',
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const deposit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.role === UserRole.SELLER) {
      return jsonResponse({
        res,
        message: 'Only buyers can deposit',
        status: 403,
      });
    }
    const { error } = validateDeposit(req.body);

    if (error != null) {
      return jsonResponse({
        res,
        message: error?.message || '',
        status: 403,
      });
    }

    const { deposit } = req.body;
    const { id } = req.user;

    const user = await findUser({ id });

    const update = await updateUser(
      { deposit: user?.deposit + deposit },
      { id }
    );

    return jsonResponse({
      res,
      message: 'Deposit successful',
      status: 200,
      data: {
        balance: `$${update[1][0].deposit}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const reset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.role !== UserRole.BUYER) {
      return jsonResponse({
        res,
        message: 'Only buyers can reset their balance',
        status: 400,
      });
    }

    const { id } = req.user;

    const update = await updateUser({ deposit: 0 }, { id });

    return jsonResponse({
      res,
      message: 'Deposit successfully reset!',
      status: 200,
      data: {
        balance: `$${update[1][0].deposit}`,
      },
    });
  } catch (error) {
    next(error);
  }
};
