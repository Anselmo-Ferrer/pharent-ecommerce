"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { products, orders, salesData } from "@/lib/mock-data"
import { Download, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const avgOrderValue = totalRevenue / orders.length
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

  // Category distribution
  const categoryData = [
    { name: "Running", value: products.filter((p) => p.category === "running").length, color: "hsl(var(--accent))" },
    { name: "Training", value: products.filter((p) => p.category === "training").length, color: "hsl(var(--chart-2))" },
    {
      name: "Basketball",
      value: products.filter((p) => p.category === "basketball").length,
      color: "hsl(var(--chart-3))",
    },
    { name: "Soccer", value: products.filter((p) => p.category === "soccer").length, color: "hsl(var(--chart-4))" },
    {
      name: "Accessories",
      value: products.filter((p) => p.category === "accessories").length,
      color: "hsl(var(--chart-5))",
    },
  ]

  // Stock value by category
  const stockValueData = [
    {
      category: "Running",
      value: products.filter((p) => p.category === "running").reduce((sum, p) => sum + p.price * p.stock, 0),
    },
    {
      category: "Training",
      value: products.filter((p) => p.category === "training").reduce((sum, p) => sum + p.price * p.stock, 0),
    },
    {
      category: "Basketball",
      value: products.filter((p) => p.category === "basketball").reduce((sum, p) => sum + p.price * p.stock, 0),
    },
    {
      category: "Soccer",
      value: products.filter((p) => p.category === "soccer").reduce((sum, p) => sum + p.price * p.stock, 0),
    },
    {
      category: "Accessories",
      value: products.filter((p) => p.category === "accessories").reduce((sum, p) => sum + p.price * p.stock, 0),
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Análise detalhada de vendas e estoque</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          {/* Sales Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12.5% vs mês anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {avgOrderValue.toFixed(2)}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +5.2% vs mês anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -2.1% vs mês anterior
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
                <CardDescription>Evolução da receita nos últimos 7 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
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
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos por Mês</CardTitle>
                <CardDescription>Volume de pedidos nos últimos 7 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
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
                    <Bar dataKey="orders" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          {/* Inventory Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Valor total do inventário</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unidades em Estoque</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStock}</div>
                <p className="text-xs text-muted-foreground mt-1">Total de unidades disponíveis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">SKUs únicos no catálogo</p>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Valor em Estoque por Categoria</CardTitle>
                <CardDescription>Distribuição do valor do inventário</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={stockValueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="category" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Produtos</CardTitle>
                <CardDescription>Produtos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produtos com Melhor Performance</CardTitle>
              <CardDescription>Top 10 produtos por receita gerada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products
                  .sort((a, b) => b.price * b.stock - a.price * a.stock)
                  .slice(0, 10)
                  .map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {(product.price * product.stock).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{product.stock} unidades</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
