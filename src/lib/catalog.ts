import type { BillingCycle, Category } from "./types"

export interface CatalogItem {
  name: string
  provider: string
  cost: number
  billingCycle: BillingCycle
  category: Category
}

export const catalog: CatalogItem[] = [
  { name: "Claude Pro", provider: "Anthropic", cost: 20, billingCycle: "monthly", category: "llm" },
  { name: "Claude Max (5x)", provider: "Anthropic", cost: 100, billingCycle: "monthly", category: "llm" },
  { name: "Claude Max (20x)", provider: "Anthropic", cost: 200, billingCycle: "monthly", category: "llm" },
  { name: "ChatGPT Plus", provider: "OpenAI", cost: 20, billingCycle: "monthly", category: "llm" },
  { name: "ChatGPT Pro", provider: "OpenAI", cost: 200, billingCycle: "monthly", category: "llm" },
  { name: "Gemini Advanced", provider: "Google", cost: 20, billingCycle: "monthly", category: "llm" },
  { name: "Cursor Pro", provider: "Cursor", cost: 20, billingCycle: "monthly", category: "tools" },
  { name: "Windsurf Pro", provider: "Codeium", cost: 15, billingCycle: "monthly", category: "tools" },
  { name: "GitHub Copilot", provider: "GitHub", cost: 10, billingCycle: "monthly", category: "tools" },
  { name: "Tailscale Personal Plus", provider: "Tailscale", cost: 6, billingCycle: "monthly", category: "tools" },
  { name: "Warp Terminal", provider: "Warp", cost: 15, billingCycle: "monthly", category: "tools" },
  { name: "Supabase Pro", provider: "Supabase", cost: 25, billingCycle: "monthly", category: "hosting" },
  { name: "Vercel Pro", provider: "Vercel", cost: 20, billingCycle: "monthly", category: "hosting" },
  { name: "Netlify Pro", provider: "Netlify", cost: 19, billingCycle: "monthly", category: "hosting" },
  { name: "Railway Pro", provider: "Railway", cost: 5, billingCycle: "monthly", category: "hosting" },
  { name: "Fly.io", provider: "Fly.io", cost: 5, billingCycle: "monthly", category: "hosting" },
  { name: "Cloudflare Pro", provider: "Cloudflare", cost: 20, billingCycle: "monthly", category: "hosting" },
  { name: "Notion Plus", provider: "Notion", cost: 12, billingCycle: "monthly", category: "saas" },
  { name: "Eleven Labs Starter", provider: "Eleven Labs", cost: 5, billingCycle: "monthly", category: "saas" },
  { name: "Eleven Labs Creator", provider: "Eleven Labs", cost: 22, billingCycle: "monthly", category: "saas" },
  { name: "Google Workspace Starter", provider: "Google", cost: 7.20, billingCycle: "monthly", category: "saas" },
  { name: "Figma Professional", provider: "Figma", cost: 15, billingCycle: "monthly", category: "saas" },
  { name: "Linear Standard", provider: "Linear", cost: 8, billingCycle: "monthly", category: "saas" },
  { name: "Sentry Team", provider: "Sentry", cost: 26, billingCycle: "monthly", category: "saas" },
]

export function getCatalogByCategory(category: Category): CatalogItem[] {
  return catalog.filter((item) => item.category === category)
}
