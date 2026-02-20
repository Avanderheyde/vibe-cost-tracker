import { Store } from "./store"

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
      store.addSubscription({
        name: "Vercel Pro", provider: "Vercel", cost: 20,
        billingCycle: "monthly", category: "hosting", projectId: project.id, isActive: true, quantity: 1, nextPaymentDate: null,
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
        billingCycle: "monthly", category: "llm", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      expect(sub.id).toBeDefined()
      expect(store.getSubscriptions()).toHaveLength(1)
    })

    it("updates a subscription", () => {
      const sub = store.addSubscription({
        name: "Old", provider: "X", cost: 10,
        billingCycle: "monthly", category: "other", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      store.updateSubscription(sub.id, { cost: 25 })
      expect(store.getSubscriptions()[0].cost).toBe(25)
    })

    it("deletes a subscription", () => {
      const sub = store.addSubscription({
        name: "Test", provider: "X", cost: 10,
        billingCycle: "monthly", category: "other", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      store.deleteSubscription(sub.id)
      expect(store.getSubscriptions()).toHaveLength(0)
    })

    it("gets subscriptions by project", () => {
      const project = store.addProject({ name: "P1", description: "", color: "#000" })
      store.addSubscription({
        name: "A", provider: "X", cost: 10,
        billingCycle: "monthly", category: "other", projectId: project.id, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      store.addSubscription({
        name: "B", provider: "Y", cost: 20,
        billingCycle: "monthly", category: "other", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      expect(store.getSubscriptionsByProject(project.id)).toHaveLength(1)

      expect(store.getSubscriptionsByProject(null)).toHaveLength(1)
    })
  })

  describe("calculations", () => {
    it("calculates monthly total for active subs only", () => {
      store.addSubscription({
        name: "A", provider: "X", cost: 20,
        billingCycle: "monthly", category: "llm", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      store.addSubscription({
        name: "B", provider: "Y", cost: 120,
        billingCycle: "yearly", category: "tools", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      store.addSubscription({
        name: "C", provider: "Z", cost: 50,
        billingCycle: "monthly", category: "other", projectId: null, isActive: false, quantity: 1, nextPaymentDate: null,
      })
      expect(store.getMonthlyTotal()).toBe(30)
    })

    it("multiplies cost by quantity for monthly (seats)", () => {
      store.addSubscription({
        name: "Notion Plus", provider: "Notion", cost: 12,
        billingCycle: "monthly", category: "saas", projectId: null, isActive: true, quantity: 2, nextPaymentDate: null,
      })
      // 12 * 2 seats = 24/mo
      expect(store.getMonthlyTotal()).toBe(24)
    })

    it("ignores quantity for yearly (years prepaid)", () => {
      store.addSubscription({
        name: "Domain (.ai)", provider: "Namecheap", cost: 75,
        billingCycle: "yearly", category: "other", projectId: null, isActive: true, quantity: 2, nextPaymentDate: null,
      })
      // 75/yr / 12 = 6.25/mo regardless of years prepaid
      expect(store.getMonthlyTotal()).toBeCloseTo(6.25)
    })

    it("calculates monthly total per project", () => {
      const p = store.addProject({ name: "P", description: "", color: "#000" })
      store.addSubscription({
        name: "A", provider: "X", cost: 20,
        billingCycle: "monthly", category: "llm", projectId: p.id, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      store.addSubscription({
        name: "B", provider: "Y", cost: 10,
        billingCycle: "monthly", category: "tools", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      expect(store.getMonthlyTotalByProject(p.id)).toBe(20)
    })

    it("calculates totals by category", () => {
      store.addSubscription({
        name: "A", provider: "X", cost: 20,
        billingCycle: "monthly", category: "llm", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      store.addSubscription({
        name: "B", provider: "Y", cost: 10,
        billingCycle: "monthly", category: "llm", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      store.addSubscription({
        name: "C", provider: "Z", cost: 25,
        billingCycle: "monthly", category: "hosting", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      const byCategory = store.getTotalsByCategory()
      expect(byCategory.llm).toBe(30)
      expect(byCategory.hosting).toBe(25)
    })
  })

  describe("nextPaymentDate", () => {
    it("round-trips through add, update, and export/import", () => {
      const sub = store.addSubscription({
        name: "Claude Pro", provider: "Anthropic", cost: 20,
        billingCycle: "monthly", category: "llm", projectId: null, isActive: true, quantity: 1, nextPaymentDate: "2025-03-15",
      })
      expect(store.getSubscriptions()[0].nextPaymentDate).toBe("2025-03-15")

      store.updateSubscription(sub.id, { nextPaymentDate: "2025-04-15" })
      expect(store.getSubscriptions()[0].nextPaymentDate).toBe("2025-04-15")

      const json = store.exportData()
      localStorage.clear()
      const store2 = new Store()
      store2.importData(json)
      expect(store2.getSubscriptions()[0].nextPaymentDate).toBe("2025-04-15")
    })

    it("defaults to null when not provided", () => {
      store.addSubscription({
        name: "Test", provider: "X", cost: 10,
        billingCycle: "monthly", category: "other", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
      })
      expect(store.getSubscriptions()[0].nextPaymentDate).toBeNull()
    })
  })

  describe("export/import", () => {
    it("exports and imports data", () => {
      store.addProject({ name: "Exported", description: "test", color: "#fff" })
      store.addSubscription({
        name: "Sub", provider: "P", cost: 15,
        billingCycle: "monthly", category: "tools", projectId: null, isActive: true, quantity: 1, nextPaymentDate: null,
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
