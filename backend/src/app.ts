// src/app.ts
import express, { Express } from 'express';
import cors from 'cors';
import { authenticate, authorize } from './middleware/authMiddleware';
// import { authLimiter, generalLimiter, apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import salesRoutes from './routes/sales';
import productsRoutes from './routes/products';
// import inventoryRoutes from './routes/inventory';
// import reportRoutes from './routes/reports';

const app: Express = express();

// Middleware global
app.use(cors());
app.use(express.json());
// app.use(generalLimiter);

// Rutas públicas
app.use('/api/auth', authRoutes /* authLimiter */);

// Rutas protegidas
app.use('/api/sales', authenticate, /* apiLimiter, */ salesRoutes);
app.use('/api/products', authenticate, /* apiLimiter, */ productsRoutes);
// app.use('/api/inventory', authenticate, apiLimiter, inventoryRoutes);
// app.use('/api/reports', authenticate, authorize('administrador'), reportRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;