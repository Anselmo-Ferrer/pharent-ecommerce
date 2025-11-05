"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingBag, Grid3X3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"

interface Produto {
  id_produto: number
  nome: string
  imagem?: string
  id_categoria: number
}

interface Categoria {
  id_categoria: number
  nome: string
  slug: string
  descricao?: string
  produtos?: Produto[]
}

export default function CategoriesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])

  // Buscar categorias do backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const catRes = await fetch("http://localhost:3001/api/categorias")
        const catData = await catRes.json()
        setCategorias(catData)
      } catch (err) {
        console.error("Erro ao buscar categorias:", err)
      }
    }

    const fetchProdutos = async () => {
      try {
        const prodRes = await fetch("http://localhost:3001/api/produtos")
        const prodData = await prodRes.json()
        setProdutos(prodData)
      } catch (err) {
        console.error("Erro ao buscar produtos:", err)
      }
    }

    fetchCategorias()
    fetchProdutos()
  }, [])

  // Agrupar produtos por categoria
  const productsByCategory = categorias.map((category) => {
    const categoryProducts = produtos.filter(
      (product) => product.id_categoria === category.id_categoria
    )
    return {
      ...category,
      productCount: categoryProducts.length,
      products: categoryProducts.slice(0, 4), // mostrar até 4 produtos
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1">
        <div className="w-full px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Categorias</h1>
            <p className="text-muted-foreground">
              Explore nossa ampla variedade de equipamentos esportivos organizados por categoria
            </p>
          </div>

          {/* Grid de Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {productsByCategory.map((category) => (
              <Card
                key={category.id_categoria}
                className="group hover:shadow-xl transition-all py-0 duration-300 cursor-pointer overflow-hidden"
              >
                <Link href={`/products?category=${category.slug}`}>
                  <CardContent className="p-0">
                    {/* Imagem da categoria */}
                    <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-primary/5">
                      {category.products.length > 0 ? (
                        <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2">
                          {category.products.map((product) => (
                            <div
                              key={product.id_produto}
                              className="relative rounded-lg overflow-hidden"
                            >
                              {product.imagem && (
                                <Image
                                  src={product.imagem}
                                  alt={product.nome}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Grid3X3 className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Conteúdo da categoria */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {category.nome}
                        </h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {category.productCount} produtos
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4">
                        Equipamentos de {category.nome.toLowerCase()} para todos os níveis
                      </p>

                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary border hover:dark:border-primary hover:text-white transition-colors cursor-pointer"
                      >
                        Explorar categoria
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Seção de destaque */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Não encontrou o que procura?</h2>
                <p className="text-muted-foreground mb-6">
                  Explore nossa loja completa e descubra todos os produtos disponíveis
                </p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                    Ver todos os produtos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}