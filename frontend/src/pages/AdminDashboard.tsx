import React, { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { salesService } from '../services/salesService'
import { productsService } from '../services/productsService'
import ProductList from '../components/Admin/ProductList'
import ProductForm from '../components/Admin/ProductForm'
import SalesReportComponent from '../components/Admin/SalesReport'
import { Product, CreateProductData, UpdateProductData } from '../types/products'
import { SalesReport } from '../types/sales'

const AdminDashboard: React.FC = () => {
  const { products, categories, loading: productsLoading, loadProducts, loadCategories } = useProducts()
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null)
  const [todaySales, setTodaySales] = useState(0)
  const [loadingReports, setLoadingReports] = useState(true)

  // Cargar datos iniciales
  useEffect(() => {
    loadProducts()
    loadCategories()
    loadSalesData()
  }, [])

  const loadSalesData = async () => {
    try {
      setLoadingReports(true)
      const report = await salesService.getReport()
      const todaySalesData = await salesService.getTodaySales()
      setSalesReport(report)
      // Calcular el total de ventas del día sumando los totales de cada venta
      const total = todaySalesData.reduce((sum, sale) => sum + (sale.total || 0), 0)
      setTodaySales(total)
    } catch (error) {
      console.error('Error al cargar datos de ventas:', error)
    } finally {
      setLoadingReports(false)
    }
  }

  // Calcular productos con bajo stock
  const lowStockProducts = products.filter(product => 
    product.trackInventory && product.currentStock <= product.minStock
  ).length

  // Handlers para CRUD de productos
  const handleCreateProduct = async (productData: Partial<Product>) => {
    try {
      await productsService.create(productData as CreateProductData)
      setShowProductForm(false)
      await loadProducts()
    } catch (error) {
      console.error('Error al crear producto:', error)
      alert('Error al crear producto')
    }
  }

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return
    
    try {
      await productsService.update(editingProduct.id, productData as UpdateProductData)
      setEditingProduct(null)
      setShowProductForm(false)
      await loadProducts()
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      alert('Error al actualizar producto')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    
    try {
      await productsService.delete(productId)
      await loadProducts()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      alert('Error al eliminar producto')
    }
  }

  const handleToggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      await productsService.update(productId, { id: productId, isActive: !currentStatus })
      await loadProducts()
    } catch (error) {
      console.error('Error al cambiar estado del producto:', error)
      alert('Error al cambiar estado del producto')
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleCancelForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button
          onClick={() => setShowProductForm(true)}
          className="bg-coffee-600 text-white px-4 py-2 rounded-md hover:bg-coffee-700"
        >
          Nuevo Producto
        </button>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total de Productos</h3>
          <p className="text-3xl font-bold text-coffee-600">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Productos con Bajo Stock</h3>
          <p className="text-3xl font-bold text-orange-600">{lowStockProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Ventas del Día</h3>
          <p className="text-3xl font-bold text-green-600">
            ${loadingReports ? '...' : todaySales.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total de Categorías</h3>
          <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
        </div>
      </div>

      {/* Reporte de ventas */}
      {!loadingReports && salesReport && (
        <div className="mb-8">
          <SalesReportComponent report={salesReport} />
        </div>
      )}

      {/* Lista de productos con acciones CRUD */}
      <ProductList
        products={products}
        categories={categories}
        loading={productsLoading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onToggleStatus={handleToggleProductStatus}
      />

      {/* Formulario de producto (modal) */}
      {showProductForm && (
        <ProductForm
          product={editingProduct || undefined}
          categories={categories}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  )

}

export default AdminDashboard