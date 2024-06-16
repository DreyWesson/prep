import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { homeRouter } from './routes/home.route.js';
import { itemRouter } from './routes/item.route.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', homeRouter());
app.use('/api/v1/', itemRouter());

export default app;

// create server
// setup env variables
// setup midleware
// setup routes and swagger docs
// setup error handlers
// export app