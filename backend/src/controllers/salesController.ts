import { Request, Response } from 'express';
import { createSale as createSaleInDb, getSales as getSalesFromDb, cancelSale as cancelSaleInDb } from '../services/sqliteService';

interface CreateSaleRequest {
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: 'efectivo' | 'tarjeta' | 'yape';
  discount: number;
  paymentReference?: string;
}

export const createSale = async (
  req: Request<{}, {}, CreateSaleRequest>,
  res: Response
): Promise<void> => {
  try {
    const { items, paymentMethod, discount } = req.body;

    // Calcular total (por ahora mock, luego se calculará basado en productos)
    const total = 45.00;
    
    const newSale = {
      id: `sale-${Date.now()}`,
      total,
      user_id: null, // Se puede obtener del token después
      items,
      paymentMethod,
      discount
    };

    createSaleInDb(newSale);

    // Generar número de venta simple
    const saleNumber = `BOL-${Date.now()}`;

    res.json({
      saleId: newSale.id,
      saleNumber,
      total,
      message: 'Venta registrada exitosamente',
    });
  } catch (error) {
    console.error('Error registrando venta:', error);
    res.status(500).json({ error: 'Error registrando venta' });
  }
};

export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const sales = getSalesFromDb();
    res.json({ sales });
  } catch (error) {
    console.error('Error obteniendo ventas:', error);
    res.status(500).json({ error: 'Error obteniendo ventas' });
  }
};

export const cancelSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { saleId } = req.params;
    const { razon } = req.body;

    if (!saleId) {
      res.status(400).json({ error: 'ID de venta requerido' });
      return;
    }

    const result = cancelSaleInDb(saleId);
    res.json(result);
  } catch (error) {
    console.error('Error cancelando venta:', error);
    res.status(500).json({ error: 'Error cancelando venta' });
  }
};