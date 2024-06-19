import express from 'express';
import {promises as fs} from 'fs';

const router = express.Router();
const filePath = './data-v2.json'; // Assuming a different data file for v2

router.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const items = JSON.parse(data);
    res.json(items);
  });
});

export default router;
