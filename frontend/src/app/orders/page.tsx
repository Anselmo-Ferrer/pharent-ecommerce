"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { Package, Calendar, CreditCard, Eye, ShoppingBag } from "lucide-react"
import { getClienteId } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface ItemPedido {
  id_item: number
  quantidade: number
  preco_unitario: number
  subtotal: number
  id_produto: number
}

interface Pedido {
  id_pedido: number
  data_pedido: string
  valor_total: number
  status: string
  id_cliente: number
  itens: ItemPedido[]
  cliente?: {
    id_cliente: number
    nome: string
    email: string
  }
  pagamento?: {
    forma_pagamento: string
    status: string
  }
}

interface Produto {
  id_produto: number
  nome: string
  imagem?: string
  preco: number
}

export default function PedidosPage() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [produtos, setProdutos] = useState<Record<number, Produto>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [clienteId, setClienteId] = useState<number | null>(null)

  useEffect(() => {
    const id = getClienteId()
    if (!id) {
      router.push("/login")
      return
    }
    setClienteId(id)
    fetchPedidos(id)
  }, [router])

  const fetchPedidos = async (id: number) => {
    try {
      setIsLoading(true)
      const res = await fetch("http://localhost:3001/api/pedidos")
      const data = await res.json()

      console.log("Todos os pedidos:", data)
      console.log("ID do cliente logado:", id)

      // Filtrar apenas pedidos do cliente logado
      const pedidosCliente = data.filter((p: Pedido) => {
        // Verifica tanto o id_cliente direto quanto o objeto cliente aninhado
        const match = p.id_cliente === id || p.cliente?.id_cliente === id
        console.log(`Pedido ${p.id_pedido}: id_cliente=${p.id_cliente}, match=${match}`)
        return match
      })
      
      console.log("Pedidos filtrados:", pedidosCliente)
      
      // Ordenar pedidos do mais recente para o mais antigo
      pedidosCliente.sort((a: any, b: any) => {
        return new Date(b.data_pedido).getTime() - new Date(a.data_pedido).getTime()
      })
      
      setPedidos(pedidosCliente)

      // Buscar produtos dos pedidos
      const produtosIds = new Set<number>()
      pedidosCliente.forEach((pedido: Pedido) => {
        pedido.itens.forEach((item) => {
          produtosIds.add(item.id_produto)
        })
      })

      console.log("IDs de produtos para buscar:", Array.from(produtosIds))

      // Buscar informações dos produtos
      const produtosData: Record<number, Produto> = {}
      await Promise.all(
        Array.from(produtosIds).map(async (produtoId) => {
          try {
            const resProduto = await fetch(`http://localhost:3001/api/produtos/${produtoId}`)
            const produto = await resProduto.json()
            produtosData[produtoId] = produto
          } catch (error) {
            console.error(`Erro ao buscar produto ${produtoId}:`, error)
          }
        })
      )

      console.log("Produtos carregados:", produtosData)
      setProdutos(produtosData)
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    // Normalizar status para maiúsculo
    const statusNormalizado = status.toUpperCase()
    
    const statusConfig: Record<string, { color: string; label: string }> = {
      PENDENTE: { color: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      PROCESSANDO: { color: "bg-blue-100 text-blue-800", label: "Processando" },
      CONFIRMADO: { color: "bg-blue-100 text-blue-800", label: "Confirmado" },
      ENVIADO: { color: "bg-purple-100 text-purple-800", label: "Enviado" },
      ENTREGUE: { color: "bg-green-100 text-green-800", label: "Entregue" },
      CANCELADO: { color: "bg-red-100 text-red-800", label: "Cancelado" },
    }

    const config = statusConfig[statusNormalizado] || statusConfig.PENDENTE
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Meus Pedidos</h1>
            <p className="text-muted-foreground">
              Acompanhe o status dos seus pedidos
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando pedidos...</p>
            </div>
          )}

          {/* Sem pedidos */}
          {!isLoading && pedidos.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Nenhum pedido encontrado</h2>
                <p className="text-muted-foreground mb-6">
                  Você ainda não realizou nenhuma compra
                </p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90">
                    Começar a comprar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Lista de pedidos */}
          {!isLoading && pedidos.length > 0 && (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <Card key={pedido.id_pedido} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          Pedido #{pedido.id_pedido}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(pedido.data_pedido)}
                          </div>
                          {pedido.pagamento && (
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4" />
                              {pedido.pagamento.forma_pagamento}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        {getStatusBadge(pedido.status)}
                        <div className="text-xl font-bold">
                          R$ {Number(pedido.valor_total).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Itens do pedido */}
                    {pedido.itens.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum item neste pedido</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold mb-4">
                          <Package className="h-4 w-4" />
                          Itens ({pedido.itens.length})
                        </div>

                        {pedido.itens.map((item) => {
                          const produto = produtos[item.id_produto]
                          if (!produto) return null

                          return (
                            <div
                              key={item.id_item}
                              className="flex items-center gap-4 p-3 rounded-lg border"
                            >
                              {/* Imagem */}
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <Image
                                  src={produto.imagem || "/placeholder.svg"}
                                  alt={produto.nome}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              {/* Informações */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm mb-1">
                                  {produto.nome}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span>Qtd: {item.quantidade}</span>
                                  <span>•</span>
                                  <span>R$ {Number(item.preco_unitario).toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Subtotal */}
                              <div className="text-right">
                                <div className="font-semibold">
                                  R$ {Number(item.subtotal).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Ações */}
                    <div className="mt-6 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalhes
                      </Button>
                      {pedido.status === "ENTREGUE" && (
                        <Button variant="outline" size="sm">
                          Comprar novamente
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}