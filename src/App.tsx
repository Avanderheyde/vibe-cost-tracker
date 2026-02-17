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
