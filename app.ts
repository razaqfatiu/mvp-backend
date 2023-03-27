// import { createServer } from 'http';
// import sequelize from './db/db';

// import dotenv from 'dotenv';
// import app from '.';

// dotenv.config();

// const server = createServer(app);

// const env: string = process.env.NODE_ENV || 'development';

// const PORT = env === 'test' ? process.env.TEST_PORT : process.env.PORT || 5050;

// const start = async (): Promise<void> => {
//   try {
//     await sequelize.sync();
//     console.log('Connected to DB');

//     server.listen(PORT, () => {
//       console.log('Server listening on localhost:', PORT);
//     });
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// void start();
// export default server;
