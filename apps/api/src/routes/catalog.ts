import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireRole('designer', 'admin'));

// Browse global catalog
router.get('/products', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/products/:id', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

// Trigger Claude API extraction + cache check
router.post('/import', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

// Scrape batches (cache management)
router.get('/batches', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

export default router;
