import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
}

interface InventoryContextType {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateStock: (id: string, stock: number) => void
  getLowStockProducts: () => Product[]
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}

interface InventoryProviderProps {
  children: ReactNode
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Café Americano', price: 25, stock: 100, category: 'Bebidas' },
    { id: '2', name: 'Café Latte', price: 35, stock: 80, category: 'Bebidas' },
    { id: '3', name: 'Croissant', price: 20, stock: 50, category: 'Panadería' },
  ])

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = Date.now().toString()
    setProducts(prev => [...prev, { ...newProduct, id }])
  }

  const updateStock = (id: string, stock: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, stock } : product
      )
    )
  }

  const getLowStockProducts = () => {
    return products.filter(product => product.stock < 20)
  }

  const value: InventoryContextType = {
    products,
    addProduct,
    updateStock,
    getLowStockProducts
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}