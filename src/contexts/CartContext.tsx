"use client"

import React, { createContext, useContext, useReducer, ReactNode, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  description: string
}

interface CartState {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  itemCount: number
  isOpen: boolean
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'INCREASE_QUANTITY'; payload: string }
  | { type: 'DECREASE_QUANTITY'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

const CartContext = createContext<CartContextType | undefined>(undefined)

const TAX_RATE = 0.20 // 20% TVA française

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return calculateTotals({ ...state, items: updatedItems })
      } else {
        const newItem = { ...action.payload, quantity: 1 }
        return calculateTotals({ ...state, items: [...state.items, newItem] })
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      return calculateTotals({ ...state, items: updatedItems })
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id })
      }

      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return calculateTotals({ ...state, items: updatedItems })
    }

    case 'INCREASE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      return calculateTotals({ ...state, items: updatedItems })
    }

    case 'DECREASE_QUANTITY': {
      const item = state.items.find(item => item.id === action.payload)
      if (item && item.quantity <= 1) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload })
      }

      const updatedItems = state.items.map(item =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      return calculateTotals({ ...state, items: updatedItems })
    }

    case 'CLEAR_CART': {
      return {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
        isOpen: state.isOpen
      }
    }

    case 'OPEN_CART': {
      return { ...state, isOpen: true }
    }

    case 'CLOSE_CART': {
      return { ...state, isOpen: false }
    }

    default:
      return state
  }
}

function calculateTotals(state: CartState): CartState {
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return { ...state, subtotal, tax, total, itemCount }
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [isClient, setIsClient] = useState(false)
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    itemCount: 0,
    isOpen: false
  })

  // Initialiser côté client pour éviter l'hydratation
  useEffect(() => {
    setIsClient(true)
  }, [])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const increaseQuantity = (id: string) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: id })
  }

  const decreaseQuantity = (id: string) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: id })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
