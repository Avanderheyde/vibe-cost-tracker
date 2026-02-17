import { useStore } from "@/lib/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const categoryLabels: Record<string, string> = {
  llm: "LLM",
  hosting: "Hosting",
  tools: "Tools",
  saas: "SaaS",
  other: "Other",
}

export default function DashboardPage() {
  const { projects, subscriptions, getMonthlyTotal, getMonthlyTotalByProject, getTotalsByCategory } = useStore()

  const monthlyTotal = getMonthlyTotal()
  const yearlyTotal = monthlyTotal * 12
  const byCategory = getTotalsByCategory()
  const activeCount = subscriptions.filter((s) => s.isActive).length

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

      <div>
        <h2 className="mb-4 text-lg font-semibold">By Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byCategory).map(([category, total]) => (
            <Card key={category}>
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
                <Card key={project.id}>
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
    </div>
  )
}
