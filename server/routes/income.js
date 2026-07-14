import express from 'express';
import { getAllIncome, addIncome, deleteIncome } from '../controllers/incomeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, addIncome);
router.get('/', requireAuth, getAllIncome);
router.delete('/:id', requireAuth, deleteIncome);


export default router;
