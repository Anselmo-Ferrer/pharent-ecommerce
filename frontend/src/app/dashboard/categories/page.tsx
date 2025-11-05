"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Categoria {
  id_categoria: number
  nome: string
  slug: string
  descricao?: string
}

export default function CategoriesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editarDialogOpen, setEditarDialogOpen] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState({ nome: "", descricao: "" })
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null)
  const [error, setError] = useState("")

  // Buscar categorias do backend
  const fetchCategorias = () => {
    fetch("http://localhost:3001/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  // Criar categoria
  const handleCreateCategoria = async () => {
    setError("")
    if (!novaCategoria.nome) {
      setError("O nome da categoria é obrigatório")
      return
    }

    try {
      const res = await fetch("http://localhost:3001/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCategoria),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Erro ao criar categoria")

      setCategorias((prev) => [...prev, data])
      setNovaCategoria({ nome: "", descricao: "" })
      setDialogOpen(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Deletar categoria
  const handleDeleteCategoria = async (id: number) => {
    if (!confirm("Deseja realmente deletar esta categoria?")) return

    try {
      const res = await fetch(`http://localhost:3001/api/categorias/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Erro ao deletar categoria")
      setCategorias((prev) => prev.filter((cat) => cat.id_categoria !== id))
    } catch (err) {
      console.error(err)
      alert("Erro ao deletar categoria")
    }
  }

  // Abrir diálogo de edição
  const handleEditClick = (categoria: Categoria) => {
    setCategoriaEditar(categoria)
    setEditarDialogOpen(true)
  }

  // Salvar edição
  const handleSaveEdit = async () => {
    if (!categoriaEditar) return
    if (!categoriaEditar.nome) {
      setError("O nome da categoria é obrigatório")
      return
    }

    try {
      const res = await fetch(`http://localhost:3001/api/categorias/${categoriaEditar.id_categoria}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: categoriaEditar.nome,
          descricao: categoriaEditar.descricao,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar categoria")
      setCategorias((prev) =>
        prev.map((cat) => (cat.id_categoria === data.id_categoria ? data : cat))
      )
      setEditarDialogOpen(false)
      setCategoriaEditar(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
          <p className="text-muted-foreground">Gerencie as categorias de produtos</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map((category) => (
                <TableRow key={category.id_categoria}>
                  <TableCell className="font-medium">{category.nome}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCategoria(category.id_categoria)}>
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

      {/* Dialog para criar categoria */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Categoria</DialogTitle>
          </DialogHeader>
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={novaCategoria.nome}
                onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input
                value={novaCategoria.descricao}
                onChange={(e) => setNovaCategoria({ ...novaCategoria, descricao: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateCategoria}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar categoria */}
      <Dialog open={editarDialogOpen} onOpenChange={setEditarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {categoriaEditar && (
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={categoriaEditar.nome}
                  onChange={(e) =>
                    setCategoriaEditar({ ...categoriaEditar, nome: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={categoriaEditar.descricao || ""}
                  onChange={(e) =>
                    setCategoriaEditar({ ...categoriaEditar, descricao: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setEditarDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}