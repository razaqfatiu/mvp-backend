import sequelize from '../../db/db';
import { IUserInput, IUserSearchParam } from '../../interface/user';
import User, { IUserModel } from '../user';

export const findUser = async (
  param: IUserSearchParam,
  pv: boolean = false
): Promise<IUserModel | null> => {
  try {
    return await sequelize.transaction(
      async (transaction) =>
        await User.findOne({
          where: { ...param },
          attributes: { exclude: pv ? [''] : ['password', 'updatedAt'] },
          transaction,
        })
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error('Something went wrong');
  }
};

export const updateUser = async (
  data: Partial<IUserInput>,
  param: IUserSearchParam
) => {
  try {
    return await sequelize.transaction(
      async (transaction) =>
        await User.update(
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

export const deleteUser = async (param: IUserSearchParam) => {
  try {
    return await sequelize.transaction(
      async (transaction) =>
        await User.destroy({
          where: { ...param },
          transaction,
        })
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error('Something went wrong');
  }
};

export const createUser = async (param: IUserInput) => {
  try {
    return await sequelize.transaction(async (transaction) => {
      const user = User.build({ ...param, transaction });
      return await user.save();
    });
  } catch (error) {
    console.log((error as Error).message);
    throw new Error('Create user failed');
  }
};
