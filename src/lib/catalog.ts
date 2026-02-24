import type { BillingCycle, Category } from "./types"

export interface CatalogTier {
  label: string
  cost: number
  billingCycle: BillingCycle
}

export interface CatalogItem {
  name: string
  provider: string
  category: Category
  description: string
  detail: string
  tiers: CatalogTier[]
}

export const categoryLabels: Record<Category, string> = {
  "ai-models": "AI Models",
  "ai-coding": "AI Coding",
  "ai-media": "AI Media",
  "database": "Databases & BaaS",
  "cloud": "Cloud Providers",
  "hosting": "Hosting & Deployment",
  "services": "Services & APIs",
  "marketing": "Marketing",
  "monitoring": "Monitoring & Analytics",
  "design": "Design",
  "productivity": "Productivity",
  "dev-tools": "Dev Tools",
  "domains": "Domains & DNS",
  "security": "Security & Privacy",
}

export const categories: Category[] = [
  "ai-models", "ai-coding", "ai-media", "database", "cloud", "hosting",
  "services", "marketing", "monitoring", "design", "productivity",
  "dev-tools", "domains", "security",
]

export const catalog: CatalogItem[] = [
  // AI Models
  { name: "Claude", provider: "Anthropic", category: "ai-models",
    description: "AI assistant for writing, analysis, and coding",
    detail: "Anthropic's conversational AI with strong reasoning, coding, and writing capabilities. Known for nuanced, safety-conscious responses.",
    tiers: [
      { label: "Pro", cost: 20, billingCycle: "monthly" },
      { label: "Max (5x)", cost: 100, billingCycle: "monthly" },
      { label: "Max (20x)", cost: 200, billingCycle: "monthly" },
    ]},
  { name: "ChatGPT", provider: "OpenAI", category: "ai-models",
    description: "General-purpose AI chatbot",
    detail: "OpenAI's flagship conversational AI with GPT-4o, image generation, browsing, and plugin support. The most widely adopted consumer LLM.",
    tiers: [
      { label: "Go", cost: 8, billingCycle: "monthly" },
      { label: "Plus", cost: 20, billingCycle: "monthly" },
      { label: "Pro", cost: 200, billingCycle: "monthly" },
    ]},
  { name: "Gemini", provider: "Google", category: "ai-models",
    description: "Google's multimodal AI assistant",
    detail: "Google's AI with deep integration into Search, Workspace, and Android. Offers multimodal understanding across text, images, and video.",
    tiers: [
      { label: "AI Plus", cost: 7.99, billingCycle: "monthly" },
      { label: "AI Pro", cost: 19.99, billingCycle: "monthly" },
      { label: "AI Ultra", cost: 249.99, billingCycle: "monthly" },
    ]},
  { name: "Grok", provider: "xAI", category: "ai-models",
    description: "AI chatbot with real-time X integration",
    detail: "xAI's conversational model with real-time access to X (Twitter) posts. Known for unfiltered responses and current-events awareness.",
    tiers: [
      { label: "SuperGrok", cost: 30, billingCycle: "monthly" },
      { label: "SuperGrok Heavy", cost: 300, billingCycle: "monthly" },
    ]},
  { name: "Kimi", provider: "Moonshot AI", category: "ai-models",
    description: "Long-context AI assistant",
    detail: "Moonshot AI's chatbot specializing in extremely long context windows, ideal for processing lengthy documents and complex research tasks.",
    tiers: [
      { label: "Moderato", cost: 19, billingCycle: "monthly" },
      { label: "Allegretto", cost: 39, billingCycle: "monthly" },
      { label: "Vivace", cost: 199, billingCycle: "monthly" },
    ]},
  { name: "Perplexity", provider: "Perplexity", category: "ai-models",
    description: "AI-powered answer engine with citations",
    detail: "Search-focused AI that provides sourced answers with inline citations. Combines web search with LLM reasoning for research tasks.",
    tiers: [
      { label: "Pro", cost: 20, billingCycle: "monthly" },
      { label: "Max", cost: 200, billingCycle: "monthly" },
    ]},
  { name: "Le Chat", provider: "Mistral AI", category: "ai-models",
    description: "European AI assistant",
    detail: "Mistral AI's consumer chatbot powered by their open-weight models. A European alternative focused on multilingual support and efficiency.",
    tiers: [
      { label: "Pro", cost: 14.99, billingCycle: "monthly" },
    ]},
  { name: "Poe", provider: "Quora", category: "ai-models",
    description: "Multi-model AI chat platform",
    detail: "Quora's aggregator platform providing access to multiple AI models (GPT-4, Claude, Gemini, and others) through a single subscription.",
    tiers: [
      { label: "Subscriber", cost: 5, billingCycle: "monthly" },
      { label: "Standard", cost: 19.99, billingCycle: "monthly" },
    ]},

  // AI Coding
  { name: "Cursor", provider: "Cursor", category: "ai-coding",
    description: "AI-powered code editor",
    detail: "VS Code fork with deep AI integration for code generation, editing, and chat. Uses multiple LLMs for intelligent autocomplete and refactoring.",
    tiers: [
      { label: "Pro", cost: 20, billingCycle: "monthly" },
      { label: "Pro+", cost: 60, billingCycle: "monthly" },
      { label: "Ultra", cost: 200, billingCycle: "monthly" },
    ]},
  { name: "Windsurf", provider: "Codeium", category: "ai-coding",
    description: "AI IDE with agentic coding flows",
    detail: "Codeium's AI-native IDE combining code completion with agentic workflows that can plan and execute multi-file changes.",
    tiers: [
      { label: "Pro", cost: 15, billingCycle: "monthly" },
    ]},
  { name: "GitHub Copilot", provider: "GitHub", category: "ai-coding",
    description: "AI pair programmer in your editor",
    detail: "GitHub's AI coding assistant that provides inline suggestions, chat, and code explanations. Integrates with VS Code, JetBrains, and Neovim.",
    tiers: [
      { label: "Pro", cost: 10, billingCycle: "monthly" },
      { label: "Pro+", cost: 39, billingCycle: "monthly" },
    ]},
  { name: "Lovable", provider: "Lovable", category: "ai-coding",
    description: "AI full-stack app builder",
    detail: "Prompt-to-app platform that generates full-stack web applications with UI, backend, and database from natural language descriptions.",
    tiers: [
      { label: "Pro", cost: 25, billingCycle: "monthly" },
      { label: "Business", cost: 50, billingCycle: "monthly" },
    ]},
  { name: "v0", provider: "Vercel", category: "ai-coding",
    description: "AI UI component generator",
    detail: "Vercel's generative UI tool that creates React components from prompts. Outputs production-ready code using shadcn/ui and Tailwind CSS.",
    tiers: [
      { label: "Premium", cost: 20, billingCycle: "monthly" },
    ]},
  { name: "Bolt.new", provider: "StackBlitz", category: "ai-coding",
    description: "AI app builder in the browser",
    detail: "Browser-based AI development environment that generates, runs, and deploys full-stack apps. Powered by StackBlitz's WebContainers technology.",
    tiers: [
      { label: "Pro", cost: 20, billingCycle: "monthly" },
      { label: "Pro 50", cost: 50, billingCycle: "monthly" },
      { label: "Pro 100", cost: 100, billingCycle: "monthly" },
      { label: "Pro 200", cost: 200, billingCycle: "monthly" },
    ]},
  { name: "Replit", provider: "Replit", category: "ai-coding",
    description: "Browser-based IDE with AI agent",
    detail: "Cloud development platform with an AI agent that can build, debug, and deploy applications. Supports 50+ languages with instant hosting.",
    tiers: [
      { label: "Core", cost: 20, billingCycle: "monthly" },
    ]},
  { name: "JetBrains AI", provider: "JetBrains", category: "ai-coding",
    description: "AI assistant for JetBrains IDEs",
    detail: "AI code completion, generation, and chat integrated into IntelliJ, PyCharm, WebStorm, and other JetBrains IDEs.",
    tiers: [
      { label: "Pro", cost: 10, billingCycle: "monthly" },
      { label: "Ultimate", cost: 30, billingCycle: "monthly" },
    ]},
  { name: "Tabnine", provider: "Tabnine", category: "ai-coding",
    description: "AI code completion for teams",
    detail: "Privacy-focused AI code assistant that runs locally or in your cloud. Supports personalized completions trained on your codebase.",
    tiers: [
      { label: "Dev", cost: 9, billingCycle: "monthly" },
    ]},

  // AI Media
  { name: "Midjourney", provider: "Midjourney", category: "ai-media",
    description: "AI image generation from text prompts",
    detail: "AI art generator producing high-quality images from text descriptions. Popular for concept art, illustrations, and creative exploration.",
    tiers: [
      { label: "Basic", cost: 10, billingCycle: "monthly" },
      { label: "Standard", cost: 30, billingCycle: "monthly" },
      { label: "Pro", cost: 60, billingCycle: "monthly" },
      { label: "Mega", cost: 120, billingCycle: "monthly" },
    ]},
  { name: "Kling", provider: "Kuaishou", category: "ai-media",
    description: "AI video generation",
    detail: "AI video generation platform by Kuaishou that creates short video clips from text or image prompts with realistic motion.",
    tiers: [
      { label: "Standard", cost: 6.99, billingCycle: "monthly" },
      { label: "Pro", cost: 25.99, billingCycle: "monthly" },
    ]},
  { name: "Veo", provider: "Google", category: "ai-media",
    description: "AI video generation by Google DeepMind",
    detail: "Google's video generation model producing cinematic video with audio from text prompts. Accessible via Gemini, Flow, and Vertex AI.",
    tiers: [
      { label: "Via AI Pro", cost: 19.99, billingCycle: "monthly" },
      { label: "Via AI Ultra", cost: 249.99, billingCycle: "monthly" },
    ]},
  { name: "Nano Banana", provider: "Nano Banana", category: "ai-media",
    description: "AI text-to-video generator",
    detail: "AI video generator creating studio-quality 1080p videos from text or image prompts. Supports multi-scene creation with consistent characters.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
    ]},
  { name: "Suno", provider: "Suno", category: "ai-media",
    description: "AI music generation",
    detail: "AI platform that generates full songs with vocals, instruments, and lyrics from text prompts. Create custom music in seconds.",
    tiers: [
      { label: "Pro", cost: 10, billingCycle: "monthly" },
      { label: "Premier", cost: 30, billingCycle: "monthly" },
    ]},
  { name: "Eleven Labs", provider: "Eleven Labs", category: "ai-media",
    description: "AI voice synthesis and cloning",
    detail: "AI platform for generating realistic speech, cloning voices, and creating audio content. Used for podcasts, videos, and accessibility.",
    tiers: [
      { label: "Starter", cost: 5, billingCycle: "monthly" },
      { label: "Creator", cost: 22, billingCycle: "monthly" },
    ]},

  // Databases & BaaS
  { name: "Supabase", provider: "Supabase", category: "database",
    description: "Open-source Firebase alternative",
    detail: "Backend-as-a-service with Postgres database, authentication, storage, edge functions, and real-time subscriptions out of the box.",
    tiers: [
      { label: "Pro", cost: 25, billingCycle: "monthly" },
    ]},
  { name: "Firebase", provider: "Google", category: "database",
    description: "Google's app development platform",
    detail: "Backend-as-a-service with real-time database, authentication, hosting, cloud functions, and analytics. Popular for mobile and web apps.",
    tiers: [
      { label: "Blaze (by usage)", cost: 0, billingCycle: "monthly" },
    ]},
  { name: "Convex", provider: "Convex", category: "database",
    description: "Real-time backend platform",
    detail: "TypeScript-native backend with real-time sync, built-in auth, and database. Eliminates cache invalidation with end-to-end reactivity.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
      { label: "Professional", cost: 25, billingCycle: "monthly" },
    ]},
  { name: "PlanetScale", provider: "PlanetScale", category: "database",
    description: "Serverless MySQL platform",
    detail: "MySQL-compatible serverless database with branching, non-blocking schema changes, and horizontal scaling powered by Vitess.",
    tiers: [
      { label: "Single Node", cost: 5, billingCycle: "monthly" },
      { label: "Scaler Pro", cost: 39, billingCycle: "monthly" },
    ]},
  { name: "Turso", provider: "Turso", category: "database",
    description: "Edge-hosted SQLite databases",
    detail: "SQLite-compatible database built on libSQL that replicates to edge locations. Ideal for low-latency reads close to users.",
    tiers: [
      { label: "Developer", cost: 4.99, billingCycle: "monthly" },
      { label: "Scaler", cost: 25, billingCycle: "monthly" },
    ]},
  { name: "Upstash", provider: "Upstash", category: "database",
    description: "Serverless Redis and Kafka",
    detail: "Serverless Redis and Kafka with per-request pricing. Ideal for caching, rate limiting, and messaging in serverless architectures.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
      { label: "Pro 2K", cost: 280, billingCycle: "monthly" },
    ]},
  { name: "Pinecone", provider: "Pinecone", category: "database",
    description: "Managed vector database",
    detail: "Serverless vector database for AI applications. Store and query embeddings for semantic search, RAG, and recommendation systems.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
      { label: "Standard", cost: 70, billingCycle: "monthly" },
    ]},

  // Cloud Providers
  { name: "AWS", provider: "Amazon", category: "cloud",
    description: "Amazon's cloud computing platform",
    detail: "The largest cloud provider with 200+ services including EC2, S3, Lambda, and RDS. Pay-as-you-go pricing with a broad free tier.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
    ]},
  { name: "Azure", provider: "Microsoft", category: "cloud",
    description: "Microsoft's cloud platform",
    detail: "Enterprise cloud with strong .NET, Windows, and Active Directory integration. Offers VMs, App Service, Functions, and managed databases.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
    ]},
  { name: "Google Cloud", provider: "Google", category: "cloud",
    description: "Google's cloud infrastructure",
    detail: "Cloud platform known for BigQuery, GKE, and AI/ML services. Strong in data analytics, Kubernetes, and global networking.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
    ]},
  { name: "Temporal", provider: "Temporal", category: "cloud",
    description: "Durable workflow orchestration platform",
    detail: "Workflow engine for building reliable distributed applications. Handles retries, state management, and failure recovery so your code runs to completion.",
    tiers: [
      { label: "Essentials", cost: 100, billingCycle: "monthly" },
      { label: "Business", cost: 500, billingCycle: "monthly" },
    ]},

  // Hosting & Deployment
  { name: "Vercel", provider: "Vercel", category: "hosting",
    description: "Frontend cloud platform",
    detail: "Hosting platform optimized for Next.js and frontend frameworks. Provides edge functions, preview deployments, and global CDN.",
    tiers: [
      { label: "Pro", cost: 20, billingCycle: "monthly" },
    ]},
  { name: "Netlify", provider: "Netlify", category: "hosting",
    description: "Web hosting with CI/CD built in",
    detail: "Platform for deploying static sites and serverless functions with Git-based CI/CD, forms, and identity management.",
    tiers: [
      { label: "Personal", cost: 9, billingCycle: "monthly" },
      { label: "Pro", cost: 20, billingCycle: "monthly" },
    ]},
  { name: "Railway", provider: "Railway", category: "hosting",
    description: "Deploy anything with zero config",
    detail: "Infrastructure platform that deploys from GitHub with automatic builds. Supports databases, cron jobs, and any Dockerfile.",
    tiers: [
      { label: "Hobby", cost: 5, billingCycle: "monthly" },
      { label: "Pro", cost: 20, billingCycle: "monthly" },
    ]},
  { name: "Fly.io", provider: "Fly.io", category: "hosting",
    description: "Run apps close to users globally",
    detail: "Platform for running full-stack apps and databases at the edge. Deploys containers to data centers worldwide with low latency.",
    tiers: [
      { label: "", cost: 5, billingCycle: "monthly" },
    ]},
  { name: "Cloudflare", provider: "Cloudflare", category: "hosting",
    description: "CDN, DNS, and edge platform",
    detail: "Global network providing CDN, DDoS protection, DNS, Workers serverless compute, and R2 object storage.",
    tiers: [
      { label: "Pro", cost: 20, billingCycle: "monthly" },
      { label: "Business", cost: 200, billingCycle: "monthly" },
    ]},
  { name: "Render", provider: "Render", category: "hosting",
    description: "Unified cloud for apps and databases",
    detail: "Cloud platform for deploying web services, static sites, cron jobs, and managed databases with simple Git-based workflows.",
    tiers: [
      { label: "Professional", cost: 19, billingCycle: "monthly" },
    ]},
  { name: "Heroku", provider: "Heroku", category: "hosting",
    description: "Classic PaaS for web apps",
    detail: "One of the original platform-as-a-service providers. Supports multiple languages with add-on marketplace and simple Git deploys.",
    tiers: [
      { label: "Eco", cost: 5, billingCycle: "monthly" },
      { label: "Basic", cost: 7, billingCycle: "monthly" },
    ]},
  { name: "Coolify", provider: "Coolify", category: "hosting",
    description: "Self-hostable PaaS alternative",
    detail: "Open-source, self-hostable alternative to Heroku/Netlify/Vercel. Deploy apps, databases, and services on your own servers.",
    tiers: [
      { label: "Cloud", cost: 5, billingCycle: "monthly" },
    ]},
  { name: "Koyeb", provider: "Koyeb", category: "hosting",
    description: "Serverless platform for global apps",
    detail: "Developer-friendly serverless platform for deploying apps, APIs, and AI workloads globally with automatic scaling and native GPU support.",
    tiers: [
      { label: "Pro", cost: 29, billingCycle: "monthly" },
    ]},

  // Services & APIs
  { name: "Clerk", provider: "Clerk", category: "services",
    description: "Drop-in authentication and user management",
    detail: "Complete auth solution with pre-built UI components, social login, MFA, and user management dashboard. SDKs for React, Next.js, and more.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
      { label: "Pro", cost: 25, billingCycle: "monthly" },
    ]},
  { name: "Stripe", provider: "Stripe", category: "services",
    description: "Payment processing platform",
    detail: "Payment infrastructure for the internet. Handles credit cards, subscriptions, invoicing, and payouts. 2.9% + 30c per transaction.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
    ]},
  { name: "Resend", provider: "Resend", category: "services",
    description: "Developer-first email API",
    detail: "Modern email API built for developers with React Email support. Simple SDK for transactional emails with high deliverability.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
      { label: "Pro", cost: 20, billingCycle: "monthly" },
    ]},
  { name: "SendGrid", provider: "Twilio", category: "services",
    description: "Transactional and marketing email",
    detail: "Cloud-based email delivery service for transactional and marketing emails. APIs for sending, tracking, and managing email at scale.",
    tiers: [
      { label: "Essentials", cost: 19.95, billingCycle: "monthly" },
      { label: "Pro", cost: 89.95, billingCycle: "monthly" },
    ]},
  { name: "Browserbase", provider: "Browserbase", category: "services",
    description: "Serverless browser infrastructure for AI",
    detail: "Cloud browser platform for AI agents and automation. Spin up headless browsers with captcha solving, proxies, and session replay. Powers web-browsing AI workflows.",
    tiers: [
      { label: "Developer", cost: 20, billingCycle: "monthly" },
      { label: "Startup", cost: 99, billingCycle: "monthly" },
    ]},

  // Marketing
  { name: "X", provider: "X", category: "marketing",
    description: "Social media and microblogging platform",
    detail: "Social network (formerly Twitter) for real-time posts, discussions, and news. Premium tiers offer verification and enhanced features.",
    tiers: [
      { label: "Premium", cost: 8, billingCycle: "monthly" },
      { label: "Premium+", cost: 40, billingCycle: "monthly" },
    ]},
  { name: "Mailchimp", provider: "Intuit", category: "marketing",
    description: "Email marketing and automation",
    detail: "Email marketing platform with audience management, campaign builder, automations, and analytics. Popular for newsletters and drip campaigns.",
    tiers: [
      { label: "Essentials", cost: 13, billingCycle: "monthly" },
      { label: "Standard", cost: 20, billingCycle: "monthly" },
      { label: "Premium", cost: 350, billingCycle: "monthly" },
    ]},
  { name: "Canva", provider: "Canva", category: "marketing",
    description: "Online graphic design platform",
    detail: "Drag-and-drop design tool for social media graphics, presentations, posters, and marketing materials with thousands of templates.",
    tiers: [
      { label: "Pro", cost: 15, billingCycle: "monthly" },
    ]},
  { name: "Framer", provider: "Framer", category: "marketing",
    description: "No-code website builder for landing pages",
    detail: "Visual website builder with animations, CMS, and responsive design. Aimed at designers who want production sites without coding.",
    tiers: [
      { label: "Basic", cost: 10, billingCycle: "monthly" },
      { label: "Pro", cost: 30, billingCycle: "monthly" },
    ]},
  { name: "Loom", provider: "Atlassian", category: "marketing",
    description: "Async video messaging and demos",
    detail: "Screen and camera recording tool for quick video messages. Replaces meetings with shareable, commentable video walkthroughs.",
    tiers: [
      { label: "Business", cost: 15, billingCycle: "monthly" },
    ]},

  // Monitoring & Analytics
  { name: "PostHog", provider: "PostHog", category: "monitoring",
    description: "Product analytics and session replay",
    detail: "Open-source product analytics with event tracking, session replay, feature flags, A/B testing, and surveys. Self-hostable or cloud.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
    ]},
  { name: "Sentry", provider: "Sentry", category: "monitoring",
    description: "Application error tracking",
    detail: "Error monitoring and performance tracking for web and mobile apps. Captures stack traces, breadcrumbs, and release health data.",
    tiers: [
      { label: "Team", cost: 26, billingCycle: "monthly" },
      { label: "Business", cost: 80, billingCycle: "monthly" },
    ]},
  { name: "UptimeRobot", provider: "UptimeRobot", category: "monitoring",
    description: "Website uptime monitoring",
    detail: "Simple uptime monitoring service that checks your websites and APIs at regular intervals and alerts you when they go down.",
    tiers: [
      { label: "Solo", cost: 7, billingCycle: "monthly" },
      { label: "Team", cost: 29, billingCycle: "monthly" },
      { label: "Enterprise", cost: 54, billingCycle: "monthly" },
    ]},
  { name: "Datadog", provider: "Datadog", category: "monitoring",
    description: "Full-stack observability platform",
    detail: "Enterprise monitoring combining metrics, traces, logs, and security in a single platform. Covers infrastructure, APM, and real user monitoring.",
    tiers: [
      { label: "Pro", cost: 18, billingCycle: "monthly" },
      { label: "Enterprise", cost: 27, billingCycle: "monthly" },
    ]},
  { name: "Grafana Cloud", provider: "Grafana Labs", category: "monitoring",
    description: "Open-source metrics and dashboards",
    detail: "Managed Grafana, Prometheus, and Loki stack for metrics visualization, log aggregation, and alerting. Built on open-source tools.",
    tiers: [
      { label: "Pro", cost: 19, billingCycle: "monthly" },
    ]},
  { name: "BetterStack", provider: "BetterStack", category: "monitoring",
    description: "Uptime, logs, and incident management",
    detail: "Combined uptime monitoring, log management, and incident response platform. Includes status pages and on-call scheduling.",
    tiers: [
      { label: "Starter", cost: 29, billingCycle: "monthly" },
    ]},
  { name: "Honeycomb", provider: "Honeycomb", category: "monitoring",
    description: "Observability for distributed systems",
    detail: "Observability platform built around high-cardinality event data and distributed tracing. Designed for debugging complex microservice architectures.",
    tiers: [
      { label: "Pro", cost: 130, billingCycle: "monthly" },
    ]},
  { name: "LogRocket", provider: "LogRocket", category: "monitoring",
    description: "Frontend session replay and monitoring",
    detail: "Session replay tool that records user interactions, console logs, and network requests. Helps debug frontend issues by watching what users experienced.",
    tiers: [
      { label: "Team", cost: 69, billingCycle: "monthly" },
    ]},
  { name: "Checkly", provider: "Checkly", category: "monitoring",
    description: "Synthetic monitoring for APIs and sites",
    detail: "Monitors APIs and web apps with Playwright-based browser checks and API assertions. Runs checks from global locations on a schedule.",
    tiers: [
      { label: "Starter", cost: 24, billingCycle: "monthly" },
      { label: "Team", cost: 64, billingCycle: "monthly" },
    ]},
  { name: "Axiom", provider: "Axiom", category: "monitoring",
    description: "Log management and analytics",
    detail: "Cloud-native log management with unlimited data ingestion and retention. Query logs, traces, and events with a serverless architecture.",
    tiers: [
      { label: "Cloud", cost: 25, billingCycle: "monthly" },
    ]},
  { name: "PagerDuty", provider: "PagerDuty", category: "monitoring",
    description: "Incident response and on-call management",
    detail: "Incident management platform that routes alerts to on-call engineers. Handles escalation policies, schedules, and incident coordination.",
    tiers: [
      { label: "Professional", cost: 21, billingCycle: "monthly" },
      { label: "Business", cost: 41, billingCycle: "monthly" },
    ]},

  // Design
  { name: "Figma", provider: "Figma", category: "design",
    description: "Collaborative interface design tool",
    detail: "Browser-based design tool for UI/UX with real-time collaboration, prototyping, design systems, and developer handoff.",
    tiers: [
      { label: "Professional", cost: 15, billingCycle: "monthly" },
      { label: "Organization", cost: 45, billingCycle: "monthly" },
    ]},
  { name: "Mobbin", provider: "Mobbin", category: "design",
    description: "UI/UX design reference library",
    detail: "Curated library of real mobile and web app screenshots for design inspiration. Browse patterns, flows, and screens from top apps.",
    tiers: [
      { label: "Pro", cost: 10, billingCycle: "monthly" },
    ]},
  { name: "ShotDeck", provider: "ShotDeck", category: "design",
    description: "Film cinematography reference library",
    detail: "Searchable database of movie stills and cinematography references. Used by filmmakers and visual artists for lighting and composition research.",
    tiers: [
      { label: "", cost: 12.95, billingCycle: "monthly" },
    ]},
  { name: "Savee", provider: "Savee", category: "design",
    description: "Visual bookmarking for creatives",
    detail: "Image bookmarking and mood board tool for designers and creatives. Save, organize, and share visual inspiration from the web.",
    tiers: [
      { label: "Pro", cost: 9, billingCycle: "monthly" },
    ]},

  // Productivity
  { name: "Notion", provider: "Notion", category: "productivity",
    description: "All-in-one workspace for docs and projects",
    detail: "Flexible workspace combining notes, docs, wikis, project management, and databases. Popular for team knowledge bases and planning.",
    tiers: [
      { label: "Plus", cost: 12, billingCycle: "monthly" },
      { label: "Business", cost: 20, billingCycle: "monthly" },
    ]},
  { name: "Obsidian", provider: "Obsidian", category: "productivity",
    description: "Local-first Markdown knowledge base",
    detail: "Note-taking app using plain Markdown files stored locally. Supports bidirectional linking, plugins, and graph visualization. Sync is a paid add-on.",
    tiers: [
      { label: "Sync", cost: 4, billingCycle: "monthly" },
      { label: "Sync + Publish", cost: 12, billingCycle: "monthly" },
    ]},
  { name: "Slack", provider: "Salesforce", category: "productivity",
    description: "Team messaging and communication",
    detail: "Channel-based messaging platform for teams with file sharing, integrations, and searchable message history.",
    tiers: [
      { label: "Pro", cost: 8.75, billingCycle: "monthly" },
    ]},
  { name: "Linear", provider: "Linear", category: "productivity",
    description: "Fast project and issue tracker",
    detail: "Streamlined issue tracking and project management built for software teams. Known for its speed, keyboard shortcuts, and clean UI.",
    tiers: [
      { label: "Basic", cost: 8, billingCycle: "monthly" },
      { label: "Business", cost: 16, billingCycle: "monthly" },
    ]},
  { name: "Google Workspace", provider: "Google", category: "productivity",
    description: "Business email, docs, and cloud storage",
    detail: "Google's productivity suite with custom-domain Gmail, Drive, Docs, Sheets, and Meet for teams and businesses.",
    tiers: [
      { label: "Starter", cost: 7.20, billingCycle: "monthly" },
      { label: "Standard", cost: 14, billingCycle: "monthly" },
      { label: "Plus", cost: 22, billingCycle: "monthly" },
    ]},
  { name: "Granola", provider: "Granola", category: "productivity",
    description: "AI-powered meeting notepad",
    detail: "AI notepad that transcribes meeting audio and enhances your notes automatically. Customizable templates, action items, and one-click sharing to Slack, Notion, and CRM.",
    tiers: [
      { label: "Business", cost: 14, billingCycle: "monthly" },
      { label: "Enterprise", cost: 35, billingCycle: "monthly" },
    ]},

  // Dev Tools
  { name: "GitHub", provider: "GitHub", category: "dev-tools",
    description: "Code hosting and version control",
    detail: "The largest code hosting platform with Git repositories, pull requests, issues, Actions CI/CD, and package registry.",
    tiers: [
      { label: "Pro", cost: 4, billingCycle: "monthly" },
      { label: "Team", cost: 4, billingCycle: "monthly" },
    ]},
  { name: "Docker Desktop", provider: "Docker", category: "dev-tools",
    description: "Container development environment",
    detail: "Desktop app for building and running containers locally. Includes Docker Compose, Kubernetes, and integrated container management.",
    tiers: [
      { label: "Pro", cost: 9, billingCycle: "monthly" },
    ]},
  { name: "Tailscale", provider: "Tailscale", category: "dev-tools",
    description: "Zero-config mesh VPN",
    detail: "WireGuard-based mesh VPN that creates secure networks between your devices and servers without complex configuration.",
    tiers: [
      { label: "Personal Plus", cost: 5, billingCycle: "monthly" },
    ]},
  { name: "Warp Terminal", provider: "Warp", category: "dev-tools",
    description: "AI-powered modern terminal",
    detail: "GPU-accelerated terminal with AI command suggestions, collaborative features, and a modern text-editing experience.",
    tiers: [
      { label: "Build", cost: 20, billingCycle: "monthly" },
    ]},
  { name: "Raycast", provider: "Raycast", category: "dev-tools",
    description: "Productivity launcher for macOS",
    detail: "macOS launcher replacing Spotlight with extensible commands, snippets, and window management. Pro tier adds AI chat and translations.",
    tiers: [
      { label: "Pro", cost: 10, billingCycle: "monthly" },
      { label: "Pro + AI", cost: 18, billingCycle: "monthly" },
    ]},
  { name: "Wispr Flow", provider: "Wispr", category: "dev-tools",
    description: "Voice-to-text for developers",
    detail: "AI dictation tool optimized for coding workflows. Transcribes voice to text with context-aware formatting for code and prose.",
    tiers: [
      { label: "Pro", cost: 15, billingCycle: "monthly" },
    ]},
  { name: "SuperWhisper", provider: "SuperWhisper", category: "dev-tools",
    description: "Offline AI voice-to-text for macOS",
    detail: "Local-first speech-to-text app using OpenAI Whisper models. Runs entirely on-device for fast, private transcription on macOS.",
    tiers: [
      { label: "Pro", cost: 8.49, billingCycle: "monthly" },
    ]},
  { name: "n8n", provider: "n8n", category: "dev-tools",
    description: "Workflow automation platform",
    detail: "Open-source workflow automation tool with a visual editor. Connects APIs, databases, and services with 400+ integrations.",
    tiers: [
      { label: "Starter", cost: 26, billingCycle: "monthly" },
      { label: "Pro", cost: 65, billingCycle: "monthly" },
    ]},
  { name: "Stagehand", provider: "Browserbase", category: "dev-tools",
    description: "AI browser automation framework",
    detail: "Open-source SDK for AI-powered browser automation. Natural language web interactions built on Playwright with self-healing selectors and LLM integration.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "monthly" },
    ]},

  // Domains & DNS
  { name: "Namecheap", provider: "Namecheap", category: "domains",
    description: "Domain registrar and web hosting",
    detail: "Popular domain registrar with competitive pricing, free WhoisGuard privacy, and optional shared/VPS hosting.",
    tiers: [
      { label: "By usage", cost: 0, billingCycle: "yearly" },
    ]},
  { name: "Domain", provider: "", category: "domains",
    description: "Domain name registration",
    detail: "Register a domain name. Set the TLD in the name (e.g. \"Domain (.com)\"), your registrar as the provider, and the actual renewal cost.",
    tiers: [
      { label: "", cost: 10, billingCycle: "yearly" },
    ]},

  // Security & Privacy
  { name: "1Password", provider: "1Password", category: "security",
    description: "Password manager and vault",
    detail: "Secure password manager with browser extensions, autofill, and secure sharing. Stores passwords, 2FA codes, and sensitive documents.",
    tiers: [
      { label: "Individual", cost: 36, billingCycle: "yearly" },
    ]},
  { name: "Bitwarden", provider: "Bitwarden", category: "security",
    description: "Open-source password manager",
    detail: "Open-source password manager with self-hosting option. Stores passwords, TOTP codes, and secure notes across all devices.",
    tiers: [
      { label: "Premium", cost: 10, billingCycle: "yearly" },
    ]},
  { name: "Proton Mail", provider: "Proton", category: "security",
    description: "End-to-end encrypted email",
    detail: "Swiss-based encrypted email service with zero-access encryption. Includes calendar, drive, and VPN in higher tiers.",
    tiers: [
      { label: "Mail Plus", cost: 4, billingCycle: "monthly" },
      { label: "Unlimited", cost: 10, billingCycle: "monthly" },
    ]},
  { name: "Fastmail", provider: "Fastmail", category: "security",
    description: "Privacy-focused email hosting",
    detail: "Independent email provider with custom domain support, calendar, and contacts. No ads, no tracking, with fast search.",
    tiers: [
      { label: "Individual", cost: 5, billingCycle: "monthly" },
    ]},
  { name: "Mullvad VPN", provider: "Mullvad", category: "security",
    description: "Privacy-first VPN service",
    detail: "No-account VPN service focused on privacy. Uses WireGuard, accepts cash and crypto, and keeps no logs.",
    tiers: [
      { label: "", cost: 5.50, billingCycle: "monthly" },
    ]},
  { name: "iCloud+", provider: "Apple", category: "security",
    description: "Apple cloud storage and services",
    detail: "Apple's cloud storage with iCloud Drive, Photos sync, Private Relay VPN, custom email domain, and HomeKit Secure Video.",
    tiers: [
      { label: "50 GB", cost: 1, billingCycle: "monthly" },
      { label: "200 GB", cost: 3, billingCycle: "monthly" },
      { label: "2 TB", cost: 10, billingCycle: "monthly" },
    ]},
  { name: "Apple Developer Program", provider: "Apple", category: "security",
    description: "Publish apps to the App Store",
    detail: "Required membership for publishing apps to the iOS and macOS App Stores. Includes TestFlight beta testing and developer tools.",
    tiers: [
      { label: "", cost: 99, billingCycle: "yearly" },
    ]},
]

export const domainTLDs = [".com", ".dev", ".io", ".ai", ".app", ".co", ".xyz", ".sh", ".tech", ".cloud"]
export const domainRegistrars = ["Cloudflare", "Namecheap", "Porkbun"]

export function formatTierCost(tier: CatalogTier): string {
  if (tier.cost === 0) return "by usage"
  return `$${tier.cost}/${tier.billingCycle === "monthly" ? "mo" : "yr"}`
}

export function getCatalogByCategory(category: Category): CatalogItem[] {
  return catalog.filter((item) => item.category === category)
}

export function tierDisplayName(item: CatalogItem, tier: CatalogTier): string {
  return tier.label ? `${item.name} ${tier.label}` : item.name
}
