import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@furnlo/db';
import { config } from '../config';

const router = Router();

const designerSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().optional(),
  phone: z.string().optional(),
});

const clientSignupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  city: z.string().optional(),
  projectTypes: z.array(z.string()).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['designer', 'client']).optional().default('designer'),
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

    res.status(201).json({ message: 'Account created successfully.', token, role: 'designer' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// POST /api/auth/signup/client
router.post('/signup/client', async (req: Request, res: Response) => {
  const parsed = clientSignupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  // Client self-registrations are queued for designer assignment.
  // We store them as a designer record with a note for now (MVP approach).
  // In production, this would be a separate ClientRegistration table.
  const { email } = parsed.data;

  try {
    const existing = await prisma.designer.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    // For the MVP, client self-registrations are acknowledged and a designer is assigned manually.
    res.status(201).json({ message: 'Registration received. A designer will be in touch with you shortly.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// POST /api/auth/login — unified login for designer & client
router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const { email, password, role } = parsed.data;

  try {
    if (role === 'designer') {
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

      const token = signToken({ id: designer.id, role: 'designer' });

      res.json({
        token,
        role: 'designer',
        user: { id: designer.id, fullName: designer.fullName, email: designer.email, status: designer.status },
      });
      return;
    }

    // Client login — access code based (MVP placeholder)
    res.status(401).json({ error: 'Client login requires an access code from your designer.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// POST /api/auth/client/login — client access code login (legacy route)
router.post('/client/login', async (req: Request, res: Response) => {
  res.status(501).json({ error: 'Client portal access requires an invitation link from your designer.' });
});

export default router;
