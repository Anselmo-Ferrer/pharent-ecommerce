"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, Phone, MapPin, Package, Edit, Trash2, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Fornecedor {
  id_fornecedor: number
  nome: string
  cnpj: string
  telefone?: string
  email?: string
  produtos?: { id_produto: number }[]
}

export default function SuppliersPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Fornecedor | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
  })

  // Buscar fornecedores
  const fetchFornecedores = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/fornecedores")
      const data = await res.json()
      setFornecedores(data)
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchFornecedores()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOpenDialog = (fornecedor?: Fornecedor) => {
    if (fornecedor) {
      setEditingSupplier(fornecedor)
      setFormData({
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj,
        telefone: fornecedor.telefone || "",
        email: fornecedor.email || "",
      })
    } else {
      setEditingSupplier(null)
      setFormData({ nome: "", cnpj: "", telefone: "", email: "" })
    }
    setOpenDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingSupplier ? "PUT" : "POST"
      const url = editingSupplier
        ? `http://localhost:3001/api/fornecedores/${editingSupplier.id_fornecedor}`
        : "http://localhost:3001/api/fornecedores"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      setOpenDialog(false)
      fetchFornecedores()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente deletar este fornecedor?")) return
    try {
      await fetch(`http://localhost:3001/api/fornecedores/${id}`, { method: "DELETE" })
      fetchFornecedores()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie seus fornecedores</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Fornecedor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fornecedores.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fornecedores.filter(f => f.cnpj).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fornecedores.reduce((sum, f) => sum + (f.produtos?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listagem de fornecedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>Todos os fornecedores cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fornecedores.map(supplier => (
              <div key={supplier.id_fornecedor} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-lg">
                    {supplier.nome.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{supplier.nome}</p>
                      <Badge variant="default" className="text-xs">Ativo</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      {supplier.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{supplier.email}</span>}
                      {supplier.telefone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{supplier.telefone}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    {supplier.produtos?.length || 0} produtos
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(supplier)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id_fornecedor)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de criação/edição */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Editar Fornecedor" : "Adicionar Fornecedor"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label>Nome</Label>
              <Input value={formData.nome} onChange={e => handleInputChange("nome", e.target.value)} required />
            </div>
            <div>
              <Label>CNPJ</Label>
              <Input
                value={formData.cnpj}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 14) value = value.slice(0, 14);
                  value = value
                    .replace(/^(\d{2})(\d)/, "$1.$2")
                    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                    .replace(/\.(\d{3})(\d)/, ".$1/$2")
                    .replace(/(\d{4})(\d)/, "$1-$2");

                  handleInputChange("cnpj", value);
                }}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.telefone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 11) value = value.slice(0, 11);
                  if (value.length <= 10) {
                    value = value
                      .replace(/^(\d{2})(\d)/, "($1) $2")
                      .replace(/(\d{4})(\d)/, "$1-$2");
                  } else {
                    value = value
                      .replace(/^(\d{2})(\d)/, "($1) $2")
                      .replace(/(\d{5})(\d)/, "$1-$2");
                  }

                  handleInputChange("telefone", value);
                }}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={formData.email} onChange={e => handleInputChange("email", e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">{editingSupplier ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}