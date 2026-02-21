import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

type Theme = "light" | "dark" | "system"

const icons: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, system: Monitor }
const next: Record<Theme, Theme> = { light: "dark", dark: "system", system: "light" }

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme()
  const Icon = icons[theme]

  return (
    <Button
      variant="ghost"
      size={collapsed ? "icon" : "default"}
      onClick={() => setTheme(next[theme])}
      className="w-full justify-start gap-3"
    >
      <Icon className="h-4 w-4" />
      {!collapsed && <span className="text-sm capitalize">{theme}</span>}
    </Button>
  )
}
