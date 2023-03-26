import Joi, { ValidationResult } from 'joi';
import { denomination } from '.';
import { IUserInput, UserRole } from '../interface/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import { genSalt, hash, compare } from 'bcrypt';

const secret: string = process.env.JWT_SECRET || '';

export const hashPassword = async (password: string): Promise<string> => {
  const salt: string = await genSalt(10);
  return await hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await compare(password, hash);
};

export const signToken = ({
  id,
  role,
  username,
}: Partial<IUserInput>): string => jwt.sign({ id, role, username }, secret);

export const verifyToken = ({ token }: { token: string; }): JwtPayload | string =>
  jwt.verify(token, secret);

export const validateUser = (
  body: Partial<IUserInput>
): ValidationResult<IUserInput> => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string()
      .required()
      .valid(UserRole.BUYER, UserRole.SELLER)
      .messages({
        'any.only': 'role should be of type: buyer/seller only',
        'string.required': 'role is required',
      }),
  });
  return schema.validate(body);
};

export const validateUpdateUser = (
  body: Partial<IUserInput>
): ValidationResult<IUserInput> => {
  const schema = Joi.object({
    username: Joi.string(),
    password: Joi.string(),
    role: Joi.string().valid(UserRole.BUYER, UserRole.SELLER).messages({
      'any.only': 'role should be of type: buyer/seller only',
      'string.required': 'role is required',
    }),
  });
  return schema.validate(body);
};

export const validateDeposit = (
  body: Partial<IUserInput>
): ValidationResult<Partial<IUserInput>> => {
  const schema = Joi.object({
    deposit: Joi.number()
      .valid(...denomination)
      .required()
      .multiple(5)
      .messages({
        'number.required': 'Deposit is required',
        'number.min': 'Deposit can be a minimum of 5 ',
        'number.max': 'Deposit can be a maximum of 100',
        'any.only': `Deposit can only be within the denomination: ${denomination}`,
        'number.multiple': `Deposit should be a mulptiple of 5`,
      }),
  });
  return schema.validate(body);
};
