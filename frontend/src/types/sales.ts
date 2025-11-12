export interface Sale {
  id: string
  items: SaleItem[]
  total: number
  subtotal: number
  tax: number
  discount: number
  paymentMethod: PaymentMethod
  status: SaleStatus
  createdAt: string
  updatedAt: string
  userId: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  product: {
    id: string
    name: string
    price: number
  }
  quantity: number
  unitPrice: number
  total: number
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  MIXED = 'MIXED'
}

export enum SaleStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export interface SalesReport {
  totalSales: number
  totalRevenue: number
  totalItems: number
  averageTicket: number
  salesByPaymentMethod: {
    method: PaymentMethod
    count: number
    total: number
  }[]
  topProducts: {
    productId: string
    productName: string
    quantity: number
    revenue: number
  }[]
  salesByDate: {
    date: string
    sales: number
    revenue: number
  }[]
}

export interface CreateSaleData {
  items: {
    productId: string
    quantity: number
    unitPrice: number
  }[]
  paymentMethod: PaymentMethod
  discount?: number
  tax?: number
}

export interface SalesFilter {
  startDate?: string
  endDate?: string
  paymentMethod?: PaymentMethod
  status?: SaleStatus
  userId?: string
}