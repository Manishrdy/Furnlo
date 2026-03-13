import { Router } from 'express';

const router = Router();

// POST /api/auth/signup
router.post('/signup', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// POST /api/auth/login
router.post('/login', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

// POST /api/auth/client/login
router.post('/client/login', (_req, res) => {
  res.status(501).json({ message: 'Not implemented' });
});

export default router;
