import { BrowserRouter, Routes, Route } from "react-router-dom"
import { StoreProvider } from "@/lib/store-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import DashboardPage from "@/pages/dashboard"
import ProjectsPage from "@/pages/projects"
import SubscriptionsPage from "@/pages/subscriptions"
import SettingsPage from "@/pages/settings"

function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4 pb-20 md:p-6 md:pb-6">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
            <MobileNav />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </StoreProvider>
  )
}

export default App
