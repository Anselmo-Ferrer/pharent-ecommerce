# Sistema de Carrinho com Zustand

Este sistema implementa um gerenciamento de estado global para o carrinho de compras usando Zustand, com persistência no localStorage.

## Estrutura

### Store Principal (`cart-store.ts`)
- **Estado**: items, isOpen, isLoading
- **Ações**: addItem, removeItem, updateQuantity, clearCart, toggleCart, etc.
- **Persistência**: Automática com localStorage

### Hook Personalizado (`use-cart.ts`)
- **Funcionalidades extras**: Cálculos de preço, resumo do carrinho, verificações
- **Métodos**: addToCart, isInCart, getItemQuantity, getCartSummary

### Componentes
- **CartSidebar**: Sidebar do carrinho com lista de produtos
- **AddToCartButton**: Botão reutilizável para adicionar produtos
- **StoreHeader**: Header com contador do carrinho

## Como Usar

### 1. Adicionar produto ao carrinho
```tsx
import { useCart } from '@/hooks/use-cart'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  
  const handleAddToCart = () => {
    addToCart(product.id, 1, 'M', 'Azul')
  }
  
  return <button onClick={handleAddToCart}>Adicionar</button>
}
```

### 2. Usar o componente AddToCartButton
```tsx
import { AddToCartButton } from '@/components/add-to-cart-button'

<AddToCartButton
  productId="1"
  size="M"
  color="Azul"
  showQuantity={true}
  className="w-full"
/>
```

### 3. Acessar estado do carrinho
```tsx
import { useCartStore } from '@/stores/cart-store'

function CartCounter() {
  const { getTotalItems, items } = useCartStore()
  
  return <span>{getTotalItems()} itens</span>
}
```

### 4. Calcular resumo do carrinho
```tsx
import { useCart } from '@/hooks/use-cart'

function CartSummary() {
  const { getCartSummary } = useCart()
  const { subtotal, shipping, total, isFreeShipping } = getCartSummary()
  
  return (
    <div>
      <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
      <p>Frete: {isFreeShipping ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</p>
      <p>Total: R$ {total.toFixed(2)}</p>
    </div>
  )
}
```

## Funcionalidades

### ✅ Implementadas
- [x] Adicionar/remover produtos
- [x] Atualizar quantidades
- [x] Persistência com localStorage
- [x] Cálculos automáticos (subtotal, frete, total)
- [x] Contador de itens no header
- [x] Sidebar do carrinho
- [x] Componente reutilizável para adicionar produtos
- [x] Suporte a tamanhos e cores
- [x] Verificação se produto já está no carrinho

### 🔄 Próximas funcionalidades
- [ ] Sincronização com backend
- [ ] Carrinho por usuário logado
- [ ] Carrinho temporário para visitantes
- [ ] Notificações de adição/remoção
- [ ] Carrinho abandonado (recuperação)

## Vantagens

1. **Performance**: Estado local = respostas instantâneas
2. **UX**: Funciona offline, sincroniza depois
3. **Simplicidade**: Zustand é mais simples que Redux
4. **TypeScript**: Tipagem completa
5. **Persistência**: Dados salvos automaticamente
6. **Reutilização**: Componentes modulares

## Estrutura de Dados

```typescript
interface CartItem {
  id: string
  productId: string
  quantity: number
  size?: string
  color?: string
  addedAt: Date
}
```

## Persistência

O carrinho é automaticamente salvo no localStorage e restaurado quando o usuário retorna ao site. Apenas os itens são persistidos, não o estado da UI (isOpen, isLoading).
