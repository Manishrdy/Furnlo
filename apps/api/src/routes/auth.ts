import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@furnlo/db';
import { config } from '../config';
import { requireAuth, AuthRequest } from '../middleware/auth';
import logger from '../config/logger';

const router = Router();

const SESSION_COOKIE = 'session';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  };
}

const designerSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

function signToken(payload: { id: string; role: string }) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as string });
}

// POST /api/auth/signup/designer
router.post('/signup/designer', async (req: Request, res: Response) => {
  const parsed = designerSignupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const { fullName, email, password, businessName, phone } = parsed.data;

  try {
    const existing = await prisma.designer.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const designer = await prisma.designer.create({
      data: { fullName, email, passwordHash, businessName, phone, status: 'approved' },
    });

    const token = signToken({ id: designer.id, role: 'designer' });

    res.cookie(SESSION_COOKIE, token, cookieOptions());
    res.status(201).json({
      message: 'Account created successfully.',
      role: 'designer',
      user: { id: designer.id, fullName: designer.fullName, email: designer.email, status: designer.status },
    });
  } catch (err) {
    logger.error('auth route error', { err, path: req.path, method: req.method });
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const designer = await prisma.designer.findUnique({ where: { email } });
    if (!designer) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const valid = await bcrypt.compare(password, designer.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    if (designer.status === 'suspended' || designer.status === 'rejected') {
      res.status(403).json({ error: 'Your account is not active. Please contact support.' });
      return;
    }

    // MVP: auto-approve legacy pending_review accounts on login
    if (designer.status === 'pending_review') {
      await prisma.designer.update({ where: { id: designer.id }, data: { status: 'approved' } });
    }

    const token = signToken({ id: designer.id, role: 'designer' });

    res.cookie(SESSION_COOKIE, token, cookieOptions());
    res.json({
      role: 'designer',
      user: { id: designer.id, fullName: designer.fullName, email: designer.email, status: designer.status },
    });
  } catch (err) {
    logger.error('auth route error', { err, path: req.path, method: req.method });
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const designer = await prisma.designer.findUnique({
      where: { id: req.user!.id },
      select: { id: true, fullName: true, email: true, businessName: true, phone: true, status: true, createdAt: true },
    });
    if (!designer) {
      res.status(404).json({ error: 'Account not found.' });
      return;
    }
    res.json(designer);
  } catch (err) {
    logger.error('auth route error', { err, path: req.path, method: req.method });
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

export default router;
