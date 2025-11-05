// src/lib/auth.ts

export interface User {
  id_cliente: number
  nome: string
  email: string
  cpf: string
  telefone?: string
  endereco?: string
  role: 'admin' | 'customer'
}

const USER_STORAGE_KEY = 'pharent_user'

// Salvar usuário no localStorage
export function saveUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  }
}

// Obter usuário do localStorage
export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem(USER_STORAGE_KEY)
    if (userJson) {
      try {
        return JSON.parse(userJson)
      } catch {
        return null
      }
    }
  }
  return null
}

// Remover usuário (logout)
export function removeUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY)
  }
}

// Verificar se está logado
export function isAuthenticated(): boolean {
  return getUser() !== null
}

// Obter ID do cliente logado
export function getClienteId(): number | null {
  const user = getUser()
  return user ? user.id_cliente : null
}

// Verificar se é admin
export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === 'admin'
}