import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middlewares/error';
import sequelize from './db/db';
import userRoutes from './routes/user';
import productRoutes from './routes/product';

dotenv.config();

const app: Express = express();
const server = createServer(app);

const PORT = process.env.PORT || 5050;

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ limit: '100mb', extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome');
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);

app.use(notFound);
app.use(errorHandler);

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
