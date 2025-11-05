"use client"

import Link from "next/link"
import { ShoppingCart, Search, Menu, User, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartSidebar } from "@/components/cart-sidebar"
import { useCartStore } from "@/stores/cart-store"
import { UserMenu } from "./user-menu"

export function StoreHeader() {
  const { getTotalItems } = useCartStore()
  const cartCount = getTotalItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tighter">PHARENT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
              Início
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-accent transition-colors">
              Produtos
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-accent transition-colors">
              Categorias
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar produtos..." className="w-[200px] lg:w-[300px] pl-8" />
            </div>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <CartSidebar>
            <Button className="relative" variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </CartSidebar>

          <Link className="cursor-pointer" href="/dashboard">
            <Button className="cursor-pointer" variant="ghost" size="icon">
              <LayoutDashboard className="h-5 w-5" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <UserMenu />
        </div>
      </div>
    </header>
  )
}
