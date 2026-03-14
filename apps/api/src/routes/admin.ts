import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@furnlo/db';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { writeAuditLog } from '../services/auditLog';
import logger from '../config/logger';

const router = Router();
router.use(requireAuth, requireRole('admin'));

/* ─── GET /api/admin/me ─────────────────────────────── */

router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const designer = await prisma.designer.findUnique({
      where: { id: req.user!.id },
      select: { id: true, fullName: true, email: true, businessName: true, isAdmin: true },
    });
    if (!designer) {
      res.status(404).json({ error: 'Account not found.' });
      return;
    }
    res.json(designer);
  } catch (err) {
    logger.error('admin route error', { err, path: req.path, method: req.method });
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

/* ─── GET /api/admin/stats ──────────────────────────── */

router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [statusGroups, totalProjects, totalOrders] = await Promise.all([
      prisma.designer.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.project.count(),
      prisma.order.count(),
    ]);

    const byStatus = Object.fromEntries(
      statusGroups.map((g) => [g.status, g._count.id]),
    ) as Record<string, number>;

    res.json({
      designers: {
        total: statusGroups.reduce((acc, g) => acc + g._count.id, 0),
        pending_review: byStatus.pending_review ?? 0,
        approved: byStatus.approved ?? 0,
        rejected: byStatus.rejected ?? 0,
        suspended: byStatus.suspended ?? 0,
      },
      totalProjects,
      totalOrders,
    });
  } catch (err) {
    logger.error('admin route error', { err, path: req.path, method: req.method });
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

/* ─── GET /api/admin/designers ──────────────────────── */

router.get('/designers', async (req: AuthRequest, res: Response) => {
  const { status, search } = req.query;

  try {
    const designers = await prisma.designer.findMany({
      where: {
        ...(status && typeof status === 'string' ? { status: status as never } : {}),
        ...(search && typeof search === 'string' ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { businessName: { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
      },
      select: {
        id: true, fullName: true, email: true, businessName: true,
        phone: true, status: true, isAdmin: true, createdAt: true,
        _count: { select: { clients: true, projects: true, orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(designers);
  } catch (err) {
    logger.error('admin route error', { err, path: req.path, method: req.method });
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

/* ─── GET /api/admin/designers/:id ─────────────────── */

router.get('/designers/:id', async (req: AuthRequest, res: Response) => {
  try {
    const designer = await prisma.designer.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, fullName: true, email: true, businessName: true,
        phone: true, status: true, isAdmin: true, createdAt: true, updatedAt: true,
        _count: { select: { clients: true, projects: true, orders: true } },
        projects: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, name: true, status: true, createdAt: true,
            client: { select: { name: true } },
            _count: { select: { rooms: true, shortlistItems: true } },
          },
        },
      },
    });

    if (!designer) {
      res.status(404).json({ error: 'Designer not found.' });
      return;
    }

    res.json(designer);
  } catch (err) {
    logger.error('admin route error', { err, path: req.path, method: req.method });
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

/* ─── PUT /api/admin/designers/:id/status ───────────── */

const statusUpdateSchema = z.object({
  status: z.enum(['pending_review', 'approved', 'rejected', 'suspended']),
});

router.put('/designers/:id/status', async (req: AuthRequest, res: Response) => {
  const parsed = statusUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const existing = await prisma.designer.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: 'Designer not found.' });
      return;
    }

    const designer = await prisma.designer.update({
      where: { id: req.params.id },
      data: { status: parsed.data.status },
      select: {
        id: true, fullName: true, email: true, businessName: true,
        phone: true, status: true, isAdmin: true, createdAt: true,
        _count: { select: { clients: true, projects: true, orders: true } },
      },
    });

    writeAuditLog({
      actorType: 'admin',
      actorId: req.user!.id,
      action: 'designer_status_changed',
      entityType: 'designer',
      entityId: req.params.id,
      payload: { from: existing.status, to: parsed.data.status },
    });

    res.json(designer);
  } catch (err) {
    logger.error('admin route error', { err, path: req.path, method: req.method });
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

/* ─── GET /api/admin/activity ───────────────────────── */

router.get('/activity', async (_req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(logs);
  } catch (err) {
    logger.error('admin route error', { err, path: req.path, method: req.method });
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

export default router;
