import { render, screen } from "@testing-library/react"
import App from "./App"

describe("App", () => {
  it("renders sidebar with navigation", () => {
    render(<App />)
    expect(screen.getByText("Vibe Costs")).toBeInTheDocument()
    expect(screen.getAllByText("Dashboard")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Projects")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Subscriptions")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Settings")[0]).toBeInTheDocument()
  })
})
