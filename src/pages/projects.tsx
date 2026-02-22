import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

const defaultColors = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"]

export default function ProjectsPage() {
  const { projects, subscriptions, addProject, updateProject, deleteProject, getMonthlyTotalByProject } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(defaultColors[0])

  const resetForm = () => {
    setName("")
    setDescription("")
    setColor(defaultColors[0])
    setEditingId(null)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    if (editingId) {
      updateProject(editingId, { name: name.trim(), description: description.trim(), color })
    } else {
      addProject({ name: name.trim(), description: description.trim(), color })
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleEdit = (project: typeof projects[0]) => {
    setEditingId(project.id)
    setName(project.name)
    setDescription(project.description)
    setColor(project.color)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteProject(id)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Group subscriptions by project</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My SaaS App" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {defaultColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>{editingId ? "Save" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${projects.reduce((sum, p) => sum + getMonthlyTotalByProject(p.id), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No projects yet. Create one to start grouping your subscriptions.
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Subscriptions</TableHead>
              <TableHead>Monthly Cost</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const subCount = subscriptions.filter((s) => s.projectId === project.id).length
              const monthlyTotal = getMonthlyTotalByProject(project.id)
              return (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <span className="font-medium">{project.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{project.description || "\u2014"}</TableCell>
                  <TableCell>{subCount}</TableCell>
                  <TableCell className="font-medium">${monthlyTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(project)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(project.id)}>
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
  )
}
