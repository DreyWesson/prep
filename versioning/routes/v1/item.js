import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();
const filePath = './data.json';

router.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const items = JSON.parse(data);
    res.json(items);
  });
});

router.post('/', (req, res) => {
  const newItem = req.body;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const items = JSON.parse(data);
    items.push(newItem);
    fs.writeFile(filePath, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save data' });
      }
      res.status(201).json(newItem);
    });
  });
});

// Add more routes (PUT, DELETE) as needed

export default router;
