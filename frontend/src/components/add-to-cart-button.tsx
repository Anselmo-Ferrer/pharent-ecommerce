"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface AddToCartButtonProps {
  productId: string
  size?: string
  color?: string
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  showQuantity?: boolean
}

export function AddToCartButton({ 
  productId, 
  size, 
  color, 
  className,
  variant = "default",
  buttonSize = "default",
  showQuantity = true
}: AddToCartButtonProps) {
  const { addToCart, isInCart, getItemQuantity, updateQuantity, items } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  
  const isProductInCart = isInCart(productId, size, color)
  const currentQuantity = getItemQuantity(productId, size, color)
  const cartItem = items.find(item => 
    item.productId === productId && 
    item.size === size && 
    item.color === color
  )

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      if (isProductInCart) {
        updateQuantity(cartItem!.id, currentQuantity + 1)
      } else {
        addToCart(productId, 1, size, color)
      }
    } finally {
      setIsAdding(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (cartItem) {
      updateQuantity(cartItem.id, newQuantity)
    }
  }

  if (isProductInCart && showQuantity) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(currentQuantity - 1)}
          disabled={currentQuantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className="w-8 text-center font-medium">
          {currentQuantity}
        </span>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(currentQuantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      variant={variant}
      size={buttonSize}
      className={className}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isAdding ? "Adicionando..." : isProductInCart ? "Adicionado" : "Adicionar ao carrinho"}
    </Button>
  )
}
