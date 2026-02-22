import type { Project, Subscription, StoreData, BillingCycle } from "./types"

const STORAGE_KEY = "vibe-costs-data"
const EMPTY: StoreData = { projects: [], subscriptions: [] }

type ProjectInput = Omit<Project, "id">
type SubscriptionInput = Omit<Subscription, "id">

export class Store {
  private data: StoreData = { projects: [], subscriptions: [] }
  private useApi = false

  async init(): Promise<void> {
    try {
      const res = await fetch("/api/data")
      if (!res.ok) throw new Error("api unavailable")
      const apiData: StoreData = await res.json()
      this.useApi = true

      // Migrate: if API is empty but localStorage has data, push it up
      const hasApiData = apiData.projects.length > 0 || apiData.subscriptions.length > 0
      if (!hasApiData) {
        const local = this.loadLocal()
        const hasLocal = local.projects.length > 0 || local.subscriptions.length > 0
        if (hasLocal) {
          this.data = local
          this.save()
          localStorage.removeItem(STORAGE_KEY)
          return
        }
      }

      this.data = apiData
    } catch {
      // API unavailable — fall back to localStorage (e.g. npm run dev without server)
      this.data = this.loadLocal()
    }
  }

  private loadLocal(): StoreData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : { ...EMPTY, projects: [], subscriptions: [] }
    } catch {
      return { projects: [], subscriptions: [] }
    }
  }

  private save(): void {
    if (this.useApi) {
      fetch("/api/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.data),
      }).catch(() => {
        // Silently fall back — data is still in memory
      })
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
    }
  }

  private generateId(): string {
    return crypto.randomUUID()
  }

  getProjects(): Project[] {
    return this.data.projects
  }

  addProject(input: ProjectInput): Project {
    const project: Project = { id: this.generateId(), ...input }
    this.data.projects.push(project)
    this.save()
    return project
  }

  updateProject(id: string, updates: Partial<ProjectInput>): void {
    const index = this.data.projects.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.data.projects[index] = { ...this.data.projects[index], ...updates }
      this.save()
    }
  }

  deleteProject(id: string): void {
    this.data.projects = this.data.projects.filter((p) => p.id !== id)
    this.data.subscriptions = this.data.subscriptions.map((s) =>
      s.projectId === id ? { ...s, projectId: null } : s
    )
    this.save()
  }

  getSubscriptions(): Subscription[] {
    return this.data.subscriptions
  }

  getSubscriptionsByProject(projectId: string | null): Subscription[] {
    return this.data.subscriptions.filter((s) => s.projectId === projectId)
  }

  addSubscription(input: SubscriptionInput): Subscription {
    const subscription: Subscription = { id: this.generateId(), ...input }
    this.data.subscriptions.push(subscription)
    this.save()
    return subscription
  }

  updateSubscription(id: string, updates: Partial<SubscriptionInput>): void {
    const index = this.data.subscriptions.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.data.subscriptions[index] = { ...this.data.subscriptions[index], ...updates }
      this.save()
    }
  }

  deleteSubscription(id: string): void {
    this.data.subscriptions = this.data.subscriptions.filter((s) => s.id !== id)
    this.save()
  }

  private toMonthly(cost: number, quantity: number, cycle: BillingCycle): number {
    // Monthly: quantity = seats, so cost * seats
    // Yearly: quantity = years prepaid, doesn't change the monthly rate
    return cycle === "yearly" ? cost / 12 : cost * quantity
  }

  getMonthlyTotal(): number {
    return this.data.subscriptions
      .filter((s) => s.isActive)
      .reduce((sum, s) => sum + this.toMonthly(s.cost, s.quantity ?? 1, s.billingCycle), 0)
  }

  getMonthlyTotalByProject(projectId: string | null): number {
    return this.data.subscriptions
      .filter((s) => s.isActive && s.projectId === projectId)
      .reduce((sum, s) => sum + this.toMonthly(s.cost, s.quantity ?? 1, s.billingCycle), 0)
  }

  getTotalsByCategory(): Record<string, number> {
    const totals: Record<string, number> = {}
    for (const sub of this.data.subscriptions.filter((s) => s.isActive)) {
      const monthly = this.toMonthly(sub.cost, sub.quantity ?? 1, sub.billingCycle)
      totals[sub.category] = (totals[sub.category] || 0) + monthly
    }
    return totals
  }

  exportData(): string {
    return JSON.stringify(this.data, null, 2)
  }

  importData(json: string): void {
    const parsed = JSON.parse(json) as StoreData
    this.data = parsed
    this.save()
  }

  resetData(): void {
    this.data = { projects: [], subscriptions: [] }
    if (this.useApi) {
      fetch("/api/data/reset", { method: "POST" }).catch(() => {})
    }
    this.save()
  }
}
