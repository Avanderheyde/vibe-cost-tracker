import { catalog, getCatalogByCategory, tierDisplayName } from "./catalog"

describe("catalog", () => {
  it("has entries", () => {
    expect(catalog.length).toBeGreaterThan(0)
  })

  it("every entry has required fields and at least one tier", () => {
    for (const item of catalog) {
      expect(item.name).toBeTruthy()
      expect(typeof item.provider).toBe("string")
      expect(item.category).toBeTruthy()
      expect(item.description).toBeTruthy()
      expect(item.detail).toBeTruthy()
      expect(item.tiers.length).toBeGreaterThan(0)
      for (const tier of item.tiers) {
        expect(typeof tier.cost).toBe("number")
        expect(["monthly", "yearly"]).toContain(tier.billingCycle)
      }
    }
  })

  it("filters by category", () => {
    const aiModels = getCatalogByCategory("ai-models")
    expect(aiModels.length).toBeGreaterThan(0)
    expect(aiModels.every((item) => item.category === "ai-models")).toBe(true)
  })

  it("builds display name from item and tier", () => {
    expect(tierDisplayName(
      { name: "Claude", provider: "Anthropic", category: "llm", description: "", detail: "", tiers: [] },
      { label: "Pro", cost: 20, billingCycle: "monthly" },
    )).toBe("Claude Pro")
    expect(tierDisplayName(
      { name: "Fly.io", provider: "Fly.io", category: "hosting", description: "", detail: "", tiers: [] },
      { label: "", cost: 5, billingCycle: "monthly" },
    )).toBe("Fly.io")
  })
})
