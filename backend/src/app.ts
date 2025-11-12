import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate, authorize } from './middleware/authMiddleware';
import { authLimiter, generalLimiter, apiLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import salesRoutes from './routes/sales';
import productsRoutes from './routes/products';
import { initializeDatabase } from './services/sqliteService';
import { checkConnection } from './services/supabaseService';

// Cargar variables de entorno
dotenv.config();

const app: Express = express();

// Middleware global
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(generalLimiter);

// Inicializar base de datos
initializeDatabase();
checkConnection();

// Rutas públicas
app.use('/api/auth', authLimiter, authRoutes);

// Rutas protegidas
app.use('/api/sales', authenticate, apiLimiter, salesRoutes);
app.use('/api/products', authenticate, apiLimiter, productsRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

export default app;