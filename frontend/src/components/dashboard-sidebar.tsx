"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  AlertTriangle,
  FolderTree,
  Truck,
} from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/overview" },
  { icon: Package, label: "Produtos", href: "/dashboard/products" },
  { icon: FolderTree, label: "Categorias", href: "/dashboard/categories" },
  { icon: ShoppingCart, label: "Pedidos", href: "/dashboard/orders" },
  { icon: Users, label: "Clientes", href: "/dashboard/customers" },
  { icon: Truck, label: "Fornecedores", href: "/dashboard/suppliers" },
  { icon: AlertTriangle, label: "Alertas de Estoque", href: "/dashboard/alerts" },
  { icon: BarChart3, label: "Relatórios", href: "/dashboard/reports" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter">PHARENT</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Painel Administrativo</p>
      </div>

      <nav className="px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
