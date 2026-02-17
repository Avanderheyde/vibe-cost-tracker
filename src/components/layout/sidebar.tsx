import { NavLink } from "react-router-dom"
import { LayoutDashboard, FolderOpen, CreditCard, Settings } from "lucide-react"

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-muted/40 p-4">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold">Vibe Costs</h1>
        <p className="text-sm text-muted-foreground">Track your AI dev costs</p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
