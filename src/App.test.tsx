import { render, screen, waitFor } from "@testing-library/react"
import App from "./App"

// Mock fetch so Store.init() falls back to localStorage
vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("no server"))))

describe("App", () => {
  it("renders sidebar with navigation", async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText("Vibe Costs")).toBeInTheDocument()
    })
    expect(screen.getAllByText("Dashboard")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Projects")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Subscriptions")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Settings")[0]).toBeInTheDocument()
  })
})
