import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.API_PORT ?? 4000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'furnlo-api' });
});

// Routes (to be mounted as each module is built)
// app.use('/api/auth', authRouter);
// app.use('/api/projects', projectsRouter);
// app.use('/api/catalog', catalogRouter);
// app.use('/api/orders', ordersRouter);
// app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Furnlo API running on port ${PORT}`);
});

export default app;
