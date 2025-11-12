import { api } from './api'
import { Sale, CreateSaleData, SalesReport, SalesFilter } from '../types/sales'

interface SalesResponse {
  success: boolean
  data?: Sale[]
  sale?: Sale
  report?: SalesReport
  message?: string
}

interface SaleResponse {
  success: boolean
  data?: Sale
  message?: string
}

export const salesService = {
  // Obtener todas las ventas
  getAll: async (filters?: SalesFilter): Promise<Sale[]> => {
    try {
      const params = new URLSearchParams()
      if (filters?.startDate) params.append('startDate', filters.startDate)
      if (filters?.endDate) params.append('endDate', filters.endDate)
      if (filters?.paymentMethod) params.append('paymentMethod', filters.paymentMethod)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.userId) params.append('userId', filters.userId)
      
      const response = await api.get<SalesResponse>(`/sales?${params.toString()}`)
      if (response.success && response.data) return response.data
      throw new Error(response.message || 'Error al obtener ventas')
    } catch (error) {
      console.error('Error al obtener ventas:', error)
      throw error
    }
  },

  // Obtener venta por ID
  getById: async (id: string): Promise<Sale> => {
    try {
      const response = await api.get<SaleResponse>(`/sales/${id}`)
      if (response.success && response.data) return response.data
      throw new Error(response.message || 'Error al obtener venta')
    } catch (error) {
      console.error('Error al obtener venta:', error)
      throw error
    }
  },

  // Crear nueva venta
  create: async (saleData: CreateSaleData): Promise<Sale> => {
    try {
      const response = await api.post<SaleResponse>('/sales', saleData)
      if (response.success && response.data) return response.data
      throw new Error(response.message || 'Error al crear venta')
    } catch (error) {
      console.error('Error al crear venta:', error)
      throw error
    }
  },

  // Actualizar venta
  update: async (id: string, saleData: Partial<CreateSaleData>): Promise<Sale> => {
    try {
      const response = await api.put<SaleResponse>(`/sales/${id}`, saleData)
      if (response.success && response.data) return response.data
      throw new Error(response.message || 'Error al actualizar venta')
    } catch (error) {
      console.error('Error al actualizar venta:', error)
      throw error
    }
  },

  // Cancelar venta
  cancel: async (id: string): Promise<Sale> => {
    try {
      const response = await api.patch<SaleResponse>(`/sales/${id}/cancel`)
      if (response.success && response.data) return response.data
      throw new Error(response.message || 'Error al cancelar venta')
    } catch (error) {
      console.error('Error al cancelar venta:', error)
      throw error
    }
  },

  // Obtener reporte de ventas
  getReport: async (filters?: SalesFilter): Promise<SalesReport> => {
    try {
      const params = new URLSearchParams()
      if (filters?.startDate) params.append('startDate', filters.startDate)
      if (filters?.endDate) params.append('endDate', filters.endDate)
      if (filters?.userId) params.append('userId', filters.userId)
      
      const response = await api.get<{ success: boolean; report?: SalesReport; message?: string }>(
        `/sales/report?${params.toString()}`
      )
      if (response.success && response.report) return response.report
      throw new Error(response.message || 'Error al obtener reporte')
    } catch (error) {
      console.error('Error al obtener reporte:', error)
      throw error
    }
  },

  // Obtener ventas del día actual
  getTodaySales: async (): Promise<Sale[]> => {
    try {
      const today = new Date().toISOString().split('T')[0]
      return await salesService.getAll({ startDate: today, endDate: today })
    } catch (error) {
      console.error('Error al obtener ventas del día:', error)
      throw error
    }
  }
}