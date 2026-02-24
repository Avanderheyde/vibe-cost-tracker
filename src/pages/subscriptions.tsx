import { useState, useMemo } from "react"
import { useStore } from "@/lib/store-context"
import { catalog, categories, categoryLabels, tierDisplayName, formatTierCost, domainTLDs, domainRegistrars, type CatalogItem, type CatalogTier } from "@/lib/catalog"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2, Power, PowerOff, BookOpen } from "lucide-react"

function CatalogCard({ item, onAdd }: { item: CatalogItem; onAdd: (item: CatalogItem, tier: CatalogTier) => void }) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const tier = item.tiers[selectedIdx]
  const hasTiers = item.tiers.length > 1

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="min-w-0 flex-1">
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.description}</div>
          <div className="text-sm text-muted-foreground">
            {item.provider ? `${item.provider} \u00b7 ` : ""}{formatTierCost(tier)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasTiers && (
            <Select value={selectedIdx.toString()} onValueChange={(v) => setSelectedIdx(parseInt(v))}>
              <SelectTrigger className="h-8 w-auto gap-1 px-2 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {item.tiers.map((t, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {t.label || item.name} — {formatTierCost(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button size="sm" onClick={() => onAdd(item, tier)}>Add</Button>
        </div>
      </CardContent>
    </Card>
  )
}


