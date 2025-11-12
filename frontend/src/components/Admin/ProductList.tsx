import React, { useState } from 'react'
import { Product } from '../../types/products'
import { Category } from '../../types/products'

interface ProductListProps {
  products: Product[]
  categories: Category[]
  loading: boolean
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  onToggleStatus: (productId: string, currentStatus: boolean) => void
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  categories, 
  loading, 
  onEdit, 
  onDelete,
  onToggleStatus 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || 'Sin categoría'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Lista de Productos</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.imageUrl && (
                      <img 
                        className="h-10 w-10 rounded-full object-cover mr-3" 
                        src={product.imageUrl} 
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getCategoryName(product.categoryId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.trackInventory ? (
                    <span className={`text-sm ${
                      product.currentStock <= product.minStock 
                        ? 'text-red-600 font-medium' 
                        : 'text-gray-900'
                    }`}>
                      {product.currentStock}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Sin tracking</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-coffee-600 hover:text-coffee-900 bg-coffee-50 px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onToggleStatus(product.id, product.isActive)}
                    className={`px-3 py-1 rounded ${
                      product.isActive
                        ? 'text-red-600 hover:text-red-900 bg-red-50'
                        : 'text-green-600 hover:text-green-900 bg-green-50'
                    }`}
                  >
                    {product.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No se encontraron productos</p>
        </div>
      )}
    </div>
  )
}

export default ProductList