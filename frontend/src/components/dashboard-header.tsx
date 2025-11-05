import { Button } from "@/components/ui/button"
import { Bell, Settings, User } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold">Painel Administrativo</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button> */}
        <Button variant="ghost" size="icon">
          <Link href="/profile">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <User className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
