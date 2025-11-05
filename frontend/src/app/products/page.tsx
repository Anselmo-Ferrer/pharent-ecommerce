'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"

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
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get("category") || ""

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)

  const selectedCategory = categorias.find(cat => cat.slug === categorySlug)

  // Fetch categories from backend
  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/categorias")
      const data = await res.json()
      setCategorias(data)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch products, optionally by category
  const fetchProdutos = async (categoryId?: number) => {
    setLoading(true)
    try {
      const url = categoryId
        ? `http://localhost:3001/api/produtos/categoria/${categoryId}`
        : "http://localhost:3001/api/produtos"
      const res = await fetch(url)
      const data = await res.json()
      setProdutos(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // On mount, fetch categories
  useEffect(() => {
    fetchCategorias()
  }, [])

  // When selected category changes, fetch products
  useEffect(() => {
    if (selectedCategory) {
      fetchProdutos(selectedCategory.id_categoria)
    } else {
      fetchProdutos()
    }
  }, [selectedCategory])

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {selectedCategory?.nome || "Todos os Produtos"}
              </h1>
              {selectedCategory && (
                <Badge variant="secondary" className="text-sm">
                  {produtos.length} produtos
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {selectedCategory
                ? `Produtos da categoria ${selectedCategory.nome}`
                : "Descubra nossa coleção completa de equipamentos esportivos premium"}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Categories Sidebar */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="sticky top-20">
                <h3 className="font-semibold mb-4">Categorias</h3>
                <div className="space-y-2">
                  <Button
                    variant={!selectedCategory ? "default" : "ghost"}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/products">Todas as categorias</Link>
                  </Button>
                  {categorias.map((cat) => (
                    <Button
                      key={cat.id_categoria}
                      variant={selectedCategory?.id_categoria === cat.id_categoria ? "default" : "ghost"}
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={`/products?category=${cat.slug}`}>{cat.nome}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <p className="text-center text-muted-foreground">Carregando produtos...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {produtos.map((product) => (
                    <Link key={product.id_produto} href={`/products/${product.id_produto}`}>
                      <Card className="group hover:shadow-xl transition-all cursor-pointer overflow-hidden h-full py-0">
                        <CardContent className="p-0">
                          <div className="aspect-square relative bg-card mb-2">
                            <Image
                              src={product.imagem || "/placeholder.svg"}
                              alt={product.nome}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                              {product.categoria.nome}
                            </p>
                            <h3 className="font-bold mb-2">{product.nome}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold">R$ {Number(product.preco).toFixed(2)}</span>
                              <span className="text-sm text-muted-foreground">{product.estoque} em estoque</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}