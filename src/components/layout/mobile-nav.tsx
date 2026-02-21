import { NavLink } from "react-router-dom"
import { LayoutDashboard, FolderOpen, CreditCard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/subscriptions", label: "Subs", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
]

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background md:hidden">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
