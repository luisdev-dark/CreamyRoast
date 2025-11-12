import React, { useState, useEffect } from 'react'
import { Product, Category } from '../../types/products'

interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSubmit: (productData: Partial<Product>) => void
  onCancel: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  categories, 
  onSubmit, 
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    sku: '',
    barcode: '',
    categoryId: '',
    imageUrl: '',
    isActive: true,
    trackInventory: true,
    currentStock: 0,
    minStock: 5,
    maxStock: 100,
    allowBackorder: false,
    taxRate: 0.16,
    preparationTime: 0,
    size: ''
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        cost: product.cost || 0,
        sku: product.sku || '',
        barcode: product.barcode || '',
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive,
        trackInventory: product.trackInventory,
        currentStock: product.currentStock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        allowBackorder: product.allowBackorder,
        taxRate: product.taxRate,
        preparationTime: product.preparationTime || 0,
        size: product.size || ''
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
               type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio de venta *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tasa de impuesto
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de barras
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de imagen
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
              />
            </div>

            {formData.imageUrl && (
              <div className="mt-2">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiempo de preparación (min)
                </label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="Ej: Grande, Mediano, Pequeño"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Activo
                </label>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Inventario</h3>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="trackInventory"
                  checked={formData.trackInventory}
                  onChange={handleChange}
                  className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Trackear inventario
                </label>
              </div>

              {formData.trackInventory && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock actual
                    </label>
                    <input
                      type="number"
                      name="currentStock"
                      value={formData.currentStock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock mínimo
                    </label>
                    <input
                      type="number"
                      name="minStock"
                      value={formData.minStock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock máximo
                    </label>
                    <input
                      type="number"
                      name="maxStock"
                      value={formData.maxStock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="allowBackorder"
                  checked={formData.allowBackorder}
                  onChange={handleChange}
                  className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Permitir pedidos sin stock
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-coffee-600 text-white rounded-md hover:bg-coffee-700"
              >
                {product ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductForm