import { useCartStore } from '@/stores/cart-store'
import { useState, useEffect } from 'react'

interface Produto {
  id_produto: number
  nome: string
  descricao?: string
  preco: number
  estoque: number
  imagem?: string
  categoria: {
    nome: string
  }
}

export function useCart() {
  const store = useCartStore()
  const [products, setProducts] = useState<Record<string, Produto>>({})
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  // Buscar produtos do banco de dados quando o carrinho mudar
  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = [...new Set(store.items.map(item => item.productId))]
      
      if (productIds.length === 0) {
        setProducts({})
        return
      }

      setIsLoadingProducts(true)
      try {
        const fetchPromises = productIds.map(async (id) => {
          // Se já temos o produto em cache, não buscar novamente
          if (products[id]) return null
          
          const res = await fetch(`http://localhost:3001/api/produtos/${id}`)
          if (!res.ok) return null
          const data = await res.json()
          return { id, data: { ...data, preco: Number(data.preco) } }
        })

        const results = await Promise.all(fetchPromises)
        
        const newProducts: Record<string, Produto> = { ...products }
        results.forEach(result => {
          if (result) {
            newProducts[result.id] = result.data
          }
        })
        
        setProducts(newProducts)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [store.items.map(item => item.productId).join(',')])

  const getProductById = (productId: string) => {
    return products[productId]
  }

  const calculateSubtotal = () => {
    return store.items.reduce((total, item) => {
      const product = getProductById(item.productId)
      return total + (product?.preco || 0) * item.quantity
    }, 0)
  }

  const calculateShipping = (subtotal: number) => {
    return subtotal > 10 ? 0 : 0
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = calculateShipping(subtotal)
    return subtotal + shipping
  }

  const getCartSummary = () => {
    const subtotal = calculateSubtotal()
    const shipping = calculateShipping(subtotal)
    const total = subtotal + shipping
    
    return {
      subtotal,
      shipping,
      total,
      isFreeShipping: shipping === 0,
      freeShippingThreshold: 200,
      amountNeededForFreeShipping: Math.max(0, 200 - subtotal)
    }
  }

  const addToCart = (productId: string, quantity = 1, size?: string, color?: string) => {
    store.addItem(productId, quantity, size, color)
  }

  const isInCart = (productId: string, size?: string, color?: string) => {
    return store.items.some(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    )
  }

  const getItemQuantity = (productId: string, size?: string, color?: string) => {
    const item = store.items.find(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    )
    return item?.quantity || 0
  }

  return {
    ...store,
    getProductById,
    calculateSubtotal,
    calculateShipping,
    calculateTotal,
    getCartSummary,
    addToCart,
    isInCart,
    getItemQuantity,
    isLoadingProducts
  }
}