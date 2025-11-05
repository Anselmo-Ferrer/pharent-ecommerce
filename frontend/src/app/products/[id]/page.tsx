'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { Minus, Plus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { useCart } from "@/hooks/use-cart"
import { useParams } from "next/navigation"

interface Produto {
  id_produto: number
  nome: string
  descricao?: string
  preco: number
  estoque: number
  imagem?: string
  tamanhos?: string[]
  categoria: {
    nome: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const { id } = params
  const [product, setProduct] = useState<Produto | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const { addToCart } = useCart()

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:3001/api/produtos/${id}`)
        const data = await res.json()
        // Converte preco Decimal para number
        setProduct({ ...data, preco: Number(data.preco) })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <p className="text-center mt-20">Carregando produto...</p>
  if (!product) return <p className="text-center mt-20">Produto não encontrado</p>

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader />

      <main className="flex-1">
        <div className="container px-4 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-card rounded-lg overflow-hidden border border-border">
                <Image
                  src={product.imagem || "/placeholder.svg"}
                  alt={product.nome}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square relative bg-card rounded-lg overflow-hidden border border-border cursor-pointer hover:border-accent transition-colors"
                  >
                    <Image
                      src={product.imagem || "/placeholder.svg"}
                      alt={`${product.nome} view ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3 uppercase text-xs">
                  {product.categoria.nome}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">{product.nome}</h1>
                <div className="flex items-baseline gap-4 mb-6">
                  <p className="text-4xl font-bold">R$ {product.preco.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground line-through">
                    R$ {(product.preco * 1.2).toFixed(2)}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-lg">{product.descricao}</p>

              {product.tamanhos && product.tamanhos.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm uppercase tracking-wide">Selecione o Tamanho</span>
                    <button className="text-sm text-muted-foreground hover:text-foreground underline">
                      Guia de Tamanhos
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.tamanhos.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-4 border rounded-md font-semibold transition-all ${
                          selectedSize === size
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-sm uppercase tracking-wide">Quantidade:</span>
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.estoque, quantity + 1))}
                    disabled={quantity >= product.estoque}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Disponibilidade:</span>{" "}
                  <span className={product.estoque > 0 ? "text-green-600" : "text-red-600"}>
                    {product.estoque > 0 ? `${product.estoque} em estoque` : "Fora de estoque"}
                  </span>
                </p>
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton
                productId={String(product.id_produto)}
                size={selectedSize || undefined}
                className="w-full h-14 text-base font-semibold"
                variant="default"
                buttonSize="lg"
                showQuantity={true}
              />

              {/* Extras */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Button size="lg" variant="outline" className="h-12 bg-transparent">
                  <Heart className="mr-2 h-5 w-5" />
                  Favoritar
                </Button>
                <Button size="lg" variant="outline" className="h-12 bg-transparent">
                  <Share2 className="mr-2 h-5 w-5" />
                  Compartilhar
                </Button>
              </div>

              {/* Delivery Info */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-semibold">Frete Grátis</p>
                    <p className="text-sm text-muted-foreground">Para compras acima de R$ 10</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-semibold">Devolução Grátis</p>
                    <p className="text-sm text-muted-foreground">Até 30 dias após a compra</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-semibold">Garantia Oficial</p>
                    <p className="text-sm text-muted-foreground">1 ano de garantia do fabricante</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}