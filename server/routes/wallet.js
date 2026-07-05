import express from 'express';
import { getWallet, updateThreshold } from '../controllers/walletController.js';

const router = express.Router();

router.get('/', getWallet);
router.put('/threshold', updateThreshold);

export default router;