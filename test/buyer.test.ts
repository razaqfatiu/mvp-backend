import sequelize from '../db/db';
import request from 'supertest';
import server from '..';
import { IUserInput, UserRole } from '../interface/user';
import { createUser, findUser, updateUser } from '../models/dal/user.dal';
import { IProductInput, IProductModel } from '../interface/product';
import { createProduct } from '../models/dal/product.dal';
import { getDenominations } from '../helpers/product.util';
import { mockSeller } from './seller.test';

export const mockBuyer: Partial<IUserInput> = {
  username: 'test_buyer',
  password: 'test',
  role: UserRole.BUYER,
};

describe('Buyer', () => {
  let token: string;
  let prod: IProductInput;

  beforeAll(async () => {
    await sequelize.sync();

    await request(server).post('/api/v1/user').send(mockBuyer);

    await findUser({ username: mockBuyer.username });
    let seller: Partial<IProductModel>;
    const findSeller = await findUser({ username: mockSeller.username });

    if (findSeller) {
      seller = findSeller;
    } else {
      seller = await createUser({
        username: 'test_seller' + new Date(),
        password: 'test',
        role: UserRole.SELLER,
        deposit: 0,
        totalSpent: 0,
      });
    }

    prod = await createProduct({
      sellerId: seller.id || '',
      amountAvailable: 100,
      productName: 'Test-mock-product',
      cost: 20,
    });

    const response = await request(server)
      .post('/api/v1/user/login')
      .send(mockBuyer);

    token = response.header['set-cookie'][0].split(';')[0].split('=')[1];
  });

  it('Buyer can deposit', async () => {
    const response = await request(server)
      .post('/api/v1/user/deposit')
      .set('Cookie', `access=${token}`)
      .send({ deposit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.balance).toBeDefined();
    expect(response.body.message).toBe('Deposit successful');
  });

  it('Insufficient fund', async () => {
    await updateUser({ deposit: 0 }, { username: mockBuyer.username });

    const response = await request(server)
      .post(`/api/v1/product/${prod.id}/buy`)
      .set('Cookie', `access=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe(
      'You do not have sufficient fund to complete this transaction'
    );
  });

  it('Buyer purchase product', async () => {
    const user = await updateUser(
      { deposit: 100 },
      { username: mockBuyer.username }
    );

    const response = await request(server)
      .post(`/api/v1/product/${prod.id}/buy`)
      .set('Cookie', `access=${token}`);

    const data = user[1][0].dataValues;

    const diff: number = user[1][0]?.deposit - prod.cost;

    const change: number[] | number = diff > 0 ? getDenominations(diff) : 0;

    const res = {
      totalSpent: data.totalSpent + prod.cost,
      product: {
        id: prod.id,
        productName: prod.productName,
        cost: prod.cost,
        amountAvailable: prod.amountAvailable - 1,
      },
      change,
    };
    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe('Transaction Completed');
    expect(response.body.data.totalSpent).toBe(res.totalSpent);
    expect(response.body.data.change).toStrictEqual(res.change);
    expect(response.body.data.product).toEqual(
      expect.objectContaining(res.product)
    );
  });
});
