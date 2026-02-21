# UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign vibe-costs with blue/indigo accent, dark mode, responsive layout, Recharts charts, and streamlined page structure.

**Architecture:** Retheme CSS tokens to indigo, add theme toggle with localStorage persistence, rewrite sidebar to be collapsible with mobile bottom nav, add Recharts charts to dashboard, move subscription catalog into a Sheet overlay.

**Tech Stack:** React 19, Tailwind CSS v4, shadcn/ui (new-york), Recharts, react-day-picker, lucide-react

---

### Task 1: Install shadcn dependencies (sheet + chart)

**Files:**
- Create: `src/components/ui/sheet.tsx` (auto-generated)
- Create: `src/components/ui/chart.tsx` (auto-generated)

**Step 1: Install sheet component**

Run: `npx shadcn@latest add sheet --yes`

**Step 2: Install chart component**

Run: `npx shadcn@latest add chart --yes`

This installs `recharts` as a dependency and generates the chart wrapper component.

**Step 3: Verify installs**

Run: `npx tsc --noEmit`
Expected: clean

**Step 4: Commit**

```
git add src/components/ui/sheet.tsx src/components/ui/chart.tsx package.json package-lock.json
git commit -m "chore: install shadcn sheet and chart components"
```

---

### Task 2: Retheme to indigo + fix dark mode tokens

**Files:**
- Modify: `src/index.css`

**Step 1: Replace color tokens**

Replace the `:root` and `.dark` blocks in `src/index.css` with indigo-based tokens:

```css
:root {
    --radius: 0.625rem;
    --background: oklch(0.985 0.002 277);
    --foreground: oklch(0.145 0.014 277);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0.014 277);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0.014 277);
    --primary: oklch(0.585 0.233 277);
    --primary-foreground: oklch(0.985 0.002 277);
    --secondary: oklch(0.968 0.007 277);
    --secondary-foreground: oklch(0.345 0.06 277);
    --muted: oklch(0.968 0.007 277);
    --muted-foreground: oklch(0.556 0.02 277);
    --accent: oklch(0.932 0.032 277);
    --accent-foreground: oklch(0.345 0.06 277);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0.012 277);
    --input: oklch(0.922 0.012 277);
    --ring: oklch(0.585 0.233 277);
    --chart-1: oklch(0.585 0.233 277);
    --chart-2: oklch(0.65 0.18 220);
    --chart-3: oklch(0.65 0.18 155);
    --chart-4: oklch(0.75 0.15 85);
    --chart-5: oklch(0.65 0.22 15);
    --sidebar: oklch(0.97 0.005 277);
    --sidebar-foreground: oklch(0.145 0.014 277);
    --sidebar-primary: oklch(0.585 0.233 277);
    --sidebar-primary-foreground: oklch(0.985 0.002 277);
    --sidebar-accent: oklch(0.932 0.032 277);
    --sidebar-accent-foreground: oklch(0.345 0.06 277);
    --sidebar-border: oklch(0.922 0.012 277);
    --sidebar-ring: oklch(0.585 0.233 277);
}

.dark {
    --background: oklch(0.145 0.014 277);
    --foreground: oklch(0.94 0.006 277);
    --card: oklch(0.195 0.018 277);
    --card-foreground: oklch(0.94 0.006 277);
    --popover: oklch(0.195 0.018 277);
    --popover-foreground: oklch(0.94 0.006 277);
    --primary: oklch(0.65 0.22 277);
    --primary-foreground: oklch(0.145 0.014 277);
    --secondary: oklch(0.245 0.022 277);
    --secondary-foreground: oklch(0.87 0.01 277);
    --muted: oklch(0.245 0.022 277);
    --muted-foreground: oklch(0.65 0.02 277);
    --accent: oklch(0.28 0.035 277);
    --accent-foreground: oklch(0.87 0.01 277);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(0.3 0.025 277);
    --input: oklch(0.3 0.025 277);
    --ring: oklch(0.65 0.22 277);
    --chart-1: oklch(0.65 0.22 277);
    --chart-2: oklch(0.6 0.17 220);
    --chart-3: oklch(0.6 0.17 155);
    --chart-4: oklch(0.7 0.15 85);
    --chart-5: oklch(0.6 0.22 15);
    --sidebar: oklch(0.17 0.016 277);
    --sidebar-foreground: oklch(0.94 0.006 277);
    --sidebar-primary: oklch(0.65 0.22 277);
    --sidebar-primary-foreground: oklch(0.94 0.006 277);
    --sidebar-accent: oklch(0.28 0.035 277);
    --sidebar-accent-foreground: oklch(0.87 0.01 277);
    --sidebar-border: oklch(0.3 0.025 277);
    --sidebar-ring: oklch(0.65 0.22 277);
}
```

**Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: clean

**Step 3: Commit**

```
git add src/index.css
git commit -m "style: retheme to indigo with blue-tinted dark mode"
```

---

### Task 3: Add theme provider and toggle

**Files:**
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/theme-toggle.tsx`
- Modify: `src/App.tsx`
- Modify: `index.html`

**Step 1: Create theme provider**

Create `src/components/theme-provider.tsx`:

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContext>({ theme: "system", setTheme: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("vibe-costs-theme") as Theme) || "system"
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem("vibe-costs-theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
```

**Step 2: Create theme toggle**

Create `src/components/theme-toggle.tsx`:

```tsx
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

const icons = { light: Sun, dark: Moon, system: Monitor }
const next: Record<string, "light" | "dark" | "system"> = { light: "dark", dark: "system", system: "light" }

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme()
  const Icon = icons[theme]

  return (
    <Button variant="ghost" size={collapsed ? "icon" : "default"} onClick={() => setTheme(next[theme])} className="w-full justify-start gap-3">
      <Icon className="h-4 w-4" />
      {!collapsed && <span className="text-sm capitalize">{theme}</span>}
    </Button>
  )
}
```

**Step 3: Wrap App with ThemeProvider**

Modify `src/App.tsx` — wrap `StoreProvider` children with `ThemeProvider`:

```tsx
import { ThemeProvider } from "@/components/theme-provider"
// ... existing imports

function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <BrowserRouter>
          {/* ... rest unchanged */}
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  )
}
```

**Step 4: Update index.html**

Add `class="light"` to `<html>` tag and update favicon + title:

```html
<html lang="en" class="light">
  ...
  <link rel="icon" type="image/svg+xml" href="/icon.svg" />
  <title>Vibe Costs</title>
```

**Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: clean

**Step 6: Commit**

```
git add src/components/theme-provider.tsx src/components/theme-toggle.tsx src/App.tsx index.html
git commit -m "feat: add dark mode with theme provider and toggle"
```

---

### Task 4: Rewrite sidebar — collapsible with mobile bottom nav

**Files:**
- Modify: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/mobile-nav.tsx`
- Modify: `src/App.tsx`

**Step 1: Rewrite sidebar**

Replace `src/components/layout/sidebar.tsx` with:

```tsx
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
```

**Step 2: Create mobile bottom nav**

Create `src/components/layout/mobile-nav.tsx`:

```tsx
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
```

**Step 3: Update App.tsx layout**

Update `src/App.tsx` to include `MobileNav` and adjust padding:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { StoreProvider } from "@/lib/store-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import DashboardPage from "@/pages/dashboard"
import ProjectsPage from "@/pages/projects"
import SubscriptionsPage from "@/pages/subscriptions"
import SettingsPage from "@/pages/settings"

function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
            <MobileNav />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  )
}

export default App
```

**Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: clean

**Step 5: Commit**

```
git add src/components/layout/sidebar.tsx src/components/layout/mobile-nav.tsx src/App.tsx
git commit -m "feat: collapsible sidebar and mobile bottom nav"
```

---

### Task 5: Rewrite dashboard with charts

**Files:**
- Modify: `src/pages/dashboard.tsx`

**Step 1: Rewrite dashboard**

Replace `src/pages/dashboard.tsx` entirely. Key sections:

1. **Stat cards row** — Monthly Total (indigo text), Yearly Total, Active Subscriptions
2. **Charts row** — left: AreaChart of projected monthly spend (flat projection from current total), right: PieChart/donut by category
3. **Payment Calendar** — same logic as before, tighter layout
4. **Category breakdown dialog** — keep existing dialog for chart click-through

The chart data is derived from the store:
- Area chart: build 12 months of projected data from current monthly total
- Pie chart: `getTotalsByCategory()` mapped to chart segments

