import { useState, useEffect, useCallback } from 'react';
import { productsService } from '../services/productsService';
import { 
  Product, 
  ProductFilter, 
  ProductsState,
  CreateProductData,
  UpdateProductData,
  ProductStockAdjustment
} from '../types/products';

export const useProducts = () => {
  const [state, setState] = useState<ProductsState>({
    products: [],
    categories: [],
    loading: false,
    error: null,
    currentCategory: null,
    searchTerm: '',
    filters: {},
  });

  // Cargar productos
  const loadProducts = useCallback(async (filters?: ProductFilter) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const products = await productsService.getAll(filters);
      setState(prev => ({ 
        ...prev, 
        products, 
        loading: false,
        filters: filters || {}
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cargar productos';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  // Cargar categorías
  const loadCategories = useCallback(async () => {
    try {
      const categories = await productsService.getCategories();
      setState(prev => ({ ...prev, categories }));
    } catch (error: any) {
      console.error('Error al cargar categorías:', error);
    }
  }, []);

  // Cargar productos por categoría
  const loadProductsByCategory = useCallback(async (categoryId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, currentCategory: categoryId }));
    try {
      const products = await productsService.getProductsByCategory(categoryId);
      setState(prev => ({ 
        ...prev, 
        products, 
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Error al cargar productos por categoría';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  // Buscar productos
  const searchProducts = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, searchTerm: query }));
    try {
      const products = await productsService.searchProducts(query);
      setState(prev => ({ 
        ...prev, 
        products, 
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Error al buscar productos';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, []);

  // Crear producto
  const createProduct = useCallback(async (productData: CreateProductData): Promise<Product | null> => {
    try {
      const newProduct = await productsService.create(productData);
      setState(prev => ({ 
        ...prev, 
        products: [...prev.products, newProduct]
      }));
      return newProduct;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al crear producto';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, []);

  // Actualizar producto
  const updateProduct = useCallback(async (id: string, productData: UpdateProductData): Promise<Product | null> => {
    try {
      const updatedProduct = await productsService.update(id, productData);
      setState(prev => ({ 
        ...prev, 
        products: prev.products.map(p => p.id === id ? updatedProduct : p)
      }));
      return updatedProduct;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar producto';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, []);

  // Eliminar producto
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      await productsService.delete(id);
      setState(prev => ({ 
        ...prev, 
        products: prev.products.filter(p => p.id !== id)
      }));
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al eliminar producto';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, []);

  // Ajustar inventario
  const adjustStock = useCallback(async (adjustment: ProductStockAdjustment): Promise<boolean> => {
    try {
      await productsService.adjustStock(adjustment);
      // Recargar productos para reflejar cambios
      await loadProducts(state.filters);
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al ajustar inventario';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, [loadProducts, state.filters]);

  // Actualizar stock específico
  const updateStock = useCallback(async (productId: string, quantity: number): Promise<boolean> => {
    try {
      await productsService.updateStock(productId, quantity);
      // Actualizar producto en el estado local
      setState(prev => ({ 
        ...prev, 
        products: prev.products.map(p => 
          p.id === productId ? { ...p, currentStock: quantity } : p
        )
      }));
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al actualizar inventario';
      setState(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, []);

  // Verificar disponibilidad
  const checkAvailability = useCallback(async (productId: string, quantity: number): Promise<boolean> => {
    try {
      return await productsService.checkAvailability(productId, quantity);
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return false;
    }
  }, []);

  // Obtener productos con bajo stock
  const getLowStockProducts = useCallback(async (): Promise<Product[]> => {
    try {
      return await productsService.getLowStockProducts();
    } catch (error) {
      console.error('Error al obtener productos con bajo stock:', error);
      return [];
    }
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      filters: {},
      currentCategory: null,
      searchTerm: ''
    }));
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  return {
    // Estado
    products: state.products,
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    currentCategory: state.currentCategory,
    searchTerm: state.searchTerm,
    filters: state.filters,

    // Métodos
    loadProducts,
    loadCategories,
    loadProductsByCategory,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    updateStock,
    checkAvailability,
    getLowStockProducts,
    clearFilters,
    clearError,
  };
};