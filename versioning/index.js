
// /project-root
// ├── /routes
// │   ├── /v1
// │   │   ├── items.routes.js
// │   │   └── users.routes.js
// │   ├── /v2
// │   │   └── items.routes.js
// │   └── index.js
// ├── .env
// ├── index.js
// └── package.json

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Mount versioned routes
app.use('/api/v1', routes.v1);
app.use('/dev/v1', routes.dev);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
