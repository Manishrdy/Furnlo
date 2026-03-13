import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/designers', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/designers/:id', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.put('/designers/:id/status', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

router.get('/orders', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
