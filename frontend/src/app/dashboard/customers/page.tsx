"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, ShoppingBag, Search, UserPlus } from "lucide-react"

interface Cliente {
  id_cliente: number
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: string
  senha: string
  role: string
  totalPedidos?: number
  totalGasto?: number
}

interface Pedido {
  id_pedido: number
  id_cliente: number
  valor_total: number
}

export default function CustomersPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    // Buscar clientes
    fetch("http://localhost:3001/api/clientes")
      .then((res) => res.json())
      .then((data: Cliente[]) => {
        const customers = data.filter((c) => c.role === "customer")
        setClientes(customers)
      })
      .catch((err) => console.error("Erro ao buscar clientes:", err))

    // Buscar pedidos
    fetch("http://localhost:3001/api/pedidos")
      .then((res) => res.json())
      .then((data: Pedido[]) => setPedidos(data))
      .catch((err) => console.error("Erro ao buscar pedidos:", err))
  }, [])

  // Combinar dados de clientes com pedidos
  const clientesComPedidos = clientes.map((cliente) => {
    const pedidosCliente = pedidos.filter((p) => p.id_cliente === cliente.id_cliente)
    return {
      ...cliente,
      totalPedidos: pedidosCliente.length,
      totalGasto: pedidosCliente.reduce((sum, p) => sum + p.valor_total, 0),
    }
  })

  const filteredClientes = clientesComPedidos.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  )

  // Calcular stats com base em clientesComPedidos
  const totalClientes = clientesComPedidos.length
  const receitaTotal = clientesComPedidos.reduce(
    (sum, c) => sum + Number(c.totalGasto || 0),
    0
  )
  const ticketMedio = totalClientes > 0 ? receitaTotal / totalClientes : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de clientes</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {ticketMedio.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {receitaTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Todos os clientes cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClientes.map((cliente) => (
              <div
                key={cliente.id_cliente}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-lg">
                      {cliente.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{cliente.nome}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {cliente.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {cliente.telefone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {cliente.endereco || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{cliente.totalPedidos || 0} pedidos</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total:{" "}
                    <span className="font-semibold text-foreground">
                      R$ {Number(cliente.totalGasto || 0).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}