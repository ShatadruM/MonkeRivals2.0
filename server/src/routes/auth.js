import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { syncUser } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/sync
// Protected by verifyToken middleware
router.post('/sync', verifyToken, syncUser);

export default router;