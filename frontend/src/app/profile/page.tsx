"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { User, Mail, Phone, MapPin, Lock, Save, AlertCircle } from "lucide-react"
import { getUser, saveUser, getClienteId } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Dados do perfil
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [telefone, setTelefone] = useState("")
  const [endereco, setEndereco] = useState("")

  // Dados de senha
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/login")
      return
    }

    // Preencher dados do usuário
    setNome(user.nome)
    setEmail(user.email)
    setCpf(user.cpf)
    setTelefone(user.telefone || "")
    setEndereco(user.endereco || "")
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    const clienteId = getClienteId()
    if (!clienteId) {
      setError("Usuário não autenticado")
      setIsSaving(false)
      return
    }

    try {
      const res = await fetch(`http://localhost:3001/api/clientes/${clienteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          cpf,
          telefone,
          endereco,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao atualizar perfil")
      }

      // Atualizar localStorage
      const user = getUser()
      if (user) {
        saveUser({
          ...user,
          nome,
          email,
          cpf,
          telefone,
          endereco,
        })
      }

      setSuccess("Perfil atualizado com sucesso!")
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setError("Preencha todos os campos de senha")
      return
    }

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem")
      return
    }

    if (novaSenha.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres")
      return
    }

    const clienteId = getClienteId()
    if (!clienteId) {
      setError("Usuário não autenticado")
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch(`http://localhost:3001/api/clientes/${clienteId}/senha`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senhaAtual,
          novaSenha,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao alterar senha")
      }

      setSuccess("Senha alterada com sucesso!")
      setSenhaAtual("")
      setNovaSenha("")
      setConfirmarSenha("")
    } catch (err: any) {
      setError(err.message || "Erro ao alterar senha")
    } finally {
      setIsSaving(false)
    }
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />

      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          {/* Alertas */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize seus dados cadastrais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome completo</Label>
                      <Input
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={formatCPF(cpf)}
                        onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
                        maxLength={14}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="telefone"
                          value={formatPhone(telefone)}
                          onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))}
                          className="pl-10"
                          maxLength={15}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="endereco"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className="pl-10"
                        placeholder="Rua, número, bairro, cidade"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Salvando..." : "Salvar alterações"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Alterar Senha */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Mantenha sua conta segura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="senhaAtual">Senha atual</Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="novaSenha">Nova senha</Label>
                      <Input
                        id="novaSenha"
                        type="password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                      <Input
                        id="confirmarSenha"
                        type="password"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        placeholder="Digite novamente"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      <Lock className="h-4 w-4 mr-2" />
                      {isSaving ? "Alterando..." : "Alterar senha"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}