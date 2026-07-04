import express from 'express';
import { getAllExpense, addExpense, deleteExpense } from '../controllers/expenseController.js';


const router = express.Router();

router.post('/', addExpense);
router.get('/', getAllExpense);
router.delete('/:id', deleteExpense);

export default router;

