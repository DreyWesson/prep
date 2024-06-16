import express from 'express';
import { getItem } from '../controller/item.controller.js';

export function itemRouter() {
    const router = express.Router();

    router.get('/items', (req, res) => getItem(req, res));

    return router;
}