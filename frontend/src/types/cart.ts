export interface CartItem {
  id: string
  productId: string
  quantity: number
  size?: string
  color?: string
  addedAt: Date
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
}

export interface CartActions {
  // Item management
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  
  // UI management
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Computed values
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemById: (itemId: string) => CartItem | undefined
  
  // Persistence
  loadFromStorage: () => void
  saveToStorage: () => void
}

export type CartStore = CartState & CartActions
