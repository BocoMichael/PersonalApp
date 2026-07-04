import express from 'express';
import { getAllIncome, addIncome, deleteIncome } from '../controllers/incomeController.js';

const router = express.Router();


router.post('/', addIncome);
router.get('/', getAllIncome);
router.delete('/:id', deleteIncome);


export default router;
