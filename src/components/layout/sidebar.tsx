import { useState } from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, FolderOpen, CreditCard, Settings, PanelLeftClose, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      "hidden md:flex h-screen flex-col border-r bg-sidebar p-3 transition-all duration-200",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className={cn("mb-6 flex items-center gap-3 px-2", collapsed && "justify-center")}>
        <img src="/icon.svg" alt="Vibe Costs" className="h-8 w-8 rounded-lg" />
        {!collapsed && <span className="text-lg font-semibold">Vibe Costs</span>}
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-0"
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1">
        <ThemeToggle collapsed={collapsed} />
        <Button variant="ghost" size={collapsed ? "icon" : "default"} onClick={() => setCollapsed(!collapsed)} className="w-full justify-start gap-3">
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </Button>
      </div>
    </aside>
  )
}
