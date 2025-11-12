// Tipos para productos y categorías

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  categoryId: string;
  category?: Category;
  imageUrl?: string;
  isActive: boolean;
  trackInventory: boolean;
  currentStock: number;
  minStock: number;
  maxStock: number;
  allowBackorder: boolean;
  taxRate: number;
  preparationTime?: number; // tiempo en minutos
  size?: string;
  options?: ProductOption[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  categoryId: string;
  imageUrl?: string;
  isActive?: boolean;
  trackInventory?: boolean;
  currentStock?: number;
  minStock?: number;
  maxStock?: number;
  allowBackorder?: boolean;
  taxRate?: number;
  preparationTime?: number;
  size?: string;
  options?: Omit<ProductOption, 'id'>[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductFilter {
  categoryId?: string;
  search?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductStockAdjustment {
  productId: string;
  quantity: number;
  type: 'add' | 'remove' | 'set';
  reason?: string;
  notes?: string;
}

// Respuestas del API
export interface ProductsResponse {
  success: boolean;
  data: Product[];
  message?: string;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
  message?: string;
}

// Estado para el contexto/hook de productos
export interface ProductsState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  currentCategory: string | null;
  searchTerm: string;
  filters: ProductFilter;
}

// Tipos para el carrito POS
export interface CartItem {
  product: Product;
  quantity: number;
  options?: SelectedOption[];
  notes?: string;
  discount?: number;
}

export interface SelectedOption {
  optionId: string;
  name: string;
  price: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerInfo?: CustomerInfo;
  orderNotes?: string;
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'mixed';

export interface PaymentData {
  method: PaymentMethod;
  amount: number;
  reference?: string;
  cardLastFour?: string;
}

// Tipos para reportes y estadísticas
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number; // valor del inventario
}

export interface SalesByProduct {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
  averagePrice: number;
}