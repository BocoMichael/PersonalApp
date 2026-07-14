import express from 'express';
import { getAllExpense, addExpense, deleteExpense } from '../controllers/expenseController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, addExpense);
router.get('/', requireAuth, getAllExpense);
router.delete('/:id', requireAuth, deleteExpense);

export default router;

