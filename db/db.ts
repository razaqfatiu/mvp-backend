import { Sequelize } from 'sequelize-typescript';
import config from '../config/config';
import dotenv from 'dotenv';
import User from '../models/user';
import Product from '../models/product';

dotenv.config();

const env: string = process.env.NODE_ENV || 'development';

const db = config[env as keyof typeof config];

const { database, username, password, host, dialect, port } = db;

const sequelize = new Sequelize({
  database,
  dialect,
  username,
  password,
  host,
  port,
  models: [User, Product],
});

export default sequelize;
