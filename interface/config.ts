import { type Dialect } from 'sequelize'

interface IDbParams {
  username: string
  password: string
  database: string
  host: string
  port: number
  dialect: Dialect
  logging: boolean
}

export interface IConfigParams {
  development: IDbParams
  test: IDbParams
  production: IDbParams
}
