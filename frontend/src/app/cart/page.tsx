"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/stores/cart-store"
import { useCart } from "@/hooks/use-cart"
import { useState, useEffect } from "react"
import { getClienteId, isAuthenticated } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    getTotalItems,
    clearCart
  } = useCartStore()

  const router = useRouter()

  const { getProductById, isLoadingProducts } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [userId, setUserId] = useState(0)

  useEffect(() => {
    const id = getClienteId()
    if (!id) {
      router.push("/login")
      return
    }
    setUserId(id)
  }, [router])

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = getProductById(item.productId)
      return total + (product?.preco || 0) * item.quantity
    }, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shipping = subtotal > 10 ? 0 : 0
    return subtotal + shipping
  }

  const subtotal = calculateSubtotal()
  const shipping = subtotal > 10 ? 0 : 0
  const total = calculateTotal()

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    
    try {
      // Preparar os itens no formato esperado pela API
      const items = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
      }))

      const response = await fetch("http://localhost:3001/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_cliente: userId, // TODO: Substituir pelo ID do cliente logado
          items,
          valor_total: total,
          forma_pagamento: "PIX", // Você pode adicionar seleção de forma de pagamento
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao criar pedido")
      }

      const data = await response.json()
      
      alert(`Pedido #${data.pedido.id_pedido} criado com sucesso!`)
      
      // Limpar o carrinho
      clearCart()
      
      // Redirecionar para página de sucesso ou pedidos (opcional)
      // window.location.href = `/pedidos/${data.pedido.id_pedido}`
      
    } catch (error: any) {
      console.error("Erro ao finalizar compra:", error)
      alert(`Erro ao finalizar compra: ${error.message}`)
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1">
        <div className="w-full px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/products">
                  <Button variant="outline" size="sm" className="dark:hover:text-white cursor-pointer">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continuar comprando
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Carrinho</h1>
              <p className="text-muted-foreground">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'} no seu carrinho
              </p>
            </div>

            {cartItems.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
                  <p className="text-muted-foreground mb-6">
                    Adicione alguns produtos para começar sua compra
                  </p>
                  <Link href="/products">
                    <Button className="bg-primary hover:bg-primary/90">
                      Ver produtos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de produtos */}
                <div className="lg:col-span-2 space-y-4">
                  {isLoadingProducts && (
                    <div className="text-center text-muted-foreground py-8">
                      Carregando produtos...
                    </div>
                  )}
                  
                  {cartItems.map((item) => {
                    const product = getProductById(item.productId)
                    if (!product) return null

                    return (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {/* Imagem do produto */}
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={product.imagem || "/placeholder.svg"}
                                alt={product.nome}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Informações do produto */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1">{product.nome}</h3>
                              <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                                {product.descricao}
                              </p>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg font-bold">R$ {product.preco.toFixed(2)}</span>
                                {item.size && (
                                  <Badge variant="outline">Tamanho: {item.size}</Badge>
                                )}
                              </div>

                              {/* Controles de quantidade */}
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 dark:hover:bg-primary text-white cursor-pointer"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 dark:hover:bg-primary text-white cursor-pointer"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-destructive hover:text-destructive hover:dark:bg-red-300 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remover
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Resumo do pedido */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle>Resumo do pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Frete</span>
                        <span>
                          {shipping === 0 ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Grátis
                            </Badge>
                          ) : (
                            `R$ ${shipping}`
                          )}
                        </span>
                      </div>

                      {subtotal < 200 && (
                        <div className="text-sm text-muted-foreground">
                          Adicione R$ {(10 - subtotal).toFixed(2)} para frete grátis
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>R$ {total.toFixed(2)}</span>
                      </div>

                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 cursor-pointer" 
                        size="lg"
                        onClick={handleCheckout}
                        disabled={isCheckingOut || isLoadingProducts}
                      >
                        {isCheckingOut ? "Processando..." : "Finalizar compra"}
                      </Button>

                      <div className="text-center text-sm text-muted-foreground">
                        <p>Pagamento seguro</p>
                        <p>Entrega em até 5 dias úteis</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}