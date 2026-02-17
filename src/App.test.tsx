import { render, screen } from "@testing-library/react"
import App from "./App"

describe("App", () => {
  it("renders sidebar with navigation", () => {
    render(<App />)
    expect(screen.getByText("Vibe Costs")).toBeInTheDocument()
    expect(screen.getAllByText("Dashboard")[0]).toBeInTheDocument()
    expect(screen.getByText("Projects")).toBeInTheDocument()
    expect(screen.getByText("Subscriptions")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()
  })
})
