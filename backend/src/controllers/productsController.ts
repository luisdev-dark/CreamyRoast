// src/controllers/productsController.ts
import { Request, Response } from 'express';

interface ProductRequest {
  name: string;
  category_id: string;
  price: number;
  description?: string;
  image_url?: string;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    // TODO: Implementar consulta de productos desde Supabase
    const mockProducts = [
      {
        id: '1',
        name: 'Espresso Doble',
        category: 'Bebidas Calientes',
        price: 8.50,
        description: 'Café espresso de dos shots',
        image_url: '/images/espresso.jpg',
        estado: 'activo'
      },
      {
        id: '2',
        name: 'Capuccino',
        category: 'Bebidas Calientes',
        price: 12.00,
        description: 'Espresso con leche vaporizada y espuma',
        image_url: '/images/capuccino.jpg',
        estado: 'activo'
      }
    ];

    res.json({ products: mockProducts });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
};

export const createProduct = async (req: Request<{}, {}, ProductRequest>, res: Response) => {
  try {
    // TODO: Implementar creación de producto en Supabase
    const productData = req.body;
    
    res.json({
      message: 'Producto creado exitosamente (mock)',
      product: {
        id: `product-${Date.now()}`,
        ...productData,
        estado: 'activo'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creando producto' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // TODO: Implementar actualización de producto en Supabase
    res.json({
      message: 'Producto actualizado exitosamente (mock)',
      product: { id, ...updateData }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando producto' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Implementar eliminación de producto en Supabase
    res.json({ message: 'Producto eliminado exitosamente (mock)' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando producto' });
  }
};