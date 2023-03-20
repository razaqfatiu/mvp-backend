import express, { Express, Request, Response } from "express";
import {createServer} from 'http'

import dotenv from 'dotenv';

dotenv.config();

const app: Express = express()
const server = createServer(app)

const PORT = process.env.PORT || 5050

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome')
})


server.listen(PORT, () => {
    console.log('Server listening on localhost:', PORT);
})