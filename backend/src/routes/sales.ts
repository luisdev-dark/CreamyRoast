// src/routes/sales.ts
import { Router } from 'express';
import { createSale, getSales, cancelSale } from '../controllers/salesController';

const router = Router();

// GET /api/sales
router.get('/', getSales);

// POST /api/sales
router.post('/', createSale);

// DELETE /api/sales/:saleId (Cancelar venta)
router.delete('/:saleId', cancelSale);

export default router;