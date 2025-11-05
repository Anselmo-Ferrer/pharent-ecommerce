"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/stores/cart-store"
import { useCart } from "@/hooks/use-cart"

interface CartSidebarProps {
  children: React.ReactNode
}

export function CartSidebar({ children }: CartSidebarProps) {
  const { 
    items: cartItems, 
    isOpen, 
    toggleCart, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    getTotalItems 
  } = useCartStore()

  const { getProductById, isLoadingProducts } = useCart()

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getProductById(item.productId)
      return total + (product?.preco || 0) * item.quantity
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = subtotal > 10 ? 0 : 0
  const total = subtotal + shipping
  const totalItems = getTotalItems()

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] px-3 pb-3">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho ({totalItems})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Seu carrinho está vazio</h3>
              <p className="text-muted-foreground mb-6">
                Adicione alguns produtos para começar sua compra
              </p>
              <Button 
                onClick={() => closeCart()}
                className="bg-primary hover:bg-primary/90"
                asChild
              >
                <Link href="/products">
                  Ver produtos
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Lista de produtos */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {isLoadingProducts && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Carregando produtos...
                  </div>
                )}
                
                {cartItems.map((item) => {
                  const product = getProductById(item.productId)
                  if (!product) return null

                  return (
                    <div key={item.id} className="flex gap-3 p-3 rounded-lg border">
                      {/* Imagem do produto */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={product.imagem || "/placeholder.svg"}
                          alt={product.nome}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Informações do produto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.nome}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold">R$ {product.preco.toFixed(2)}</span>
                          {item.size && (
                            <Badge variant="outline" className="text-xs">Tamanho: {item.size}</Badge>
                          )}
                        </div>

                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 dark:hover:bg-primary text-white cursor-pointer"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3"/>
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 dark:hover:bg-primary text-white"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive hover:dark:bg-red-300 h-6 px-2 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Resumo e botões */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <span>
                      {shipping === 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Grátis
                        </Badge>
                      ) : (
                        `R$ ${shipping}`
                      )}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => closeCart()}
                    asChild
                  >
                    <Link href="/cart">
                      Ver carrinho
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full dark:hover:text-white cursor-pointer"
                    onClick={() => closeCart()}
                  >
                    Continuar comprando
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}