```tsx
import { useMemo, useState } from "react"
import { useStore } from "@/lib/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Area, AreaChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { Subscription } from "@/lib/types"

const categoryLabels: Record<string, string> = {
  llm: "LLM",
  hosting: "Hosting",
  tools: "Tools",
  monitoring: "Monitoring",
  saas: "SaaS",
  other: "Other",
}

const CHART_COLORS = [
  "oklch(0.585 0.233 277)",
  "oklch(0.65 0.18 220)",
  "oklch(0.65 0.18 155)",
  "oklch(0.75 0.15 85)",
  "oklch(0.65 0.22 15)",
]

function toMonthly(sub: Subscription): number {
  return sub.billingCycle === "yearly" ? sub.cost / 12 : sub.cost * (sub.quantity ?? 1)
}

function BreakdownList({ subs }: { subs: Subscription[] }) {
  return (
    <div className="space-y-2">
      {subs.map((sub) => (
        <div key={sub.id} className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="font-medium">{sub.name}</div>
            <div className="text-sm text-muted-foreground">{sub.provider}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">${toMonthly(sub).toFixed(2)}/mo</div>
            <div className="text-xs text-muted-foreground">
              {sub.billingCycle === "monthly"
                ? (sub.quantity ?? 1) > 1 ? `${sub.quantity} × $${sub.cost.toFixed(2)}` : `$${sub.cost.toFixed(2)}/mo`
                : (sub.quantity ?? 1) > 1 ? `$${sub.cost.toFixed(2)}/yr · ${sub.quantity} yr` : `$${sub.cost.toFixed(2)}/yr`
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { projects, subscriptions, getMonthlyTotal, getMonthlyTotalByProject, getTotalsByCategory } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogSubs, setDialogSubs] = useState<Subscription[]>([])
  const [dialogTotal, setDialogTotal] = useState(0)

  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const monthlyTotal = getMonthlyTotal()
  const yearlyTotal = monthlyTotal * 12
  const byCategory = getTotalsByCategory()
  const activeCount = subscriptions.filter((s) => s.isActive).length

  // Area chart: 12-month projection
  const areaData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      return {
        month: d.toLocaleDateString("default", { month: "short" }),
        total: monthlyTotal,
      }
    })
  }, [monthlyTotal])

  // Pie chart: category breakdown
  const pieData = useMemo(() => {
    return Object.entries(byCategory).map(([category, total]) => ({
      name: categoryLabels[category] || category,
      category,
      value: Math.round(total * 100) / 100,
    }))
  }, [byCategory])

  const openCategory = (category: string, total: number) => {
    const subs = subscriptions.filter((s) => s.isActive && s.category === category)
    setDialogTitle(categoryLabels[category] || category)
    setDialogSubs(subs)
    setDialogTotal(total)
    setDialogOpen(true)
  }

  // Calendar logic
  const subsWithDates = subscriptions.filter((s) => s.isActive && s.nextPaymentDate)

  const paymentDays = useMemo(() => {
    const days = new Set<number>()
    const viewYear = calendarMonth.getFullYear()
    const viewMonth = calendarMonth.getMonth()
    for (const sub of subsWithDates) {
      const d = new Date(sub.nextPaymentDate! + "T00:00:00")
      if (sub.billingCycle === "monthly") {
        days.add(d.getDate())
      } else {
        if (d.getMonth() === viewMonth && d.getFullYear() === viewYear) {
          days.add(d.getDate())
        }
      }
    }
    return days
  }, [subsWithDates, calendarMonth])

  const paymentDates = useMemo(() => {
    const viewYear = calendarMonth.getFullYear()
    const viewMonth = calendarMonth.getMonth()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    return Array.from(paymentDays)
      .filter((day) => day <= daysInMonth)
      .map((day) => new Date(viewYear, viewMonth, day))
  }, [paymentDays, calendarMonth])

  const selectedDateSubs = useMemo(() => {
    if (!selectedDate) return []
    const day = selectedDate.getDate()
    if (!paymentDays.has(day)) return []
    return subsWithDates.filter((sub) => {
      const d = new Date(sub.nextPaymentDate! + "T00:00:00")
      if (sub.billingCycle === "monthly") return d.getDate() === day
      return d.getDate() === day && d.getMonth() === selectedDate.getMonth()
    })
  }, [selectedDate, subsWithDates, paymentDays])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your vibe coding cost overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${monthlyTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Yearly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${yearlyTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {activeCount > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]} />
                  <Area type="monotone" dataKey="total" stroke="var(--color-primary)" fill="url(#fillTotal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">By Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      strokeWidth={2}
                      stroke="var(--color-background)"
                      onClick={(_, idx) => {
                        const entry = pieData[idx]
                        openCategory(entry.category, entry.value)
                      }}
                      className="cursor-pointer"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}/mo`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2">
                  {pieData.map((entry, i) => (
                    <button
                      key={entry.category}
                      className="flex items-center gap-2 text-left text-sm hover:underline"
                      onClick={() => openCategory(entry.category, entry.value)}
                    >
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span>{entry.name}</span>
                      <span className="text-muted-foreground">${entry.value.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Calendar */}
      {subsWithDates.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Payment Calendar</h2>
          <div className="flex flex-col gap-6 sm:flex-row">
            <Card className="w-fit">
              <CardContent className="p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  modifiers={{ payment: paymentDates }}
                  modifiersClassNames={{ payment: "bg-primary/20 font-bold text-primary" }}
                />
              </CardContent>
            </Card>
            <div className="flex-1">
              {selectedDate && selectedDateSubs.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                    Payments on {selectedDate.toLocaleDateString("default", { month: "long", day: "numeric" })}
                  </h3>
                  <div className="space-y-2">
                    {selectedDateSubs.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <div className="font-medium">{sub.name}</div>
                          <div className="text-sm text-muted-foreground">{sub.provider}</div>
                        </div>
                        <div className="text-right font-medium">
                          ${sub.cost.toFixed(2)}/{sub.billingCycle === "monthly" ? "mo" : "yr"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {selectedDate ? "No payments on this date." : "Select a highlighted date to see payments."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{dialogTitle}</span>
              <span className="text-muted-foreground">${dialogTotal.toFixed(2)}/mo</span>
            </DialogTitle>
          </DialogHeader>
          {dialogSubs.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">No active subscriptions.</p>
          ) : (
            <BreakdownList subs={dialogSubs} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: clean

**Step 3: Commit**

```
git add src/pages/dashboard.tsx
git commit -m "feat: dashboard with area chart and category donut"
```

---

### Task 6: Refactor subscriptions — catalog into Sheet

**Files:**
- Modify: `src/pages/subscriptions.tsx`

**Step 1: Refactor subscriptions page**

Key changes to `src/pages/subscriptions.tsx`:
- Add imports for `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetTrigger` from `@/components/ui/sheet`
- Add import for `BookOpen` icon from lucide-react
- Add `catalogOpen` state (`useState(false)`)
- Move the entire catalog section (Tabs + CatalogCards) into a `<Sheet>` that opens from the right
- Add a "Next Payment" column to the table
- Header becomes: title + "Add Custom" + "Browse Catalog" buttons

The catalog `Sheet` should:
- Open from the right side (`side="right"`)
- Contain the project selector, category tabs, and catalog cards
- When a catalog item is added (`handleAddFromCatalog`), close the sheet (`setCatalogOpen(false)`) before opening the dialog

Table additions:
- New `<TableHead>Next Payment</TableHead>` column after Cost
- New `<TableCell>` showing `sub.nextPaymentDate ? new Date(sub.nextPaymentDate + "T00:00:00").toLocaleDateString() : "—"`

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: clean

**Step 3: Commit**

```
git add src/pages/subscriptions.tsx
git commit -m "feat: move catalog to sheet overlay, add next payment column"
```

---

### Task 7: Update projects page — add cost summary card

**Files:**
- Modify: `src/pages/projects.tsx`

**Step 1: Add summary card**

Add a cost summary card above the table. After the header `<div>` and before the empty-state / table conditional:

```tsx
{projects.length > 0 && (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">Total Monthly Cost</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-primary">
        ${projects.reduce((sum, p) => sum + getMonthlyTotalByProject(p.id), 0).toFixed(2)}
      </div>
    </CardContent>
  </Card>
)}
```

Also add `CardHeader, CardTitle` to the Card import (already imported: `Card, CardContent`).

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: clean

**Step 3: Commit**

```
git add src/pages/projects.tsx
git commit -m "feat: add cost summary card to projects page"
```

---

### Task 8: Update settings page — add theme section

**Files:**
- Modify: `src/pages/settings.tsx`

**Step 1: Add theme section**

Add a Theme card at the top of the settings page, before the Export card. Import `useTheme` and add three buttons for light/dark/system:

```tsx
import { useTheme } from "@/components/theme-provider"
import { Sun, Moon, Monitor } from "lucide-react"

// Inside the component:
const { theme, setTheme } = useTheme()

// Before the Export card:
<Card>
  <CardHeader>
    <CardTitle>Theme</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex gap-2">
      {([["light", Sun, "Light"], ["dark", Moon, "Dark"], ["system", Monitor, "System"]] as const).map(([value, Icon, label]) => (
        <Button
          key={value}
          variant={theme === value ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme(value)}
        >
          <Icon className="mr-2 h-4 w-4" /> {label}
        </Button>
      ))}
    </div>
  </CardContent>
</Card>
```

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: clean

**Step 3: Commit**

```
git add src/pages/settings.tsx
git commit -m "feat: add theme picker to settings page"
```

---

### Task 9: Final verification and cleanup

**Step 1: Run full type check**

Run: `npx tsc --noEmit`
Expected: clean

**Step 2: Run tests**

Run: `npx vitest run`
Expected: all tests pass (store tests are unaffected by UI changes)

**Step 3: Remove unused vite.svg**

The favicon was changed to icon.svg. Delete `public/vite.svg` if it exists.

Run: `rm public/vite.svg`

**Step 4: Commit and push**

```
git add -A
git commit -m "chore: remove old favicon"
git push
```
