import { api } from './api';
import { 
  Product, 
  Category, 
  CreateProductData, 
  UpdateProductData, 
  ProductFilter, 
  ProductStockAdjustment,
  ProductsResponse,
  ProductResponse,
  CategoriesResponse,
  CategoryResponse,
  ProductStats
} from '../types/products';

export const productsService = {
  // Productos
  getAll: async (filters?: ProductFilter): Promise<Product[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString());

      const response = await api.get<ProductsResponse>(`/products?${params.toString()}`);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener productos');
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get<ProductResponse>(`/products/${id}`);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener producto');
      }
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },

  create: async (productData: CreateProductData): Promise<Product> => {
    try {
      const response = await api.post<ProductResponse>('/products', productData);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al crear producto');
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  update: async (id: string, productData: UpdateProductData): Promise<Product> => {
    try {
      const response = await api.put<ProductResponse>(`/products/${id}`, productData);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await api.delete<{ success: boolean; message?: string }>(`/products/${id}`);
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  // Gestión de inventario
  adjustStock: async (adjustment: ProductStockAdjustment): Promise<void> => {
    try {
      const response = await api.post<{ success: boolean; message?: string }>('/products/adjust-stock', adjustment);
      if (!response.success) {
        throw new Error(response.message || 'Error al ajustar inventario');
      }
    } catch (error) {
      console.error('Error al ajustar inventario:', error);
      throw error;
    }
  },

  updateStock: async (productId: string, quantity: number): Promise<void> => {
    try {
      const response = await api.put<{ success: boolean; message?: string }>(`/products/${productId}/stock`, { quantity });
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar inventario');
      }
    } catch (error) {
      console.error('Error al actualizar inventario:', error);
      throw error;
    }
  },

  // Categorías
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get<CategoriesResponse>('/categories');
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener categorías');
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

  getCategoryById: async (id: string): Promise<Category> => {
    try {
      const response = await api.get<CategoryResponse>(`/categories/${id}`);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener categoría');
      }
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      throw error;
    }
  },

  createCategory: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    try {
      const response = await api.post<CategoryResponse>('/categories', categoryData);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al crear categoría');
      }
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Category> => {
    try {
      const response = await api.put<CategoryResponse>(`/categories/${id}`, categoryData);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al actualizar categoría');
      }
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      const response = await api.delete<{ success: boolean; message?: string }>(`/categories/${id}`);
      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar categoría');
      }
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  },

  // Estadísticas y reportes
  getProductStats: async (): Promise<ProductStats> => {
    try {
      const response = await api.get<{ success: boolean; data: ProductStats; message?: string }>('/products/stats');
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener estadísticas');
      }
    } catch (error) {
      console.error('Error al obtener estadísticas de productos:', error);
      throw error;
    }
  },

  // Búsqueda y filtros avanzados
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const response = await api.get<ProductsResponse>(`/products/search?q=${encodeURIComponent(query)}`);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al buscar productos');
      }
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  },

  // Productos por categoría
  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    try {
      const response = await api.get<ProductsResponse>(`/categories/${categoryId}/products`);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener productos por categoría');
      }
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  },

  // Productos con bajo stock
  getLowStockProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<ProductsResponse>('/products/low-stock');
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener productos con bajo stock');
      }
    } catch (error) {
      console.error('Error al obtener productos con bajo stock:', error);
      throw error;
    }
  },

  // Validar disponibilidad de productos
  checkAvailability: async (productId: string, quantity: number): Promise<boolean> => {
    try {
      const response = await api.get<{ success: boolean; data: { available: boolean }; message?: string }>(`/products/${productId}/check-availability?quantity=${quantity}`);
      if (response.success && response.data) {
        return response.data.available;
      } else {
        throw new Error(response.message || 'Error al verificar disponibilidad');
      }
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw error;
    }
  }
};