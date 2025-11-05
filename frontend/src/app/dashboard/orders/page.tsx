'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Pedido {
  id_pedido: number
  id_cliente: number
  valor_total: number
  status: string
  data?: string
  cliente?: { nome: string }  // vindo do include no backend
}

export default function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  useEffect(() => {
    fetch("http://localhost:3001/api/pedidos")
      .then((res) => res.json())
      .then((data: Pedido[]) => setPedidos(data))
      .catch((err) => console.error("Erro ao buscar pedidos:", err))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
        <p className="text-muted-foreground">Gerencie os pedidos dos clientes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((order) => (
                <TableRow key={order.id_pedido}>
                  <TableCell className="font-medium">#{order.id_pedido}</TableCell>
                  <TableCell>{order.cliente?.nome || "Cliente"}</TableCell>
                  <TableCell>{order.data ? new Date(order.data).toLocaleDateString("pt-BR") : "-"}</TableCell>
                  <TableCell>R$ {Number(order.valor_total ?? 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "CONFIRMADO"
                          ? "default"
                          : order.status === "PENDENTE"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {order.status === "CONFIRMADO"
                        ? "Concluído"
                        : order.status === "PENDENTE"
                        ? "Processando"
                        : order.status === "ENTREGUE"
                        ? "Enviado"
                        : order.status === "CANCELADO"
                        ? "Cancelado"
                        : "Pendente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}