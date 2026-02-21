# UI Redesign Design

## Goal
Redesign vibe-costs for a clean, efficient, modern experience. Blue/indigo accent, dark mode, responsive layout, Recharts charts, streamlined page structure.

## Color System

- Primary: indigo `oklch(0.585 0.233 277)` (~#4f46e5)
- Dark mode background: `oklch(0.145 0.014 277)` — slight blue tint, not pure black
- Chart colors: indigo, sky, emerald, amber, rose
- Dark mode toggle: light/dark/system, persisted to localStorage, applied via class on `<html>`

## Layout & Navigation

### Desktop (>768px)
- Collapsible sidebar: expanded (w-64) or collapsed (w-16, icons only)
- Collapse toggle at sidebar bottom
- Dark mode toggle in sidebar, above collapse button
- Active nav state: indigo background tint

### Mobile (<768px)
- Sidebar hidden
- Bottom tab bar: Dashboard, Subscriptions, Projects, Settings
- Content padding reduced to p-4

## Dashboard Page

Top to bottom:
1. **Stat row** — 3 cards: Monthly Total, Yearly Total, Active Subscriptions. Indigo accent on amounts.
2. **Charts row** — side-by-side:
   - Left: AreaChart showing projected monthly spend (flat line from current total, payment dates marked). Evolves when historical/API tracking is added.
   - Right: PieChart/donut for category breakdown. Click segment opens breakdown dialog.
3. **Payment Calendar** — calendar + selected-date subscription list. Stacks vertically on mobile.
4. **Removed:** category and project card grids. Category info lives in donut chart. Project breakdown moves to Projects page.

## Subscriptions Page

1. **Header** — title + "Add Custom" button + "Browse Catalog" button
2. **Subscription table** — primary focus, always visible. Columns: Service, Category, Project, Cost, Next Payment (new), Status, Actions.
3. **Catalog as Sheet** — "Browse Catalog" opens a right-side Sheet with category tabs and catalog cards. Selecting an item closes sheet and opens pre-filled add dialog.
4. **Add/Edit Dialog** — unchanged.

## Projects Page

- Add a cost summary card at the top
- Table unchanged

## Settings Page

- Add "Theme" section at top (light/dark/system toggle)
- Export, Import, Danger Zone sections unchanged

## Components

| Component | Action |
|---|---|
| `ui/sheet.tsx` | Install via shadcn |
| `ui/chart.tsx` | Install via shadcn (Recharts wrapper) |
| `theme-toggle.tsx` | New — toggle button |
| `layout/sidebar.tsx` | Rewrite — collapsible, responsive, indigo |
| `layout/mobile-nav.tsx` | New — bottom tab bar |
| `index.css` | Rewrite tokens — indigo primary, dark mode |
| `pages/dashboard.tsx` | Rewrite — stats + charts + calendar |
| `pages/subscriptions.tsx` | Refactor — table primary, catalog in Sheet |
| `pages/projects.tsx` | Minor — add summary card |
| `pages/settings.tsx` | Minor — add Theme section |
| `App.tsx` | Update — theme provider, responsive layout |

## Dependencies

- `recharts` (added via shadcn chart component)

## No Changes

- No new pages or routes
- No data model changes
- Store logic untouched
