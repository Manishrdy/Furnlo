import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from './config/logger';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.API_PORT ?? 4000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// HTTP request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    logger.info('http', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ip: req.ip,
    });
  });
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'furnlo-api' });
});

app.use('/api/auth', authRouter);
// app.use('/api/projects', projectsRouter);
// app.use('/api/catalog', catalogRouter);
// app.use('/api/orders', ordersRouter);
// app.use('/api/admin', adminRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`Tradeliv API running on port ${PORT}`);
});

export default app;
