import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartStore, CartItem } from '@/types/cart'

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      isLoading: false,

      // Item management
      addItem: (productId: string, quantity = 1, size?: string, color?: string) => {
        const state = get()
        const existingItem = state.items.find(
          item => item.productId === productId && item.size === size && item.color === color
        )

        if (existingItem) {
          // Update existing item quantity
          set(state => ({
            items: state.items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }))
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            productId,
            quantity,
            size,
            color,
            addedAt: new Date()
          }
          
          set(state => ({
            items: [...state.items, newItem]
          }))
        }
      },

      removeItem: (itemId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      // UI management
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      // Computed values
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        // This will be calculated in components using product data
        return 0
      },

      getItemById: (itemId: string) => {
        return get().items.find(item => item.id === itemId)
      },

      // Persistence
      loadFromStorage: () => {
        // This is handled automatically by the persist middleware
      },

      saveToStorage: () => {
        // This is handled automatically by the persist middleware
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
)
