'use client'

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { ArrowRight } from "lucide-react"

interface Categoria {
  id_categoria: number
  nome: string
  slug: string
  descricao?: string
}

interface Produto {
  id_produto: number
  nome: string
  descricao?: string
  preco: number
  estoque: number
  imagem?: string
  categoria: Categoria
  featured?: boolean
}

export default function HomePage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch categories from backend
  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/categorias")
      const data = await res.json()
      setCategorias(data)
    } catch (err) {
      console.error("Erro ao carregar categorias:", err)
    }
  }

  // Fetch products from backend
  const fetchProdutos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/produtos")
      const data = await res.json()
      setProdutos(data)
    } catch (err) {
      console.error("Erro ao carregar produtos:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategorias()
    fetchProdutos()
  }, [])

  // Get first 6 products as featured
  const featuredProducts = produtos.slice(0, 6)

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-black text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/athlete-running-dynamic-action.jpg"
              alt="Hero"
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
          <div className="relative container h-full flex flex-col justify-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 max-w-3xl text-balance">
              LIBERTE SEU POTENCIAL
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl text-primary">
              Equipamentos esportivos premium projetados para campeões
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white cursor-pointer w-[150px]" asChild>
                <Link href="/products">Comprar Agora</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent cursor-pointer w-[150px]"
                asChild
              >
                <Link href="/products">Explorar Coleção</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-background">
          <div className="w-full px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Comprar por Categoria</h2>
              <Button variant="ghost" asChild>
                <Link href="/products" className="gap-2">
                  Ver Todas <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {loading ? (
              <p className="text-center text-muted-foreground">Carregando categorias...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categorias.slice(0, 5).map((category) => (
                  <Link key={category.id_categoria} href={`/products?category=${category.slug}`}>
                    <Card className="group hover:shadow-lg py-0 transition-all cursor-pointer overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative bg-muted">
                          <Image
                            src="/athlete-running-dynamic-action.jpg"
                            alt={category.nome}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4 text-center">
                          <h3 className="font-semibold">{category.nome}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-muted/30">
          <div className="w-full px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Produtos em Destaque</h2>
              <Button variant="ghost" asChild>
                <Link href="/products" className="gap-2">
                  Ver Todos <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {loading ? (
              <p className="text-center text-muted-foreground">Carregando produtos...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <Link key={product.id_produto} href={`/products/${product.id_produto}`}>
                    <Card className="group hover:shadow-xl py-0 transition-all cursor-pointer overflow-hidden h-full">
                      <CardContent className="p-0">
                        <div className="aspect-square relative bg-card">
                          <Image
                            src={product.imagem || "/placeholder.svg"}
                            alt={product.nome}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-6">
                          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                            {product.categoria.nome}
                          </p>
                          <h3 className="font-bold text-lg mb-2">{product.nome}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.descricao}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">R$ {Number(product.preco).toFixed(2)}</span>
                            <Button size="sm" className="bg-accent hover:bg-accent/90">
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="w-full px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Junte-se à Comunidade Pharent</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Tenha acesso exclusivo a novos produtos, ofertas especiais e dicas de treinamento
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Cadastre-se Agora
            </Button>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  )
}