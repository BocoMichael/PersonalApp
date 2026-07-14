import express from 'express';
import { addCategory, getAllCategories, deleteCategory } from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, addCategory);
router.get('/', requireAuth, getAllCategories);
router.delete('/:id', requireAuth, deleteCategory);


export default router;

