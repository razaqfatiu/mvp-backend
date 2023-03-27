import { type Request, type Response, type NextFunction } from 'express';
import { jsonResponse } from '../helpers/api.util';
import {
  getDenominations,
  validateFindProd,
  validateNewProd,
  validatePutProd,
} from '../helpers/product.util';
import { type IProductInput } from '../interface/product';
import { UserRole } from '../interface/user';
import {
  createProduct,
  deleteProduct,
  findProduct,
  updateProduct,
} from '../models/dal/product.dal';
import { findUser, updateUser } from '../models/dal/user.dal';
import { type IUserModel } from '../models/user';

export const addNewProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.user;

    if (role !== UserRole.SELLER) {
      return jsonResponse({
        res,
        message: 'Forbidden, only sellers can upload a new product!',
        status: 403,
      });
    }

    const { error } = validateNewProd(req.body);
    if (error != null) {
      return jsonResponse({
        res,
        message: error?.message,
        status: 403,
      });
    }

    let { amountAvailable, productName, cost } = req.body;

    amountAvailable = parseInt(amountAvailable);
    cost = parseInt(cost);

    const product = await createProduct({
      amountAvailable,
      productName,
      cost,
      sellerId: req.user.id,
    });

    return jsonResponse({
      res,
      message: 'Added new product successfully!',
      status: 201,
      data: product.dataValues,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = validateFindProd(req.params);

    if (error != null) {
      return jsonResponse({
        res,
        message: error?.message || '',
        status: 403,
      });
    }

    const { id } = req.params;

    const prod: IProductInput | null = await findProduct({ id });

    if (prod == null) {
      return jsonResponse({
        res,
        message: 'Product Not Found!',
        status: 404,
      });
    }

    return jsonResponse({
      res,
      message: 'Found product with the id!',
      status: 200,
      data: prod?.dataValues,
    });
  } catch (error) {
    next(error);
  }
};

export const modifyProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = validatePutProd(req.body);

    if (error != null) {
      return jsonResponse({
        res,
        message: error?.message || '',
        status: 403,
      });
    }

    const { id } = req.params;

    const prod = await findProduct({ id });

    if (prod == null) {
      return jsonResponse({
        res,
        message: 'Product Not Found!',
        status: 404,
      });
    }

    if (prod && prod.sellerId !== req.user.id) {
      return jsonResponse({
        res,
        message: 'Forbidden! only sellers that created a product can modify',
        status: 403,
      });
    }

    let { amountAvailable, productName = undefined, cost } = req.body;

    amountAvailable = amountAvailable ? parseInt(amountAvailable) : undefined;
    cost = cost ? parseInt(cost) : undefined;

    const data: Partial<IProductInput> = {
      productName,
      amountAvailable,
      cost,
    };

    const update = await updateProduct({ ...data }, { id });

    return jsonResponse({
      res,
      message: 'Product update success',
      status: 200,
      data: update[1][0],
    });
  } catch (error) {
    next(error);
  }
};

export const removeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = validateFindProd(req.params);

    if (error != null) {
      return jsonResponse({
        res,
        message: error?.message || '',
        status: 403,
      });
    }

    const { id } = req.params;

    const prod = await findProduct({ id });

    if (prod == null) {
      return jsonResponse({
        res,
        message: 'Product Not Found!',
        status: 404,
      });
    }

    if (prod && prod.sellerId !== req.user.id) {
      return jsonResponse({
        res,
        message: 'Forbidden! only sellers that created a product can delete',
        status: 403,
      });
    }

    await deleteProduct({ id });
    return jsonResponse({
      res,
      message: 'Product deleted success',
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const buy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, role } = req.user;

    if (role !== UserRole.BUYER) {
      return jsonResponse({
        res,
        message: 'Forbidden, only buyers can buy a product',
        status: 403,
      });
    }

    const { error } = validateFindProd(req.params);

    if (error != null) {
      return jsonResponse({
        res,
        message: error?.message || '',
        status: 403,
      });
    }

    const product = await findProduct({ id: req.params.id });
    const user: IUserModel | null = await findUser({ id });

    if (product == null) {
      return jsonResponse({
        res,
        message: 'Product Not Found!',
        status: 404,
      });
    }

    if (user != null) {
      if (user?.deposit < product.cost) {
        return jsonResponse({
          res,
          message:
            'You do not have sufficient fund to complete this transaction',
          status: 404,
        });
      }

      const diff = user?.deposit - product.cost;
      const change: number[] | number =
        diff > 0 ? getDenominations(user?.deposit - product.cost) : 0;

      const userUpdate = await updateUser(
        {
          deposit: 0,
          totalSpent: user.totalSpent + product.cost,
        },
        { id }
      );

      const recentProduct = await updateProduct(
        {
          amountAvailable: product.amountAvailable - 1,
        },
        {
          id: req.params.id,
        }
      );

      return jsonResponse({
        res,
        message: 'Transaction Completed',
        status: 200,
        data: {
          totalSpent: userUpdate[1][0].totalSpent,
          product: recentProduct[1][0],
          change,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
