import React, { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import CategoryFilter from '../components/POS/CategoryFilter'
import ProductSearch from '../components/POS/ProductSearch'
import { Product } from '../types/products'

const POSPage: React.FC = () => {
  const { products, categories, loading, error, loadProducts, loadProductsByCategory, searchProducts } = useProducts()
  const { cart, addToCart, removeFromCart, updateQuantity, getTotal } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    loadProducts()
  }, [])

  // Manejar selección de categoría
  const handleCategorySelect = async (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    if (categoryId) {
      await loadProductsByCategory(categoryId)
    } else {
      await loadProducts()
    }
  }

  // Manejar búsqueda de productos
  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    await searchProducts(term)
  }

  // Limpiar búsqueda
  const handleClearSearch = async () => {
    setSearchTerm('')
    if (selectedCategory) {
      await loadProductsByCategory(selectedCategory)
    } else {
      await loadProducts()
    }
  }

  // Manejar agregar producto al carrito
  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => loadProducts()} 
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Punto de Venta (POS)</h1>
      
      {/* Filtros y búsqueda */}
      <div className="mb-6 space-y-4">
        <ProductSearch 
          onSearch={handleSearch}
          onClear={handleClearSearch}
          loading={loading}
          placeholder="Buscar productos por nombre o descripción..."
        />
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Productos 
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({products.length} productos)
              </span>
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-gray-200 p-4 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No se encontraron productos</p>
                {searchTerm && (
                  <button 
                    onClick={handleClearSearch}
                    className="mt-2 text-coffee-600 hover:text-coffee-700"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    className="border border-gray-200 p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer hover:border-coffee-300"
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    )}
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    )}
                    <p className="text-coffee-600 font-bold mt-2">${product.price.toFixed(2)}</p>
                    {product.trackInventory && (
                      <p className={`text-xs mt-1 ${
                        product.currentStock <= product.minStock 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                      }`}>
                        Stock: {product.currentStock}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Carrito de compras */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Carrito 
              {cart.length > 0 && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                </span>
              )}
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No hay productos en el carrito</p>
                <p className="text-sm mt-1">Selecciona productos para agregarlos</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <p className="text-coffee-600 font-bold">${item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                        className="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-200 rounded text-sm hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-2 text-red-600 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <button 
                className="w-full bg-coffee-600 text-white py-2 rounded-lg mt-4 hover:bg-coffee-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={cart.length === 0}
              >
                {cart.length === 0 ? 'Agrega productos' : 'Pagar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default POSPage