import { useMemo, useState } from "react"
import { useStore } from "@/lib/store-context"
import { categoryLabels } from "@/lib/catalog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Area, AreaChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import type { Subscription } from "@/lib/types"


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
  const { subscriptions, getMonthlyTotal, getTotalsByCategory, getMonthlyBudget, setMonthlyBudget } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogSubs, setDialogSubs] = useState<Subscription[]>([])
  const [dialogTotal, setDialogTotal] = useState(0)

  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState("")

  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const monthlyTotal = getMonthlyTotal()
  const yearlyTotal = monthlyTotal * 12
  const byCategory = getTotalsByCategory()
  const activeCount = subscriptions.filter((s) => s.isActive).length

  const upcomingRenewals = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return subscriptions
      .filter((s) => s.isActive && s.nextPaymentDate)
      .map((s) => {
        const date = new Date(s.nextPaymentDate! + "T00:00:00")
        return { ...s, parsedDate: date, overdue: date < today }
      })
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
      .slice(0, 7)
  }, [subscriptions])

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

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-primary">${monthlyTotal.toFixed(2)}</div>
            {(() => {
              const budget = getMonthlyBudget()
              if (editingBudget) {
                return (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Monthly budget"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      className="h-8 w-32"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = parseFloat(budgetInput)
                          setMonthlyBudget(isNaN(val) ? null : val)
                          setEditingBudget(false)
                        } else if (e.key === "Escape") {
                          setEditingBudget(false)
                        }
                      }}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={() => {
                      const val = parseFloat(budgetInput)
                      setMonthlyBudget(isNaN(val) ? null : val)
                      setEditingBudget(false)
                    }}>Save</Button>
                    {budget !== null && (
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                        setMonthlyBudget(null)
                        setEditingBudget(false)
                      }}>Remove</Button>
                    )}
                  </div>
                )
              }
              if (budget !== null) {
                const pct = Math.min((monthlyTotal / budget) * 100, 100)
                const over = monthlyTotal > budget
                return (
                  <button
                    className="w-full text-left"
                    onClick={() => { setBudgetInput(budget.toString()); setEditingBudget(true) }}
                  >
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${over ? "bg-destructive" : "bg-green-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className={`mt-1 text-xs ${over ? "text-destructive" : "text-muted-foreground"}`}>
                      {over ? `$${(monthlyTotal - budget).toFixed(2)} over` : `$${(budget - monthlyTotal).toFixed(2)} remaining of`} ${budget.toFixed(2)} budget
                    </div>
                  </button>
                )
              }
              return (
                <button
                  className="text-xs text-muted-foreground hover:underline"
                  onClick={() => { setBudgetInput(""); setEditingBudget(true) }}
                >
                  Set budget
                </button>
              )
            })()}
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

      {upcomingRenewals.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingRenewals.map((r) => (
              <div
                key={r.id}
                className={`flex items-center justify-between rounded-md border p-3 ${r.overdue ? "border-destructive/50 bg-destructive/5" : ""}`}
              >
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-sm text-muted-foreground">{r.provider}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{r.parsedDate.toLocaleDateString()}</div>
                  {r.overdue && <div className="text-xs font-medium text-destructive">Overdue</div>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
