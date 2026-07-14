import express from 'express';
import { getWallet, updateThreshold } from '../controllers/walletController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getWallet);
router.put('/threshold', requireAuth, updateThreshold);

export default router;