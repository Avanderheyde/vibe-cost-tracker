import { useRef, useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, Upload, Trash2, Sun, Moon, Monitor, FileSpreadsheet } from "lucide-react"
import { categoryLabels } from "@/lib/catalog"
import { useTheme } from "@/components/theme-provider"

export default function SettingsPage() {
  const { exportData, importData, resetData, projects, subscriptions } = useStore()
  const { theme, setTheme } = useTheme()
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

  const handleExportCsv = () => {
    const csvQuote = (s: string) => `"${s.replace(/"/g, '""')}"`
    const header = ["Name", "Provider", "Cost", "Quantity", "Billing Cycle", "Category", "Project", "Next Payment", "Status"]
    const rows = subscriptions.map((sub) => {
      const project = projects.find((p) => p.id === sub.projectId)
      return [
        sub.name,
        sub.provider,
        sub.cost.toFixed(2),
        String(sub.quantity ?? 1),
        sub.billingCycle,
        categoryLabels[sub.category] || sub.category,
        project?.name || "",
        sub.nextPaymentDate || "",
        sub.isActive ? "Active" : "Inactive",
      ].map(csvQuote).join(",")
    })
    const csv = [header.map(csvQuote).join(","), ...rows].join("\r\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vibe-costs-${new Date().toISOString().split("T")[0]}.csv`
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
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {([["light", Sun, "Light"], ["dark", Moon, "Dark"], ["system", Monitor, "System"]] as const).map(([value, Icon, label]) => (
              <Button
                key={value}
                variant={theme === value ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme(value)}
              >
                <Icon className="mr-2 h-4 w-4" /> {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download your data as a JSON file. Currently tracking {projects.length} project(s) and {subscriptions.length} subscription(s).
          </p>
          <div className="flex gap-2">
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export JSON
            </Button>
            <Button variant="outline" onClick={handleExportCsv}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
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
