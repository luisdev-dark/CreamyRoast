// src/routes/products.ts
import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productsController';

const router = Router();

// GET /api/products
router.get('/', getProducts);

// POST /api/products
router.post('/', createProduct);

// PUT /api/products/:id
router.put('/:id', updateProduct);

// DELETE /api/products/:id
router.delete('/:id', deleteProduct);

export default router;