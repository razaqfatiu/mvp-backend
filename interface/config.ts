import { Dialect } from 'sequelize';

interface IDbParams {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
}

export interface IConfigParams {
  development: IDbParams;
  test: IDbParams;
  production: IDbParams;
}
