import type { Project, Subscription, StoreData, BillingCycle } from "./types"

const STORAGE_KEY = "vibe-costs-data"

type ProjectInput = Omit<Project, "id">
type SubscriptionInput = Omit<Subscription, "id">

export class Store {
  private data: StoreData

  constructor() {
    this.data = this.load()
  }

  private load(): StoreData {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return { projects: [], subscriptions: [] }
      }
    }
    return { projects: [], subscriptions: [] }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
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
    const total = cost * quantity
    return cycle === "yearly" ? total / 12 : total
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
    this.save()
  }
}
