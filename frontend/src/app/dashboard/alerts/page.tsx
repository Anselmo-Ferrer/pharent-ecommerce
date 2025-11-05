"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Trash2, Eye, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

interface Produto {
  id_produto: number
  nome: string
  estoque: number
  estoque_minimo: number
}

interface Alerta {
  id_alerta: number
  data_alerta: string
  mensagem: string
  visualizado: boolean
  id_produto: number
  produto: Produto
}

export default function AlertsPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAlertas = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      const response = await fetch("http://localhost:3001/api/alertas")
      
      if (!response.ok) {
        throw new Error("Erro ao buscar alertas")
      }

      const data = await response.json()
      setAlertas(data)
    } catch (err: any) {
      console.error("Erro ao buscar alertas:", err)
      setError(err.message || "Erro ao carregar alertas")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const marcarComoVisualizado = async (id_alerta: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/alertas/${id_alerta}/visualizar`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Erro ao marcar alerta como visualizado")
      }

      // Atualizar o estado local
      setAlertas(alertas.map(alerta => 
        alerta.id_alerta === id_alerta 
          ? { ...alerta, visualizado: true }
          : alerta
      ))
    } catch (err: any) {
      console.error("Erro ao marcar alerta:", err)
      alert("Erro ao marcar alerta como visualizado")
    }
  }

  const marcarTodosComoVisualizados = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/alertas/visualizar-todos", {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Erro ao marcar todos os alertas")
      }

      // Atualizar o estado local
      setAlertas(alertas.map(alerta => ({ ...alerta, visualizado: true })))
    } catch (err: any) {
      console.error("Erro ao marcar todos os alertas:", err)
      alert("Erro ao marcar todos os alertas como visualizados")
    }
  }

  const deletarAlerta = async (id_alerta: number) => {
    if (!confirm("Deseja realmente deletar este alerta?")) return

    try {
      const response = await fetch(`http://localhost:3001/api/alertas/${id_alerta}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao deletar alerta")
      }

      // Remover do estado local
      setAlertas(alertas.filter(alerta => alerta.id_alerta !== id_alerta))
    } catch (err: any) {
      console.error("Erro ao deletar alerta:", err)
      alert("Erro ao deletar alerta")
    }
  }

  useEffect(() => {
    fetchAlertas()
  }, [])

  const alertasNaoVisualizados = alertas.filter(a => !a.visualizado)
  const alertasVisualizados = alertas.filter(a => a.visualizado)

  const getSeverityColor = (estoque: number, estoque_minimo: number) => {
    if (estoque === 0) return "destructive"
    if (estoque < estoque_minimo / 2) return "destructive"
    return "default"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alertas de Estoque</h2>
          <p className="text-muted-foreground">Monitore produtos com estoque baixo</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Carregando alertas...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alertas de Estoque</h2>
          <p className="text-muted-foreground">Monitore produtos com estoque baixo</p>
        </div>
        <Card>
          <CardContent className="py-12">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4"
                  onClick={() => fetchAlertas()}
                >
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alertas de Estoque</h2>
          <p className="text-muted-foreground">Monitore produtos com estoque baixo</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAlertas(true)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          {alertasNaoVisualizados.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={marcarTodosComoVisualizados}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar todos como lidos
            </Button>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Visualizados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {alertasNaoVisualizados.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {alertasVisualizados.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alertas */}
      {alertas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum alerta de estoque!</h3>
            <p className="text-muted-foreground text-center">
              Todos os produtos estão com estoque adequado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Alertas Não Visualizados */}
          {alertasNaoVisualizados.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Alertas Não Visualizados ({alertasNaoVisualizados.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alertasNaoVisualizados.map((alerta) => (
                  <Alert
                    key={alerta.id_alerta}
                    variant={getSeverityColor(
                      alerta.produto.estoque,
                      alerta.produto.estoque_minimo
                    )}
                    className="relative"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{alerta.produto.nome}</div>
                        <div className="text-sm mb-2">{alerta.mensagem}</div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline">
                            Estoque atual: {alerta.produto.estoque}
                          </Badge>
                          <Badge variant="outline">
                            Estoque mínimo: {alerta.produto.estoque_minimo}
                          </Badge>
                          <span className="text-muted-foreground">
                            {formatDate(alerta.data_alerta)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => marcarComoVisualizado(alerta.id_alerta)}
                          title="Marcar como visualizado"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletarAlerta(alerta.id_alerta)}
                          title="Deletar alerta"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Alertas Visualizados */}
          {alertasVisualizados.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Alertas Visualizados ({alertasVisualizados.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alertasVisualizados.map((alerta) => (
                  <Alert
                    key={alerta.id_alerta}
                    variant="default"
                    className="relative opacity-60"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{alerta.produto.nome}</div>
                        <div className="text-sm mb-2">{alerta.mensagem}</div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline">
                            Estoque atual: {alerta.produto.estoque}
                          </Badge>
                          <Badge variant="outline">
                            Estoque mínimo: {alerta.produto.estoque_minimo}
                          </Badge>
                          <span className="text-muted-foreground">
                            {formatDate(alerta.data_alerta)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletarAlerta(alerta.id_alerta)}
                        title="Deletar alerta"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}