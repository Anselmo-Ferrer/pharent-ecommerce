"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Produto {
  id_produto: number
  nome: string
  descricao?: string
  preco: number
  imagem?: string
  estoque: number
  estoque_minimo: number
  id_categoria: number
  id_fornecedor: number
  categoria: { nome: string; slug: string }
  fornecedor?: { nome: string }
}

interface Categoria {
  id_categoria: number
  nome: string
  slug: string
}

interface Fornecedor {
  id_fornecedor: number
  nome: string
}

export default function ProductsManagementPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    estoque: 0,
    estoque_minimo: 0,
    id_categoria: 0,
    id_fornecedor: 0,
  })

  useEffect(() => {
    fetchProdutos()
    fetchCategorias()
    fetchFornecedores()
  }, [])

  const fetchProdutos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/produtos")
      const data = await res.json()
      setProdutos(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/categorias")
      const data = await res.json()
      setCategorias(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFornecedores = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/fornecedores")
      const data = await res.json()
      setFornecedores(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOpenDialog = (produto?: Produto) => {
    if (produto) {
      setEditingProduct(produto)
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao || "",
        preco: produto.preco,
        estoque: produto.estoque,
        estoque_minimo: produto.estoque_minimo,
        id_categoria: produto.id_categoria,
        id_fornecedor: produto.id_fornecedor,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        nome: "",
        descricao: "",
        preco: 0,
        estoque: 0,
        estoque_minimo: 0,
        id_categoria: categorias[0]?.id_categoria || 1,
        id_fornecedor: fornecedores[0]?.id_fornecedor || 1,
      })
    }
    setOpenDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingProduct ? "PUT" : "POST"
      const url = editingProduct
        ? `http://localhost:3001/api/produtos/${editingProduct.id_produto}`
        : "http://localhost:3001/api/produtos"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      setOpenDialog(false)
      fetchProdutos()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente deletar este produto?")) return
    try {
      await fetch(`http://localhost:3001/api/produtos/${id}`, { method: "DELETE" })
      fetchProdutos()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">Gerencie seu inventário de produtos</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((product) => (
                <TableRow key={product.id_produto}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                      {product?.imagem ? (
                        <Image src={product.imagem} alt={product.nome} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.nome}</TableCell>
                  <TableCell className="capitalize">{product.categoria?.nome}</TableCell>
                  <TableCell>{product.fornecedor?.nome}</TableCell>
                  <TableCell>R$ {Number(product.preco).toFixed(2)}</TableCell>
                  <TableCell>{product.estoque}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        product.estoque > 50
                          ? "bg-green-100 text-green-700"
                          : product.estoque > 20
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.estoque > 50 ? "Em Estoque" : product.estoque > 0 ? "Estoque Baixo" : "Sem Estoque"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id_produto)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label>Nome</Label>
              <Input value={formData.nome} onChange={(e) => handleInputChange("nome", e.target.value)} required />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input value={formData.descricao} onChange={(e) => handleInputChange("descricao", e.target.value)} />
            </div>
            <div>
              <Label>Preço</Label>
              <Input
                type="number"
                value={formData.preco}
                onChange={(e) => handleInputChange("preco", parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label>Estoque</Label>
              <Input
                type="number"
                value={formData.estoque}
                onChange={(e) => handleInputChange("estoque", parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label>Estoque mínimo</Label>
              <Input
                type="number"
                value={formData.estoque_minimo}
                onChange={(e) => handleInputChange("estoque_minimo", parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label>Categoria</Label>
              <Select
                value={formData.id_categoria.toString()}
                onValueChange={(val) => handleInputChange("id_categoria", parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id_categoria} value={cat.id_categoria.toString()}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fornecedor</Label>
              <Select
                value={formData.id_fornecedor.toString()}
                onValueChange={(val) => handleInputChange("id_fornecedor", parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {fornecedores.map((f) => (
                    <SelectItem key={f.id_fornecedor} value={f.id_fornecedor.toString()}>
                      {f.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">{editingProduct ? "Salvar" : "Criar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}