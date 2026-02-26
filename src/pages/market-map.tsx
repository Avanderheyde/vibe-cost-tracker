import { useMemo, useState } from "react"
import { useStore } from "@/lib/store-context"
import { catalog, categories, categoryLabels, tierDisplayName, formatTierCost, type CatalogItem } from "@/lib/catalog"
import type { Category } from "@/lib/types"
import { Check, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const CATEGORY_COLORS: Record<Category, string> = {
  "ai-models": "bg-violet-600",
  "ai-coding": "bg-indigo-600",
  "ai-media": "bg-pink-600",
  "database": "bg-emerald-600",
  "cloud": "bg-sky-600",
  "hosting": "bg-blue-600",
  "services": "bg-amber-600",
  "incorporation": "bg-yellow-700",
  "marketing": "bg-rose-600",
  "monitoring": "bg-teal-600",
  "design": "bg-fuchsia-600",
  "productivity": "bg-orange-600",
  "dev-tools": "bg-slate-600",
  "domains": "bg-cyan-600",
  "security": "bg-green-600",
}

const CATALOG_URLS: Record<string, string> = {
  // AI Models
  "Claude": "https://claude.ai",
  "ChatGPT": "https://chatgpt.com",
  "Gemini": "https://gemini.google.com",
  "Grok": "https://grok.com",
  "Kimi": "https://kimi.ai",
  "Perplexity": "https://perplexity.ai",
  "Le Chat": "https://chat.mistral.ai",
  "Poe": "https://poe.com",
  // AI Coding
  "Cursor": "https://cursor.com",
  "Windsurf": "https://codeium.com/windsurf",
  "GitHub Copilot": "https://github.com/features/copilot",
  "Lovable": "https://lovable.dev",
  "v0": "https://v0.dev",
  "Bolt.new": "https://bolt.new",
  "Replit": "https://replit.com",
  "JetBrains AI": "https://www.jetbrains.com/ai",
  "Tabnine": "https://www.tabnine.com",
  // AI Media
  "Midjourney": "https://midjourney.com",
  "Kling": "https://klingai.com",
  "Veo": "https://deepmind.google/technologies/veo",
  "Nano Banana": "https://nanobanana.com",
  "Suno": "https://suno.com",
  "Eleven Labs": "https://elevenlabs.io",
  // Databases & BaaS
  "Supabase": "https://supabase.com",
  "Firebase": "https://firebase.google.com",
  "Convex": "https://convex.dev",
  "PlanetScale": "https://planetscale.com",
  "Turso": "https://turso.tech",
  "Upstash": "https://upstash.com",
  "Pinecone": "https://pinecone.io",
  "Neon": "https://neon.tech",
  // Cloud Providers
  "AWS": "https://aws.amazon.com",
  "Azure": "https://azure.microsoft.com",
  "Google Cloud": "https://cloud.google.com",
  "Temporal": "https://temporal.io",
  // Hosting & Deployment
  "Vercel": "https://vercel.com",
  "Netlify": "https://netlify.com",
  "Railway": "https://railway.app",
  "Fly.io": "https://fly.io",
  "Cloudflare": "https://cloudflare.com",
  "Render": "https://render.com",
  "Heroku": "https://heroku.com",
  "Coolify": "https://coolify.io",
  "Koyeb": "https://koyeb.com",
  // Services & APIs
  "Clerk": "https://clerk.com",
  "Stripe": "https://stripe.com",
  "Browserbase": "https://browserbase.com",
  "RevenueCat": "https://revenuecat.com",
  "Apple Developer Program": "https://developer.apple.com/programs",
  "UploadThing": "https://uploadthing.com",
  "Cloudinary": "https://cloudinary.com",
  // Incorporation
  "Stripe Atlas": "https://stripe.com/atlas",
  "Doola": "https://doola.com",
  "Firstbase": "https://firstbase.io",
  "Clerky": "https://clerky.com",
  "StartGlobal": "https://startglobal.co",
  "LegalZoom": "https://legalzoom.com",
  // Marketing
  "X": "https://x.com",
  "Mailchimp": "https://mailchimp.com",
  "Canva": "https://canva.com",
  "Framer": "https://framer.com",
  "Loom": "https://loom.com",
  "Resend": "https://resend.com",
  "SendGrid": "https://sendgrid.com",
  "Loops": "https://loops.so",
  "Pallyy": "https://pallyy.com",
  "AppTweak": "https://apptweak.com",
  "Singular": "https://singular.net",
  "Apple Search Ads": "https://searchads.apple.com",
  "Screen Studio": "https://screen.studio",
  // Monitoring & Analytics
  "PostHog": "https://posthog.com",
  "Sentry": "https://sentry.io",
  "UptimeRobot": "https://uptimerobot.com",
  "Datadog": "https://datadoghq.com",
  "Grafana Cloud": "https://grafana.com",
  "BetterStack": "https://betterstack.com",
  "Honeycomb": "https://honeycomb.io",
  "LogRocket": "https://logrocket.com",
  "Checkly": "https://checklyhq.com",
  "Axiom": "https://axiom.co",
  "PagerDuty": "https://pagerduty.com",
  "Plausible": "https://plausible.io",
  // Design
  "Figma": "https://figma.com",
  "Mobbin": "https://mobbin.com",
  "ShotDeck": "https://shotdeck.com",
  "Savee": "https://savee.it",
  "LottieFiles": "https://lottiefiles.com",
  // Productivity
  "Notion": "https://notion.so",
  "Obsidian": "https://obsidian.md",
  "Slack": "https://slack.com",
  "Linear": "https://linear.app",
  "Google Workspace": "https://workspace.google.com",
  "Granola": "https://granola.ai",
  "Calendly": "https://calendly.com",
  // Dev Tools
  "GitHub": "https://github.com",
  "Docker Desktop": "https://docker.com/products/docker-desktop",
  "Tailscale": "https://tailscale.com",
  "Warp Terminal": "https://warp.dev",
  "Raycast": "https://raycast.com",
  "Wispr Flow": "https://wisprflow.com",
  "SuperWhisper": "https://superwhisper.com",
  "n8n": "https://n8n.io",
  "Stagehand": "https://stagehand.dev",
  "Sanity": "https://sanity.io",
  "Willow Voice": "https://willow.direct",
  // Domains & DNS
  "Namecheap": "https://namecheap.com",
  // Security & Privacy
  "1Password": "https://1password.com",
  "Bitwarden": "https://bitwarden.com",
  "Proton Mail": "https://proton.me/mail",
  "Fastmail": "https://fastmail.com",
  "Mullvad VPN": "https://mullvad.net",
  "iCloud+": "https://apple.com/icloud",
}

export default function MarketMapPage() {
  const { subscriptions, projects, addSubscription } = useStore()

  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null)
  const [selectedTierIdx, setSelectedTierIdx] = useState(0)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("none")

  const subscribedNames = useMemo(() => {
    const names = new Set<string>()
    for (const sub of subscriptions) {
      // Match on the base product name (strip tier label like "Claude Max (20x)" -> "Claude")
      const base = sub.name.split(/\s+(Pro|Plus|Max|Premium|Business|Starter|Team|Basic|Ultra|Core|Dev|Standard|Build|Cloud|Eco|Individual|Organization)\b/)[0]
      names.add(base.toLowerCase())
      names.add(sub.name.toLowerCase())
    }
    return names
  }, [subscriptions])

  const grouped = useMemo(() => {
    const map = new Map<Category, typeof catalog>()
    for (const cat of categories) {
      const items = catalog.filter((i) => i.category === cat)
      if (items.length > 0) map.set(cat, items)
    }
    return map
  }, [])

  const handleAdd = () => {
    if (!selectedItem) return
    const tier = selectedItem.tiers[selectedTierIdx]
    addSubscription({
      name: tierDisplayName(selectedItem, tier),
      provider: selectedItem.provider,
      cost: tier.cost,
      quantity: 1,
      billingCycle: tier.billingCycle,
      category: selectedItem.category,
      nextPaymentDate: null,
      projectId: selectedProjectId === "none" ? null : selectedProjectId,
      isActive: true,
    })
    setSelectedItem(null)
    setSelectedTierIdx(0)
    setSelectedProjectId("none")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Market Map</h1>
        <p className="text-muted-foreground">The vibe coding stack landscape</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from(grouped.entries()).map(([category, items]) => (
          <div key={category} className="overflow-hidden rounded-lg border bg-card">
            <div className={`${CATEGORY_COLORS[category]} px-3 py-2`}>
              <h2 className="text-sm font-semibold text-white">{categoryLabels[category]}</h2>
            </div>
            <div className="flex flex-wrap gap-2 p-3">
              {items.map((item) => {
                const owned = subscribedNames.has(item.name.toLowerCase())
                return (
                  <button
                    key={item.name}
                    onClick={() => { setSelectedItem(item); setSelectedTierIdx(0); setSelectedProjectId("none") }}
                    className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium shadow-sm transition-colors cursor-pointer ${
                      owned
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "bg-background text-foreground/60 hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {owned && <Check className="h-3 w-3 shrink-0" />}
                    <span>{item.name}</span>
                    {!owned && item.provider && item.provider !== item.name && (
                      <span className="text-muted-foreground">· {item.provider}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {catalog.length} tools across {grouped.size} categories
      </p>

      <Dialog open={selectedItem !== null} onOpenChange={(open) => { if (!open) setSelectedItem(null) }}>
        {selectedItem && (() => {
          const tier = selectedItem.tiers[selectedTierIdx]
          const url = CATALOG_URLS[selectedItem.name]
          const alreadySubscribed = subscribedNames.has(selectedItem.name.toLowerCase())

          return (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedItem.name}
                  {selectedItem.provider && selectedItem.provider !== selectedItem.name && (
                    <span className="text-sm font-normal text-muted-foreground">by {selectedItem.provider}</span>
                  )}
                </DialogTitle>
                <Badge variant="outline" className="w-fit">{categoryLabels[selectedItem.category]}</Badge>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{selectedItem.detail}</p>

                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {url.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                )}

                <div className="space-y-1.5">
                  <p className="text-sm font-medium">Pricing</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tiers.map((t, i) => (
                      <Badge
                        key={i}
                        variant={i === selectedTierIdx ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedTierIdx(i)}
                      >
                        {t.label || selectedItem.name} — {formatTierCost(t)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {alreadySubscribed && (
                  <p className="text-xs text-muted-foreground">You already have this subscription.</p>
                )}
              </div>

              <DialogFooter className="flex-col gap-3 sm:flex-col">
                <div className="flex items-center gap-2 w-full">
                  {selectedItem.tiers.length > 1 && (
                    <Select value={selectedTierIdx.toString()} onValueChange={(v) => setSelectedTierIdx(parseInt(v))}>
                      <SelectTrigger className="h-9 w-auto gap-1 px-2 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedItem.tiers.map((t, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {t.label || selectedItem.name} — {formatTierCost(t)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger className="h-9 flex-1 text-xs">
                      <SelectValue placeholder="No project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No project</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 w-full">
                  <DialogClose asChild>
                    <Button variant="outline" className="flex-1">Close</Button>
                  </DialogClose>
                  <Button className="flex-1" onClick={handleAdd}>
                    {alreadySubscribed ? "Add Another" : "Add Subscription"}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          )
        })()}
      </Dialog>
    </div>
  )
}
