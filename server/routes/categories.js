import express from 'express';
import { addCategory, getAllCategories, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.post('/', addCategory);
router.get('/', getAllCategories);
router.delete('/:id', deleteCategory);


export default router;

