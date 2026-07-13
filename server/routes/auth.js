import express from 'express';
import { login, googleLogin, register, logout, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/google', googleLogin);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

export default router;