import sequelize from '../../db/db';
import {
  type IProductInput,
  type IProductSearchParam,
} from '../../interface/product';
import Product from '../product';
import User from '../user';

export const findProduct = async (param: IProductSearchParam) => {
  try {
    return await sequelize.transaction(
      async (transaction) =>
        await Product.findOne({
          where: { ...param },
          include: {
            model: User,
            attributes: ['username', 'id'],
          },
          transaction,
        })
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error('Something went wrong');
  }
};

export const findManyProducts = async (param: IProductSearchParam) => {
  try {
    return await sequelize.transaction(
      async (transaction) =>
        await Product.findAll({
          where: { ...param },
          include: {
            model: User,
            attributes: ['username', 'id'],
          },
          transaction,
        })
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error('Something went wrong');
  }
};

export const updateProduct = async (
  data: Partial<IProductInput>,
  param: IProductSearchParam
) => {
  try {
    return await sequelize.transaction(
      async (transaction) =>
        await Product.update(
          { ...data },
          {
            where: { ...param },
            returning: true,
            transaction,
          }
        )
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error('Something went wrong');
  }
};

export const deleteProduct = async (param: IProductSearchParam) => {
  try {
    return await sequelize.transaction(
      async (transaction) =>
        await Product.destroy({
          where: { ...param },
          transaction,
        })
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error('Something went wrong');
  }
};

export const createProduct = async (param: IProductInput) => {
  try {
    return await sequelize.transaction(async (transaction) => {
      const product = await Product.create({ ...param, transaction });
      return product;
    });
  } catch (error) {
    console.log((error as Error).message, error);
    throw new Error('Create Product failed');
  }
};
