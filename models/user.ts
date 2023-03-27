import {
  Model,
  Table,
  PrimaryKey,
  Column,
  AllowNull,
  NotEmpty,
  DataType,
  Default,
  Unique,
  HasMany
} from 'sequelize-typescript'
import { UserRole } from '../interface/user'
import Product from './product'

export interface IUserModel {
  id?: string
  username: string
  password: string
  role: UserRole
  deposit: number
  totalSpent: number
}

@Table({
  tableName: 'user',
  timestamps: true
})

export default class User extends Model implements IUserModel {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
    id!: string

  @AllowNull(false)
  @NotEmpty
  @Unique(true)
  @Column
    username!: string

  @AllowNull(false)
  @NotEmpty
  @Column
    password!: string

  @AllowNull(false)
  @NotEmpty
  @Column
    role!: UserRole

  @AllowNull(false)
  @Column
    deposit!: number

  @AllowNull(false)
  @Column
    totalSpent!: number

  @HasMany(() => Product)
    product!: Product[]
}
