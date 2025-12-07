import express from 'express';
import { getRandomContent } from '../controllers/contentController.js';

const router = express.Router();

// GET /api/content/random
router.get('/random', getRandomContent);

export default router;