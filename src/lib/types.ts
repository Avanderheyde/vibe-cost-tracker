export type BillingCycle = "monthly" | "yearly"
export type Category =
  | "ai-models"
  | "ai-coding"
  | "ai-media"
  | "database"
  | "cloud"
  | "hosting"
  | "services"
  | "incorporation"
  | "marketing"
  | "monitoring"
  | "design"
  | "productivity"
  | "dev-tools"
  | "domains"
  | "security"

export interface Project {
  id: string
  name: string
  description: string
  color: string
}

export interface Subscription {
  id: string
  name: string
  provider: string
  cost: number
  quantity: number
  billingCycle: BillingCycle
  category: Category
  nextPaymentDate: string | null
  projectId: string | null
  isActive: boolean
}

export interface TopUp {
  id: string
  subscriptionId: string
  amount: number
  date: string // ISO date e.g. "2026-03-15"
  note: string
}

export interface StoreData {
  projects: Project[]
  subscriptions: Subscription[]
  topUps?: TopUp[]
  budgets?: { monthly?: number | null; byProject?: Record<string, number> }
}
