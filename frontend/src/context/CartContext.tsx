import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '../types/products'

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: (productId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  }

  const getItemCount = (productId: string) => {
    const item = cart.find(item => item.product.id === productId)
    return item?.quantity || 0
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}