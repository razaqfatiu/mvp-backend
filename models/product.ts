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
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { IProductModel } from '../interface/product';
import User from './user';

@Table({
  tableName: 'product',
  timestamps: true,
})
export default class Product extends Model implements IProductModel {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  amountAvailable!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  productName!: string;

  @AllowNull(false)
  @NotEmpty
  @Column
  cost!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  @ForeignKey(() => User)
  sellerId!: string;

  @BelongsTo(() => User)
  seller!: User;
}
