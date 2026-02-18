export type BillingCycle = "monthly" | "yearly"
export type Category = "llm" | "hosting" | "tools" | "saas" | "other"

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
  projectId: string | null
  isActive: boolean
}

export interface StoreData {
  projects: Project[]
  subscriptions: Subscription[]
}
