"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface Produto {
  id: number
  name: string
  category: string
  price: number
  stock: number
}

interface Pedido {
  id_pedido: number
  valor_total: number
  status: string
  data: string
  cliente?: { nome: string }
}

export default function OverviewPage() {
  const [products, setProducts] = useState<Produto[]>([])
  const [orders, setOrders] = useState<Pedido[]>([])
  const [salesData, setSalesData] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/produtos")
      const data: Produto[] = await res.json()
      setProducts(data)
    } catch (err) {
      console.error("Erro ao buscar produtos:", err)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/pedidos")
      const data: Pedido[] = await res.json()
      setOrders(data)

      // Monta salesData por mês (exemplo simplificado)
      const monthsMap: Record<string, { revenue: number; orders: number }> = {}
      data.forEach((o) => {
        const month = new Date(o.data).toLocaleString("pt-BR", { month: "short", year: "numeric" })
        if (!monthsMap[month]) monthsMap[month] = { revenue: 0, orders: 0 }
        monthsMap[month].revenue += Number(o.valor_total)
        monthsMap[month].orders += 1
      })
      const chartData = Object.entries(monthsMap).map(([month, values]) => ({ month, ...values }))
      setSalesData(chartData)
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err)
    }
  }

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.valor_total), 0)
  const totalOrders = orders.length
  const lowStockProducts = products.filter((p) => p.stock < 30)
  const totalProducts = products.length

  // Top selling products (fake calculation)
  const topProducts = products
    .slice(0, 5)
    .map((p) => ({ ...p, sales: Math.floor(Math.random() * 50) + 5, revenue: p.price * (Math.floor(Math.random() * 50) + 5) }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">{lowStockProducts.length} com estoque baixo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {/* <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Mês</CardTitle>
            <CardDescription>Últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div> */}

      {/* Top Products */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
          <CardDescription>Top 5 produtos do mês</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} vendas</p>
                  </div>
                </div>
                <p className="font-semibold">R$ {product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Alertas de Estoque */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Alertas de Estoque</CardTitle>
          <CardDescription>Produtos com estoque baixo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                                        <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                </div>
                <Badge
                  variant={product.stock < 20 ? "destructive" : "secondary"}
                >
                  {product.stock} unidades
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Pedidos Recentes */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Últimos pedidos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders
              .slice(-5)
              .reverse()
              .map((order) => (
                <div
                  key={order.id_pedido}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">Pedido #{order.id_pedido}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.cliente?.nome || "Cliente"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold">R$ {Number(order.valor_total).toFixed(2)}</p>
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "default"
                          : order.status === "shipped"
                          ? "secondary"
                          : order.status === "processing"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {order.status === "delivered"
                        ? "Entregue"
                        : order.status === "shipped"
                        ? "Enviado"
                        : order.status === "processing"
                        ? "Processando"
                        : "Pendente"}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}