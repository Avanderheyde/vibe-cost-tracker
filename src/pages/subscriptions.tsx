import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { catalog, type CatalogItem } from "@/lib/catalog"
import type { Category, BillingCycle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2, Power, PowerOff } from "lucide-react"

const categoryLabels: Record<string, string> = {
  llm: "LLM",
  hosting: "Hosting",
  tools: "Tools",
  saas: "SaaS",
  other: "Other",
}

const categories: Category[] = ["llm", "hosting", "tools", "saas", "other"]

export default function SubscriptionsPage() {
  const { projects, subscriptions, addSubscription, updateSubscription, deleteSubscription } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [provider, setProvider] = useState("")
  const [cost, setCost] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [category, setCategory] = useState<Category>("other")
  const [projectId, setProjectId] = useState<string>("none")

  const resetForm = () => {
    setName(""); setProvider(""); setCost(""); setQuantity("1"); setBillingCycle("monthly")
    setCategory("other"); setProjectId("none"); setEditingId(null)
  }

  const handleSubmit = () => {
    if (!name.trim() || !cost) return
    const input = {
      name: name.trim(),
      provider: provider.trim(),
      cost: parseFloat(cost),
      quantity: parseInt(quantity) || 1,
      billingCycle,
      category,
      projectId: projectId === "none" ? null : projectId,
      isActive: true,
    }
    if (editingId) {
      updateSubscription(editingId, input)
    } else {
      addSubscription(input)
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleAddFromCatalog = (item: CatalogItem) => {
    addSubscription({
      name: item.name,
      provider: item.provider,
      cost: item.cost,
      quantity: 1,
      billingCycle: item.billingCycle,
      category: item.category,
      projectId: null,
      isActive: true,
    })
  }

  const handleEdit = (sub: typeof subscriptions[0]) => {
    setEditingId(sub.id)
    setName(sub.name)
    setProvider(sub.provider)
    setCost(sub.cost.toString())
    setQuantity((sub.quantity ?? 1).toString())
    setBillingCycle(sub.billingCycle)
    setCategory(sub.category)
    setProjectId(sub.projectId || "none")
    setDialogOpen(true)
  }

  const toggleActive = (sub: typeof subscriptions[0]) => {
    updateSubscription(sub.id, { isActive: !sub.isActive })
  }

  const addedNames = new Set(subscriptions.map((s) => s.name))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your vibe coding subscriptions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Custom</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sub-name">Name</Label>
                  <Input id="sub-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-provider">Provider</Label>
                  <Input id="sub-provider" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Company" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sub-cost">Cost ($)</Label>
                  <Input id="sub-cost" type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-quantity">Qty / Seats</Label>
                  <Input id="sub-quantity" type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" />
                </div>
                <div className="space-y-2">
                  <Label>Billing Cycle</Label>
                  <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as BillingCycle)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No project</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>{editingId ? "Save" : "Add"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Add from Catalog</h2>
        <Tabs defaultValue="llm">
          <TabsList>
            {categories.map((c) => (
              <TabsTrigger key={c} value={c}>{categoryLabels[c]}</TabsTrigger>
            ))}
          </TabsList>
          {categories.map((c) => (
            <TabsContent key={c} value={c}>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {catalog.filter((item) => item.category === c).map((item) => {
                  const alreadyAdded = addedNames.has(item.name)
                  return (
                    <Card key={item.name} className={alreadyAdded ? "opacity-50" : ""}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.provider} &middot; ${item.cost}/{item.billingCycle === "monthly" ? "mo" : "yr"}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={alreadyAdded ? "secondary" : "default"}
                          disabled={alreadyAdded}
                          onClick={() => handleAddFromCatalog(item)}
                        >
                          {alreadyAdded ? "Added" : "Add"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No subscriptions yet. Add from the catalog above or create a custom one.
            </CardContent>
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => {
                const project = projects.find((p) => p.id === sub.projectId)
                return (
                  <TableRow key={sub.id} className={!sub.isActive ? "opacity-50" : ""}>
                    <TableCell>
                      <div className="font-medium">{sub.name}</div>
                      <div className="text-sm text-muted-foreground">{sub.provider}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{categoryLabels[sub.category]}</Badge></TableCell>
                    <TableCell>
                      {project ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
                          {project.name}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">{"\u2014"}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>${((sub.quantity ?? 1) * sub.cost).toFixed(2)}/{sub.billingCycle === "monthly" ? "mo" : "yr"}</div>
                      {(sub.quantity ?? 1) > 1 && (
                        <div className="text-xs text-muted-foreground">
                          {sub.quantity} &times; ${sub.cost.toFixed(2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.isActive ? "default" : "secondary"}>
                        {sub.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(sub)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(sub)}>
                            {sub.isActive ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                            {sub.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteSubscription(sub.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
