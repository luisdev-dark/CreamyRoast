import { Request, Response } from 'express';
import { getProducts as getProductsFromDb, createProduct as createProductInDb, updateProduct as updateProductInDb, deleteProduct as deleteProductInDb } from '../services/sqliteService';

interface ProductRequest {
  name: string;
  category_id: string;
  price: number;
  description?: string;
  image_url?: string;
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // Intentar usar Supabase primero, si no está disponible usar SQLite
    const products = getProductsFromDb();
    res.json({ products });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
};

export const createProduct = async (req: Request<{}, {}, ProductRequest>, res: Response): Promise<void> => {
  try {
    const productData = req.body;
    const newProduct = {
      id: `product-${Date.now()}`,
      name: productData.name,
      category_id: productData.category_id,
      price: productData.price,
      description: productData.description || null,
      image_url: productData.image_url || null,
      estado: 'activo'
    };
    
    createProductInDb(newProduct);
    
    res.json({
      message: 'Producto creado exitosamente',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error creando producto' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'ID de producto requerido' });
      return;
    }
    
    const updateData = req.body;

    const updatedProduct = updateProductInDb(id, updateData);
    
    res.json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error actualizando producto' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({ error: 'ID de producto requerido' });
      return;
    }

    const result = deleteProductInDb(id);
    res.json(result);
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error eliminando producto' });
  }
};