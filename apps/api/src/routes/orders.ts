import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireRole('designer'));

// Shortlist
router.post('/projects/:projectId/shortlist', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/projects/:projectId/shortlist', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.put('/projects/:projectId/shortlist/:itemId', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.delete('/projects/:projectId/shortlist/:itemId', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

// Cart
router.get('/projects/:projectId/cart', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/projects/:projectId/cart', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.put('/projects/:projectId/cart/:itemId', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.delete('/projects/:projectId/cart/:itemId', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

// Orders
router.post('/projects/:projectId/orders', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/projects/:projectId/orders/:orderId', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
