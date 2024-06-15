import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const filePath = './data.json';

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

app.use('/api', itemRoutes(filePath));

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});