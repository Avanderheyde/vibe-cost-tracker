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
import type { Subscription } from "@/lib/types"

const categoryLabels: Record<string, string> = {
  llm: "LLM",
  hosting: "Hosting",
  tools: "Tools",
  monitoring: "Monitoring",
  saas: "SaaS",
  other: "Other",
}

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

  const openCategory = (category: string, total: number) => {
    const subs = subscriptions.filter((s) => s.isActive && s.category === category)
    setDialogTitle(categoryLabels[category] || category)
    setDialogSubs(subs)
    setDialogTotal(total)
    setDialogOpen(true)
  }

  const openProject = (projectId: string, projectName: string, total: number) => {
    const subs = subscriptions.filter((s) => s.isActive && s.projectId === projectId)
    setDialogTitle(projectName)
    setDialogSubs(subs)
    setDialogTotal(total)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your vibe coding cost overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${monthlyTotal.toFixed(2)}</div>
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

      <div>
        <h2 className="mb-4 text-lg font-semibold">By Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byCategory).map(([category, total]) => (
            <Card key={category} className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => openCategory(category, total)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {categoryLabels[category] || category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${total.toFixed(2)}/mo</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">By Project</h2>
        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet. Add one from the Projects page.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const projectTotal = getMonthlyTotalByProject(project.id)
              const projectSubs = subscriptions.filter((s) => s.projectId === project.id && s.isActive)
              return (
                <Card key={project.id} className="cursor-pointer transition-colors hover:bg-muted/50" onClick={() => openProject(project.id, project.name, projectTotal)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <CardTitle className="text-sm font-medium">{project.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${projectTotal.toFixed(2)}/mo</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {projectSubs.map((sub) => (
                        <Badge key={sub.id} variant="secondary" className="text-xs">
                          {sub.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

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
