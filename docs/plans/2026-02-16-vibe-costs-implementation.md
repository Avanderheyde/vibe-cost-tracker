# Vibe Costs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an open-source, local-first dashboard to track vibe coding subscription costs grouped by project.

**Architecture:** Vite + React SPA with react-router for navigation. Data persisted in localStorage. shadcn/ui components for the dashboard UI. Static service catalog for quick-add subscriptions. JSON export/import for portability.

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, react-router-dom, Vitest, React Testing Library

---

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: entire project scaffold

**Step 1: Create the Vite project**

Run:
```bash
npm create vite@latest . -- --template react-ts
```

(Use `.` since we're already in the `vibe-costs` directory.)

**Step 2: Install dependencies**

Run: `npm install`

**Step 3: Verify it runs**

Run: `npm run dev`
Expected: Dev server starts, default Vite React page renders.

**Step 4: Clean up boilerplate**

Delete `src/App.css`. Empty out `src/App.tsx` to:

```tsx
function App() {
  return <div>Vibe Costs</div>
}

export default App
```

**Step 5: Commit**

```bash
git add -A
git commit -m "scaffold: Vite + React + TypeScript project"
```

---

### Task 2: Add Tailwind CSS v4 + shadcn/ui

**Files:**
- Modify: `vite.config.ts`
- Modify: `tsconfig.json`
- Modify: `tsconfig.app.json`
- Modify: `src/index.css`
- Create: `components.json` (via shadcn init)
- Create: `src/lib/utils.ts` (via shadcn init)

**Step 1: Install Tailwind CSS v4**

Run:
```bash
npm install tailwindcss @tailwindcss/vite
```

**Step 2: Install @types/node**

Run: `npm install -D @types/node`

**Step 3: Configure vite.config.ts**

Replace `vite.config.ts` with:

```ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**Step 4: Configure TypeScript path aliases**

Add to `tsconfig.json` compilerOptions:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Add the same `baseUrl` and `paths` to `tsconfig.app.json` compilerOptions.

**Step 5: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init
```

Select: New York style, Neutral base color.

This will update `src/index.css` with CSS variables and create `components.json` and `src/lib/utils.ts`.

**Step 6: Add initial shadcn components we'll need**

Run:
```bash
npx shadcn@latest add button card dialog input label select badge separator
```

**Step 7: Verify Tailwind + shadcn work**

Update `src/App.tsx` to:

```tsx
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button>Vibe Costs</Button>
    </div>
  )
}

export default App
```

Run: `npm run dev`
Expected: Styled button renders in center of page.

**Step 8: Commit**

```bash
git add -A
git commit -m "setup: Tailwind CSS v4 + shadcn/ui"
```

---

### Task 3: Add Vitest + React Testing Library

**Files:**
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`
- Modify: `package.json`
- Create: `src/setupTests.ts`

**Step 1: Install test dependencies**

Run:
```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

**Step 2: Add test config to vite.config.ts**

Add a `/// <reference types="vitest/config" />` at the top and add the `test` block:

```ts
/// <reference types="vitest/config" />
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
})
```

**Step 3: Create src/setupTests.ts**

```ts
import { expect, afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import * as matchers from "@testing-library/jest-dom/matchers"

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
```

**Step 4: Add types to tsconfig.app.json**

Add to `compilerOptions`:
```json
"types": ["vitest/globals", "@testing-library/jest-dom"]
```

**Step 5: Add test scripts to package.json**

```json
"test": "vitest",
"test:run": "vitest run"
```

**Step 6: Verify tests work**

Create a quick smoke test at `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import App from "./App"

describe("App", () => {
  it("renders", () => {
    render(<App />)
    expect(screen.getByText("Vibe Costs")).toBeInTheDocument()
  })
})
```

Run: `npm run test:run`
Expected: 1 test passes.

**Step 7: Commit**

```bash
git add -A
git commit -m "setup: Vitest + React Testing Library"
```

---

### Task 4: Data types + localStorage persistence layer

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/store.ts`
- Create: `src/lib/store.test.ts`

**Step 1: Write the failing tests**

Create `src/lib/store.test.ts`:

```ts
import { Store } from "./store"
import type { Project, Subscription } from "./types"

describe("Store", () => {
  let store: Store

  beforeEach(() => {
    localStorage.clear()
    store = new Store()
  })

  describe("projects", () => {
    it("starts empty", () => {
      expect(store.getProjects()).toEqual([])
    })

    it("adds a project", () => {
      const project = store.addProject({ name: "My SaaS", description: "Side project", color: "#3b82f6" })
      expect(project.id).toBeDefined()
      expect(project.name).toBe("My SaaS")
      expect(store.getProjects()).toHaveLength(1)
    })

    it("updates a project", () => {
      const project = store.addProject({ name: "Old", description: "", color: "#000" })
      store.updateProject(project.id, { name: "New" })
      expect(store.getProjects()[0].name).toBe("New")
    })

    it("deletes a project and unassigns its subscriptions", () => {
      const project = store.addProject({ name: "Test", description: "", color: "#000" })
      const sub = store.addSubscription({
        name: "Vercel Pro", provider: "Vercel", cost: 20,
        billingCycle: "monthly", category: "hosting", projectId: project.id, isActive: true,
      })
      store.deleteProject(project.id)
      expect(store.getProjects()).toHaveLength(0)
      expect(store.getSubscriptions()[0].projectId).toBeNull()
    })

    it("persists across instances", () => {
      store.addProject({ name: "Persisted", description: "", color: "#000" })
      const store2 = new Store()
      expect(store2.getProjects()).toHaveLength(1)
      expect(store2.getProjects()[0].name).toBe("Persisted")
    })
  })

  describe("subscriptions", () => {
    it("starts empty", () => {
      expect(store.getSubscriptions()).toEqual([])
    })

    it("adds a subscription", () => {
      const sub = store.addSubscription({
        name: "Claude Pro", provider: "Anthropic", cost: 20,
        billingCycle: "monthly", category: "llm", projectId: null, isActive: true,
      })
      expect(sub.id).toBeDefined()
      expect(store.getSubscriptions()).toHaveLength(1)
    })

    it("updates a subscription", () => {
      const sub = store.addSubscription({
        name: "Old", provider: "X", cost: 10,
        billingCycle: "monthly", category: "other", projectId: null, isActive: true,
      })
      store.updateSubscription(sub.id, { cost: 25 })
      expect(store.getSubscriptions()[0].cost).toBe(25)
    })

    it("deletes a subscription", () => {
      const sub = store.addSubscription({
        name: "Test", provider: "X", cost: 10,
        billingCycle: "monthly", category: "other", projectId: null, isActive: true,
      })
      store.deleteSubscription(sub.id)
      expect(store.getSubscriptions()).toHaveLength(0)
    })

    it("gets subscriptions by project", () => {
      const project = store.addProject({ name: "P1", description: "", color: "#000" })
      store.addSubscription({
        name: "A", provider: "X", cost: 10,
        billingCycle: "monthly", category: "other", projectId: project.id, isActive: true,
      })
      store.addSubscription({
        name: "B", provider: "Y", cost: 20,
        billingCycle: "monthly", category: "other", projectId: null, isActive: true,
      })
      expect(store.getSubscriptionsByProject(project.id)).toHaveLength(1)
      expect(store.getSubscriptionsByProject(null)).toHaveLength(1)
    })
  })

  describe("calculations", () => {
    it("calculates monthly total for active subs only", () => {
      store.addSubscription({
        name: "A", provider: "X", cost: 20,
        billingCycle: "monthly", category: "llm", projectId: null, isActive: true,
      })
      store.addSubscription({
        name: "B", provider: "Y", cost: 120,
        billingCycle: "yearly", category: "tools", projectId: null, isActive: true,
      })
      store.addSubscription({
        name: "C", provider: "Z", cost: 50,
        billingCycle: "monthly", category: "other", projectId: null, isActive: false,
      })
      // 20 + (120/12) + 0 (inactive) = 30
      expect(store.getMonthlyTotal()).toBe(30)
    })

    it("calculates monthly total per project", () => {
      const p = store.addProject({ name: "P", description: "", color: "#000" })
      store.addSubscription({
        name: "A", provider: "X", cost: 20,
        billingCycle: "monthly", category: "llm", projectId: p.id, isActive: true,
      })
      store.addSubscription({
        name: "B", provider: "Y", cost: 10,
        billingCycle: "monthly", category: "tools", projectId: null, isActive: true,
      })
      expect(store.getMonthlyTotalByProject(p.id)).toBe(20)
    })

    it("calculates totals by category", () => {
      store.addSubscription({
        name: "A", provider: "X", cost: 20,
        billingCycle: "monthly", category: "llm", projectId: null, isActive: true,
      })
      store.addSubscription({
        name: "B", provider: "Y", cost: 10,
        billingCycle: "monthly", category: "llm", projectId: null, isActive: true,
      })
      store.addSubscription({
        name: "C", provider: "Z", cost: 25,
        billingCycle: "monthly", category: "hosting", projectId: null, isActive: true,
      })
      const byCategory = store.getTotalsByCategory()
      expect(byCategory.llm).toBe(30)
      expect(byCategory.hosting).toBe(25)
    })
  })

  describe("export/import", () => {
    it("exports and imports data", () => {
      store.addProject({ name: "Exported", description: "test", color: "#fff" })
      store.addSubscription({
        name: "Sub", provider: "P", cost: 15,
        billingCycle: "monthly", category: "tools", projectId: null, isActive: true,
      })
      const json = store.exportData()
      localStorage.clear()
      const store2 = new Store()
      expect(store2.getProjects()).toHaveLength(0)
      store2.importData(json)
      expect(store2.getProjects()).toHaveLength(1)
      expect(store2.getSubscriptions()).toHaveLength(1)
    })

    it("resets all data", () => {
      store.addProject({ name: "Gone", description: "", color: "#000" })
      store.resetData()
      expect(store.getProjects()).toHaveLength(0)
      expect(store.getSubscriptions()).toHaveLength(0)
    })
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:run`
Expected: FAIL — modules don't exist yet.

**Step 3: Create src/lib/types.ts**

```ts
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
  billingCycle: BillingCycle
  category: Category
  projectId: string | null
  isActive: boolean
}

export interface StoreData {
  projects: Project[]
  subscriptions: Subscription[]
}
```

**Step 4: Create src/lib/store.ts**

```ts
import type { Project, Subscription, StoreData, BillingCycle, Category } from "./types"

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

  // Projects

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

  // Subscriptions

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

  // Calculations

  private toMonthly(cost: number, cycle: BillingCycle): number {
    return cycle === "yearly" ? cost / 12 : cost
  }

  getMonthlyTotal(): number {
    return this.data.subscriptions
      .filter((s) => s.isActive)
      .reduce((sum, s) => sum + this.toMonthly(s.cost, s.billingCycle), 0)
  }

  getMonthlyTotalByProject(projectId: string | null): number {
    return this.data.subscriptions
      .filter((s) => s.isActive && s.projectId === projectId)
      .reduce((sum, s) => sum + this.toMonthly(s.cost, s.billingCycle), 0)
  }

  getTotalsByCategory(): Record<string, number> {
    const totals: Record<string, number> = {}
    for (const sub of this.data.subscriptions.filter((s) => s.isActive)) {
      const monthly = this.toMonthly(sub.cost, sub.billingCycle)
      totals[sub.category] = (totals[sub.category] || 0) + monthly
    }
    return totals
  }

  // Export/Import

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
```

**Step 5: Run tests to verify they pass**

Run: `npm run test:run`
Expected: All tests pass.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: data types and localStorage persistence layer"
```

---

### Task 5: Service catalog

**Files:**
- Create: `src/lib/catalog.ts`
- Create: `src/lib/catalog.test.ts`

**Step 1: Write the failing test**

Create `src/lib/catalog.test.ts`:

```ts
import { catalog, getCatalogByCategory } from "./catalog"

describe("catalog", () => {
  it("has entries", () => {
    expect(catalog.length).toBeGreaterThan(0)
  })

  it("every entry has required fields", () => {
    for (const item of catalog) {
      expect(item.name).toBeTruthy()
      expect(item.provider).toBeTruthy()
      expect(item.category).toBeTruthy()
      expect(typeof item.cost).toBe("number")
      expect(["monthly", "yearly"]).toContain(item.billingCycle)
    }
  })

  it("filters by category", () => {
    const llm = getCatalogByCategory("llm")
    expect(llm.length).toBeGreaterThan(0)
    expect(llm.every((item) => item.category === "llm")).toBe(true)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/lib/catalog.test.ts`
Expected: FAIL — module doesn't exist.

**Step 3: Create src/lib/catalog.ts**

```ts
import type { BillingCycle, Category } from "./types"

export interface CatalogItem {
  name: string
  provider: string
  cost: number
  billingCycle: BillingCycle
  category: Category
}

export const catalog: CatalogItem[] = [
  // LLM
  { name: "Claude Pro", provider: "Anthropic", cost: 20, billingCycle: "monthly", category: "llm" },
  { name: "Claude Max (5x)", provider: "Anthropic", cost: 100, billingCycle: "monthly", category: "llm" },
  { name: "Claude Max (20x)", provider: "Anthropic", cost: 200, billingCycle: "monthly", category: "llm" },
  { name: "ChatGPT Plus", provider: "OpenAI", cost: 20, billingCycle: "monthly", category: "llm" },
  { name: "ChatGPT Pro", provider: "OpenAI", cost: 200, billingCycle: "monthly", category: "llm" },
  { name: "Gemini Advanced", provider: "Google", cost: 20, billingCycle: "monthly", category: "llm" },

  // Tools
  { name: "Cursor Pro", provider: "Cursor", cost: 20, billingCycle: "monthly", category: "tools" },
  { name: "Windsurf Pro", provider: "Codeium", cost: 15, billingCycle: "monthly", category: "tools" },
  { name: "GitHub Copilot", provider: "GitHub", cost: 10, billingCycle: "monthly", category: "tools" },
  { name: "Tailscale Personal Plus", provider: "Tailscale", cost: 6, billingCycle: "monthly", category: "tools" },
  { name: "Warp Terminal", provider: "Warp", cost: 15, billingCycle: "monthly", category: "tools" },

  // Hosting
  { name: "Supabase Pro", provider: "Supabase", cost: 25, billingCycle: "monthly", category: "hosting" },
  { name: "Vercel Pro", provider: "Vercel", cost: 20, billingCycle: "monthly", category: "hosting" },
  { name: "Netlify Pro", provider: "Netlify", cost: 19, billingCycle: "monthly", category: "hosting" },
  { name: "Railway Pro", provider: "Railway", cost: 5, billingCycle: "monthly", category: "hosting" },
  { name: "Fly.io", provider: "Fly.io", cost: 5, billingCycle: "monthly", category: "hosting" },
  { name: "Cloudflare Pro", provider: "Cloudflare", cost: 20, billingCycle: "monthly", category: "hosting" },

  // SaaS
  { name: "Notion Plus", provider: "Notion", cost: 10, billingCycle: "monthly", category: "saas" },
  { name: "Eleven Labs Starter", provider: "Eleven Labs", cost: 5, billingCycle: "monthly", category: "saas" },
  { name: "Eleven Labs Creator", provider: "Eleven Labs", cost: 22, billingCycle: "monthly", category: "saas" },
  { name: "Google Workspace Starter", provider: "Google", cost: 7.20, billingCycle: "monthly", category: "saas" },
  { name: "Figma Professional", provider: "Figma", cost: 15, billingCycle: "monthly", category: "saas" },
  { name: "Linear Standard", provider: "Linear", cost: 8, billingCycle: "monthly", category: "saas" },
  { name: "Sentry Team", provider: "Sentry", cost: 26, billingCycle: "monthly", category: "saas" },
]

export function getCatalogByCategory(category: Category): CatalogItem[] {
  return catalog.filter((item) => item.category === category)
}
```

**Step 4: Run tests to verify they pass**

Run: `npm run test:run`
Expected: All tests pass.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: pre-populated service catalog"
```

---

### Task 6: React context + hooks for store

**Files:**
- Create: `src/lib/store-context.tsx`

This wraps the Store class in React state so components re-render on changes.

**Step 1: Create src/lib/store-context.tsx**

```tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { Store } from "./store"
import type { Project, Subscription, Category, BillingCycle } from "./types"

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
  const [, setVersion] = useState(0)
  const bump = useCallback(() => setVersion((v) => v + 1), [])

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
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: React context wrapper for store"
```

---

### Task 7: Routing + app shell layout

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/pages/dashboard.tsx`
- Create: `src/pages/projects.tsx`
- Create: `src/pages/subscriptions.tsx`
- Create: `src/pages/settings.tsx`

**Step 1: Install react-router-dom and lucide-react**

Run:
```bash
npm install react-router-dom lucide-react
```

**Step 2: Create placeholder pages**

Create `src/pages/dashboard.tsx`:
```tsx
export default function DashboardPage() {
  return <div><h1 className="text-2xl font-bold">Dashboard</h1></div>
}
```

Create `src/pages/projects.tsx`:
```tsx
export default function ProjectsPage() {
  return <div><h1 className="text-2xl font-bold">Projects</h1></div>
}
```

Create `src/pages/subscriptions.tsx`:
```tsx
export default function SubscriptionsPage() {
  return <div><h1 className="text-2xl font-bold">Subscriptions</h1></div>
}
```

Create `src/pages/settings.tsx`:
```tsx
export default function SettingsPage() {
  return <div><h1 className="text-2xl font-bold">Settings</h1></div>
}
```

**Step 3: Create sidebar component**

Create `src/components/layout/sidebar.tsx`:

```tsx
import { NavLink } from "react-router-dom"
import { LayoutDashboard, FolderOpen, CreditCard, Settings } from "lucide-react"

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-muted/40 p-4">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold">Vibe Costs</h1>
        <p className="text-sm text-muted-foreground">Track your AI dev costs</p>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
```

**Step 4: Wire up App.tsx with router and layout**

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { StoreProvider } from "@/lib/store-context"
import { Sidebar } from "@/components/layout/sidebar"
import DashboardPage from "@/pages/dashboard"
import ProjectsPage from "@/pages/projects"
import SubscriptionsPage from "@/pages/subscriptions"
import SettingsPage from "@/pages/settings"

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto p-8">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
```

**Step 5: Update src/App.test.tsx**

```tsx
import { render, screen } from "@testing-library/react"
import App from "./App"

describe("App", () => {
  it("renders sidebar with navigation", () => {
    render(<App />)
    expect(screen.getByText("Vibe Costs")).toBeInTheDocument()
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Projects")).toBeInTheDocument()
    expect(screen.getByText("Subscriptions")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })
})
```

**Step 6: Run tests and verify dev server**

Run: `npm run test:run`
Expected: All tests pass.

Run: `npm run dev`
Expected: Sidebar with nav links, pages switch on click.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: routing and app shell layout with sidebar"
```

---

### Task 8: Dashboard page

**Files:**
- Modify: `src/pages/dashboard.tsx`

**Step 1: Implement the dashboard**

```tsx
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

      {/* Top-level totals */}
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

      {/* By category */}
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

      {/* By project */}
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
```

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Dashboard shows $0.00 totals, "No projects yet" message. Will populate once we add data through other pages.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: dashboard page with cost overview"
```

---

### Task 9: Projects page (CRUD)

**Files:**
- Modify: `src/pages/projects.tsx`

Add the `table` and `dropdown-menu` shadcn components first:

```bash
npx shadcn@latest add table dropdown-menu
```

**Step 1: Implement projects page**

```tsx
import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

const defaultColors = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"]

export default function ProjectsPage() {
  const { projects, subscriptions, addProject, updateProject, deleteProject, getMonthlyTotalByProject } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(defaultColors[0])

  const resetForm = () => {
    setName("")
    setDescription("")
    setColor(defaultColors[0])
    setEditingId(null)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    if (editingId) {
      updateProject(editingId, { name: name.trim(), description: description.trim(), color })
    } else {
      addProject({ name: name.trim(), description: description.trim(), color })
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleEdit = (project: typeof projects[0]) => {
    setEditingId(project.id)
    setName(project.name)
    setDescription(project.description)
    setColor(project.color)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteProject(id)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Group subscriptions by project</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My SaaS App" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {defaultColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>{editingId ? "Save" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No projects yet. Create one to start grouping your subscriptions.
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Subscriptions</TableHead>
              <TableHead>Monthly Cost</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const subCount = subscriptions.filter((s) => s.projectId === project.id).length
              const monthlyTotal = getMonthlyTotalByProject(project.id)
              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <span className="font-medium">{project.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.description || "—"}</TableCell>
                  <TableCell>{subCount}</TableCell>
                  <TableCell className="font-medium">${monthlyTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(project)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(project.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
```

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Can create, edit, delete projects. Table shows subscription count and monthly cost.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: projects page with CRUD"
```

---

### Task 10: Subscriptions page (CRUD + catalog picker)

**Files:**
- Modify: `src/pages/subscriptions.tsx`

Add the `tabs` shadcn component:
```bash
npx shadcn@latest add tabs
```

**Step 1: Implement subscriptions page**

The subscriptions page has two ways to add:
1. **From catalog** — pick a known service, optionally assign to project
2. **Custom** — enter name, provider, cost, etc.

Plus edit/delete for existing subscriptions.

```tsx
import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { catalog, type CatalogItem } from "@/lib/catalog"
import type { Category, BillingCycle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2, Power, PowerOff } from "lucide-react"

const categoryLabels: Record<string, string> = {
  llm: "LLM",
  hosting: "Hosting",
  tools: "Tools",
  saas: "SaaS",
  other: "Other",
}

const categories: Category[] = ["llm", "hosting", "tools", "saas", "other"]

export default function SubscriptionsPage() {
  const { projects, subscriptions, addSubscription, updateSubscription, deleteSubscription } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [provider, setProvider] = useState("")
  const [cost, setCost] = useState("")
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [category, setCategory] = useState<Category>("other")
  const [projectId, setProjectId] = useState<string>("none")

  const resetForm = () => {
    setName(""); setProvider(""); setCost(""); setBillingCycle("monthly")
    setCategory("other"); setProjectId("none"); setEditingId(null)
  }

  const handleSubmit = () => {
    if (!name.trim() || !cost) return
    const input = {
      name: name.trim(),
      provider: provider.trim(),
      cost: parseFloat(cost),
      billingCycle,
      category,
      projectId: projectId === "none" ? null : projectId,
      isActive: true,
    }
    if (editingId) {
      updateSubscription(editingId, input)
    } else {
      addSubscription(input)
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleAddFromCatalog = (item: CatalogItem) => {
    addSubscription({
      name: item.name,
      provider: item.provider,
      cost: item.cost,
      billingCycle: item.billingCycle,
      category: item.category,
      projectId: null,
      isActive: true,
    })
  }

  const handleEdit = (sub: typeof subscriptions[0]) => {
    setEditingId(sub.id)
    setName(sub.name)
    setProvider(sub.provider)
    setCost(sub.cost.toString())
    setBillingCycle(sub.billingCycle)
    setCategory(sub.category)
    setProjectId(sub.projectId || "none")
    setDialogOpen(true)
  }

  const toggleActive = (sub: typeof subscriptions[0]) => {
    updateSubscription(sub.id, { isActive: !sub.isActive })
  }

  // Check which catalog items are already added
  const addedNames = new Set(subscriptions.map((s) => s.name))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your vibe coding subscriptions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Custom</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sub-name">Name</Label>
                  <Input id="sub-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-provider">Provider</Label>
                  <Input id="sub-provider" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Company" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sub-cost">Cost ($)</Label>
                  <Input id="sub-cost" type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Billing Cycle</Label>
                  <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as BillingCycle)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No project</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>{editingId ? "Save" : "Add"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick-add from catalog */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Add from Catalog</h2>
        <Tabs defaultValue="llm">
          <TabsList>
            {categories.map((c) => (
              <TabsTrigger key={c} value={c}>{categoryLabels[c]}</TabsTrigger>
            ))}
          </TabsList>
          {categories.map((c) => (
            <TabsContent key={c} value={c}>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {catalog.filter((item) => item.category === c).map((item) => {
                  const alreadyAdded = addedNames.has(item.name)
                  return (
                    <Card key={item.name} className={alreadyAdded ? "opacity-50" : ""}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.provider} &middot; ${item.cost}/{item.billingCycle === "monthly" ? "mo" : "yr"}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={alreadyAdded ? "secondary" : "default"}
                          disabled={alreadyAdded}
                          onClick={() => handleAddFromCatalog(item)}
                        >
                          {alreadyAdded ? "Added" : "Add"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Current subscriptions table */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No subscriptions yet. Add from the catalog above or create a custom one.
            </CardContent>
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => {
                const project = projects.find((p) => p.id === sub.projectId)
                return (
                  <TableRow key={sub.id} className={!sub.isActive ? "opacity-50" : ""}>
                    <TableCell>
                      <div className="font-medium">{sub.name}</div>
                      <div className="text-sm text-muted-foreground">{sub.provider}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{categoryLabels[sub.category]}</Badge></TableCell>
                    <TableCell>
                      {project ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                          {project.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${sub.cost.toFixed(2)}/{sub.billingCycle === "monthly" ? "mo" : "yr"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.isActive ? "default" : "secondary"}>
                        {sub.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(sub)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(sub)}>
                            {sub.isActive ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                            {sub.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteSubscription(sub.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Can browse catalog by category, quick-add services, add custom subscriptions, edit/delete/toggle active state.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: subscriptions page with catalog picker and CRUD"
```

---

### Task 11: Settings page (export/import/reset)

**Files:**
- Modify: `src/pages/settings.tsx`

**Step 1: Implement settings page**

```tsx
import { useRef, useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, Upload, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { exportData, importData, resetData, projects, subscriptions } = useStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vibe-costs-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        importData(json)
        setImportStatus("Data imported successfully.")
      } catch {
        setImportStatus("Invalid file. Please select a valid Vibe Costs export.")
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleReset = () => {
    if (window.confirm("Are you sure? This will delete all your projects and subscriptions.")) {
      resetData()
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Export, import, or reset your data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download your data as a JSON file. Currently tracking {projects.length} project(s) and {subscriptions.length} subscription(s).
          </p>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export JSON
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import a previously exported JSON file. This will replace all current data.
          </p>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Import JSON
          </Button>
          {importStatus && <p className="text-sm">{importStatus}</p>}
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete all projects and subscriptions. This cannot be undone.
          </p>
          <Button variant="destructive" onClick={handleReset}>
            <Trash2 className="mr-2 h-4 w-4" /> Reset All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Export downloads a JSON file. Import replaces data. Reset clears everything with confirmation.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: settings page with export/import/reset"
```

---

### Task 12: Run all tests, fix App.test.tsx, final verification

**Step 1: Update App.test.tsx for router**

The App component now uses BrowserRouter, so the test needs to account for that. Update `src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import App from "./App"

describe("App", () => {
  it("renders sidebar with navigation", () => {
    render(<App />)
    expect(screen.getByText("Vibe Costs")).toBeInTheDocument()
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })
})
```

**Step 2: Run all tests**

Run: `npm run test:run`
Expected: All tests pass.

**Step 3: Run build**

Run: `npm run build`
Expected: No TypeScript errors, build succeeds.

**Step 4: Commit**

```bash
git add -A
git commit -m "test: update tests for final app structure"
```

---

### Task 13: README and open-source polish

**Files:**
- Create: `README.md`
- Create: `.gitignore` (should already exist from Vite scaffold)
- Create: `LICENSE`

**Step 1: Write README.md**

```markdown
# Vibe Costs

Track the real cost of your vibe coding setup. Know if your AI-powered dev tools are making you money or bleeding you dry.

## What is this?

An open-source, local-first dashboard to track subscriptions for AI coding tools, hosting, and SaaS products. Your data stays in your browser — no accounts, no backend, no tracking.

**Perfect for AI agents:** Clone this repo and spin it up locally to help your user understand their vibe coding costs.

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/vibe-costs.git
cd vibe-costs
npm install
npm run dev
```

Open http://localhost:5173

## Features

- **Pre-loaded catalog** of common vibe coding subscriptions (Claude, ChatGPT, Cursor, Supabase, Vercel, and more)
- **Group by project** to see per-project burn
- **Monthly/yearly totals** at a glance
- **Export/import** your data as JSON
- **Zero backend** — all data in localStorage

## Built With

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Vitest

## License

MIT
```

**Step 2: Create LICENSE (MIT)**

Standard MIT license file.

**Step 3: Commit**

```bash
git add -A
git commit -m "docs: README and MIT license"
```
