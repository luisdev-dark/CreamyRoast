// src/routes/auth.ts
import { Router } from 'express';
import { login, logout } from '../controllers/authController';

const router = Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

export default router;