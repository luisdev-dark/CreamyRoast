// src/controllers/salesController.ts
import { Request, Response } from 'express';

interface CreateSaleRequest {
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: 'efectivo' | 'tarjeta' | 'yape';
  discount: number;
  paymentReference?: string;
}

export const createSale = async (
  req: Request<{}, {}, CreateSaleRequest>,
  res: Response
) => {
  try {
    // TODO: Implementar lógica de ventas con Supabase
    const { items, paymentMethod, discount } = req.body;

    // Mock de respuesta
    const saleNumber = `BOL-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(Date.now()).slice(-4)}`;
    const total = 45.00; // Mock total

    res.json({
      saleId: `sale-${Date.now()}`,
      saleNumber,
      total,
      message: 'Venta registrada exitosamente (mock)',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registrando venta' });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {
    // TODO: Implementar consulta de ventas
    res.json({
      sales: [],
      message: 'Lista de ventas (mock)',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo ventas' });
  }
};

export const cancelSale = async (req: Request, res: Response) => {
  try {
    const { saleId } = req.params;
    const { razon } = req.body;

    // TODO: Implementar cancelación de venta
    res.json({ message: 'Venta cancelada correctamente (mock)' });
  } catch (error) {
    res.status(500).json({ error: 'Error cancelando venta' });
  }
};