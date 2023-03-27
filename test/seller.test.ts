import request from 'supertest';
import server from '..';

import sequelize from '../db/db';
import { IProductInput } from '../interface/product';
import { IUserInput, UserRole } from '../interface/user';
import { findUser } from '../models/dal/user.dal';

export const mockSeller: Partial<IUserInput> = {
  username: 'test_seller',
  password: 'test',
  role: UserRole.SELLER,
};

const mockProduct: Partial<IProductInput> = {
  amountAvailable: 100,
  productName: 'Test-mock-product',
  cost: 20,
};

describe('Seller', () => {
  let token: string;
  let productId: string;

  beforeAll(async () => {
    await sequelize.sync();

    await request(server).post('/api/v1/user').send(mockSeller);

    await findUser({ username: mockSeller.username });

    const response = await request(server)
      .post('/api/v1/user/login')
      .send(mockSeller);

    token = response.header['set-cookie'][0].split(';')[0].split('=')[1];
  });

  it('Seller can upload new product', async () => {
    const response = await request(server)
      .post('/api/v1/product')
      .set('Cookie', `access=${token}`)
      .send(mockProduct);

    productId = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Added new product successfully!');
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toEqual(expect.objectContaining(mockProduct));
  });

  it('Get product', async () => {
    // const product = await findProduct()
    const response = await request(server)
      .get(`/api/v1/product/${productId}`)
      .set('Cookie', `access=${token}`);
    // .send({ productName: 'Update-Test-Product-Name' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Found product with the id!');
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toEqual(expect.objectContaining(mockProduct));
  });

  it('Seller can update product', async () => {
    const newProdName: string = 'Update-Test-Product-Name';
    const response = await request(server)
      .put(`/api/v1/product/${productId}`)
      .set('Cookie', `access=${token}`)
      .send({ productName: newProdName });

    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Product update success');
  });

  it('Product update fail with wrong product id', async () => {
    const newProdName: string = 'Update-Test-Product-Name';
    const response = await request(server)
      .put(`/api/v1/product/${1}`)
      .set('Cookie', `access=${token}`)
      .send({ productName: newProdName });

    expect(response.status).toBe(404);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Product Not Found!');
  });

  it('Delete Product', async () => {
    const prod = await request(server)
      .post('/api/v1/product')
      .set('Cookie', `access=${token}`)
      .send(mockProduct);

    const response = await request(server)
      .delete(`/api/v1/product/${prod.body.data.id}`)
      .set('Cookie', `access=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toBe('Product deleted success');
  });


});
