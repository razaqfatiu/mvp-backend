import express, { Express, Router } from 'express';
import {
  addNewProduct,
  buy,
  getProduct,
  modifyProduct,
  removeProduct,
} from '../controllers/product.ct';

import { authMiddleware } from '../middlewares/auth';

const productRoutes: Router = express.Router();

productRoutes.post('/', authMiddleware, addNewProduct);
productRoutes.get('/:id', authMiddleware, getProduct);
productRoutes.put('/:id', authMiddleware, modifyProduct);
productRoutes.delete('/:id', authMiddleware, removeProduct);
productRoutes.post('/:id/buy', authMiddleware, buy);

export default productRoutes;
