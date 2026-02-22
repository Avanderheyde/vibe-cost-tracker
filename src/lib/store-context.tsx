import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { Store } from "./store"
import type { Project, Subscription } from "./types"

type ProjectInput = Omit<Project, "id">
type SubscriptionInput = Omit<Subscription, "id">

interface StoreContextValue {
  projects: Project[]
  subscriptions: Subscription[]
  addProject: (input: ProjectInput) => Project
  updateProject: (id: string, updates: Partial<ProjectInput>) => void
  deleteProject: (id: string) => void
  addSubscription: (input: SubscriptionInput) => Subscription
  updateSubscription: (id: string, updates: Partial<SubscriptionInput>) => void
  deleteSubscription: (id: string) => void
  getSubscriptionsByProject: (projectId: string | null) => Subscription[]
  getMonthlyTotal: () => number
  getMonthlyTotalByProject: (projectId: string | null) => number
  getTotalsByCategory: () => Record<string, number>
  exportData: () => string
  importData: (json: string) => void
  resetData: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

const store = new Store()

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [, setVersion] = useState(0)
  const bump = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    store.init().then(() => setReady(true))
  }, [])

  if (!ready) return null

  const value: StoreContextValue = {
    projects: store.getProjects(),
    subscriptions: store.getSubscriptions(),

    addProject: (input) => { const p = store.addProject(input); bump(); return p },
    updateProject: (id, updates) => { store.updateProject(id, updates); bump() },
    deleteProject: (id) => { store.deleteProject(id); bump() },

    addSubscription: (input) => { const s = store.addSubscription(input); bump(); return s },
    updateSubscription: (id, updates) => { store.updateSubscription(id, updates); bump() },
    deleteSubscription: (id) => { store.deleteSubscription(id); bump() },

    getSubscriptionsByProject: (projectId) => store.getSubscriptionsByProject(projectId),
    getMonthlyTotal: () => store.getMonthlyTotal(),
    getMonthlyTotalByProject: (projectId) => store.getMonthlyTotalByProject(projectId),
    getTotalsByCategory: () => store.getTotalsByCategory(),

    exportData: () => store.exportData(),
    importData: (json) => { store.importData(json); bump() },
    resetData: () => { store.resetData(); bump() },
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
