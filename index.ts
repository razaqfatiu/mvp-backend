import express, { type Express, type Request, type Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middlewares/error';
import userRoutes from './routes/user';
import productRoutes from './routes/product';

import { createServer } from 'http';
import sequelize from './db/db';

import dotenv from 'dotenv';

dotenv.config();

export const app: Express = express();

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ limit: '100mb', extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome, use either: /api/v1/user OR /api/v1/product');
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);

app.use(notFound);
app.use(errorHandler);

const server = createServer(app);

const PORT = process.env.PORT ?? 5050;

const start = async (): Promise<void> => {
  try {
    await sequelize.sync();
    console.log('Connected to DB');

    server.listen(PORT, () => {
      console.log('Server listening on localhost:', PORT);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();

export default server;
