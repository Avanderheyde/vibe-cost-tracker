import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { StoreProvider } from "@/lib/store-context"
import MarketMapPage from "./market-map"

// Mock fetch so Store.init() falls back to localStorage
vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("no server"))))

function renderMarketMap() {
  return render(
    <MemoryRouter>
      <StoreProvider>
        <MarketMapPage />
      </StoreProvider>
    </MemoryRouter>
  )
}

describe("MarketMapPage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders catalog services", async () => {
    renderMarketMap()
    await waitFor(() => {
      expect(screen.getByText("Market Map")).toBeInTheDocument()
    })
    // Check specific service names are rendered as text
    expect(screen.getByText("Claude")).toBeInTheDocument()
    expect(screen.getByText("Perplexity")).toBeInTheDocument()
  })

  it("shows checkmark immediately after adding a subscription", async () => {
    const user = userEvent.setup()
    renderMarketMap()

    await waitFor(() => {
      expect(screen.getByText("Market Map")).toBeInTheDocument()
    })

    // Claude button should not have a check icon initially
    const claudeButton = screen.getByRole("button", { name: /Claude/i })
    expect(claudeButton.querySelector("svg")).toBeNull() // no Check icon

    // Click Claude to open dialog
    await user.click(claudeButton)

    // Dialog should open with "Add Subscription" button
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Add Subscription/i })).toBeInTheDocument()
    })

    // Click "Add Subscription"
    await user.click(screen.getByRole("button", { name: /Add Subscription/i }))

    // After adding, Claude button should now show a check icon (owned state)
    await waitFor(() => {
      const updatedButton = screen.getByRole("button", { name: /Claude/i })
      // When owned: no provider suffix shown, and Check SVG is rendered
      expect(updatedButton.querySelector("svg")).not.toBeNull()
    })
  })

  it("persists added subscription to localStorage", async () => {
    const user = userEvent.setup()
    renderMarketMap()

    await waitFor(() => {
      expect(screen.getByText("Market Map")).toBeInTheDocument()
    })

    // Click Sentry to open dialog (unique name, no collisions)
    await user.click(screen.getByRole("button", { name: /Sentry/i }))

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Add Subscription/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: /Add Subscription/i }))

    // Verify localStorage has the subscription
    const raw = localStorage.getItem("vibe-costs-data")
    expect(raw).not.toBeNull()
    const data = JSON.parse(raw!)
    expect(data.subscriptions.length).toBeGreaterThan(0)
    expect(data.subscriptions.some((s: { provider: string }) => s.provider === "Sentry")).toBe(true)
  })
})