export default function SubscriptionsPage() {
  const { projects, subscriptions, addSubscription, updateSubscription, deleteSubscription } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [quickAddProjectId, setQuickAddProjectId] = useState<string>("none")
  const [catalogCategory, setCatalogCategory] = useState<Category>("ai-models")

  const [name, setName] = useState("")
  const [provider, setProvider] = useState("")
  const [cost, setCost] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [category, setCategory] = useState<Category>("ai-models")
  const [projectId, setProjectId] = useState<string>("none")
  const [catalogDetail, setCatalogDetail] = useState("")
  const [isDomainAdd, setIsDomainAdd] = useState(false)
  const [domainTLD, setDomainTLD] = useState(".com")
  const [domainRegistrar, setDomainRegistrar] = useState("Cloudflare")
  const [nextPaymentDate, setNextPaymentDate] = useState("")

  const [searchText, setSearchText] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterProject, setFilterProject] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      if (searchText) {
        const q = searchText.toLowerCase()
        if (!sub.name.toLowerCase().includes(q) && !sub.provider.toLowerCase().includes(q)) return false
      }
      if (filterCategory !== "all" && sub.category !== filterCategory) return false
      if (filterProject !== "all") {
        if (filterProject === "none" && sub.projectId !== null) return false
        if (filterProject !== "none" && sub.projectId !== filterProject) return false
      }
      if (filterStatus !== "all") {
        if (filterStatus === "active" && !sub.isActive) return false
        if (filterStatus === "inactive" && sub.isActive) return false
      }
      return true
    })
  }, [subscriptions, searchText, filterCategory, filterProject, filterStatus])

  const resetForm = () => {
    setName(""); setProvider(""); setCost(""); setQuantity("1"); setBillingCycle("monthly")
    setCategory("ai-models"); setProjectId("none"); setEditingId(null); setCatalogDetail("")
    setIsDomainAdd(false); setDomainTLD(".com"); setDomainRegistrar("Cloudflare"); setNextPaymentDate("")
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
      nextPaymentDate: nextPaymentDate || null,
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

  const handleAddFromCatalog = (item: CatalogItem, tier: CatalogTier) => {
    setCatalogOpen(false)
    setEditingId(null)
    setCost(tier.cost.toString())
    setQuantity("1")
    setBillingCycle(tier.billingCycle)
    setCategory(item.category)
    setProjectId(quickAddProjectId)
    setCatalogDetail(item.detail)
    if (item.name === "Domain") {
      setIsDomainAdd(true)
      setDomainTLD(".com")
      setDomainRegistrar("Cloudflare")
      setName("Domain (.com)")
      setProvider("Cloudflare")
    } else {
      setIsDomainAdd(false)
      setName(tierDisplayName(item, tier))
      setProvider(item.provider)
    }
    setDialogOpen(true)
  }

  const handleEdit = (sub: typeof subscriptions[0]) => {
    setEditingId(sub.id)
    setName(sub.name)
    setProvider(sub.provider)
    setCost(sub.cost.toString())
    setQuantity((sub.quantity ?? 1).toString())
    setBillingCycle(sub.billingCycle)
    setCategory(sub.category)
    setNextPaymentDate(sub.nextPaymentDate || "")
    setProjectId(sub.projectId || "none")
    setDialogOpen(true)
  }

  const toggleActive = (sub: typeof subscriptions[0]) => {
    updateSubscription(sub.id, { isActive: !sub.isActive })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your vibe coding subscriptions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCatalogOpen(true)}>
            <BookOpen className="mr-2 h-4 w-4" /> Browse Catalog
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Custom</Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {catalogDetail && (
                <p className="text-sm text-muted-foreground">{catalogDetail}</p>
              )}
              {isDomainAdd && !editingId ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>TLD</Label>
                    <Select value={domainTLD} onValueChange={(v) => {
                      setDomainTLD(v)
                      if (v !== "other") setName(`Domain (${v})`)
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {domainTLDs.map((tld) => (
                          <SelectItem key={tld} value={tld}>{tld}</SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {domainTLD === "other" && (
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Domain (.net)" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Registrar</Label>
                    <Select value={domainRegistrar} onValueChange={(v) => {
                      setDomainRegistrar(v)
                      if (v !== "other") setProvider(v)
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {domainRegistrars.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {domainRegistrar === "other" && (
                      <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Registrar name" />
                    )}
                  </div>
                </div>
              ) : (
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
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sub-cost">Cost ($)</Label>
                  <Input id="sub-cost" type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-quantity">{billingCycle === "yearly" ? "Years" : "Qty / Seats"}</Label>
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
              <div className="space-y-2">
                <Label htmlFor="sub-next-payment">Next Payment Date</Label>
                <Input id="sub-next-payment" type="date" value={nextPaymentDate} onChange={(e) => setNextPaymentDate(e.target.value)} />
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
      </div>

      <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
        <DialogContent className="!grid-rows-[auto_1fr] max-w-3xl max-h-[80vh] overflow-hidden p-0">
          <div className="px-6 pt-6 pb-4 border-b space-y-4">
            <DialogTitle>Browse Catalog</DialogTitle>
            <div className="flex items-center gap-4">
              <Select value={catalogCategory} onValueChange={(v) => setCatalogCategory(v as Category)}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">Add to:</Label>
                <Select value={quickAddProjectId} onValueChange={setQuickAddProjectId}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
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
          <div className="overflow-y-auto px-6 py-4">
            <div className="grid gap-2">
              {catalog.filter((item) => item.category === catalogCategory).map((item) => (
                <CatalogCard key={`${item.name}|${item.provider}`} item={item} onAdd={handleAddFromCatalog} />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search name or provider…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-48"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="none">No Project</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No subscriptions yet. Add from the catalog above or create a custom one.
            </CardContent>
          </Card>
        ) : filteredSubscriptions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No subscriptions match your filters.
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
                <TableHead>Next Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((sub) => {
                const project = projects.find((p) => p.id === sub.projectId)
                return (
                  <TableRow key={sub.id} className={!sub.isActive ? "opacity-50" : ""}>
                    <TableCell>
                      <div className="font-medium">{sub.name}</div>
                      <div className="text-sm text-muted-foreground">{sub.provider}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{categoryLabels[sub.category] || sub.category}</Badge></TableCell>
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
                      {sub.billingCycle === "monthly" ? (
                        <>
                          <div>${((sub.quantity ?? 1) * sub.cost).toFixed(2)}/mo</div>
                          {(sub.quantity ?? 1) > 1 && (
                            <div className="text-xs text-muted-foreground">
                              {sub.quantity} &times; ${sub.cost.toFixed(2)}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div>${sub.cost.toFixed(2)}/yr</div>
                          {(sub.quantity ?? 1) > 1 && (
                            <div className="text-xs text-muted-foreground">
                              {sub.quantity} yr prepaid
                            </div>
                          )}
                        </>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sub.nextPaymentDate ? new Date(sub.nextPaymentDate + "T00:00:00").toLocaleDateString() : "\u2014"}
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
