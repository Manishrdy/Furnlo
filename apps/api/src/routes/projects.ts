import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireRole('designer'));

router.get('/', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/:id', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.put('/:id', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.delete('/:id', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

// Rooms
router.get('/:id/rooms', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/:id/rooms', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.put('/:id/rooms/:roomId', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.delete('/:id/rooms/:roomId', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
