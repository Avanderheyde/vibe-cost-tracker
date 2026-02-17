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
