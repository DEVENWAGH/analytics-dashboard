# Northline Analytics Dashboard

1-week Mahity assignment: responsive analytics dashboard built with **React**, **TypeScript**, **Vite**, **React Router DOM**, **Tailwind CSS**, **Recharts**, and **D3**.

> Note: The `main` branch uses React + Vite + React Router DOM as requested. The earlier Next.js + MongoDB version is preserved on the `nextjs` branch.

## Features

- Sidebar + top navbar (mobile drawer with Escape + backdrop close)
- Working global navbar search and interactive notifications popover
- Overview with 4 KPI stat cards (Revenue, Users, Orders, Growth) and dynamic period deltas
- Monthly revenue area/line chart and monthly orders bar chart with D3 color scale, period average reference line, and custom tooltips
- Date range filter with month-overlap matching, reset, and invalid-range validation
- Transactions table: search, status filter, client-side offset pagination (`8` rows/page, auto-reset on filter change), and empty state
- Customers directory with search, status filter, and client-side offset pagination
- Loading and error states (demo controls on Settings)
- **Task progress** page with interactive Mon–Fri checklist and completion chart
- CSV export matching active date, search, and status filters (with spreadsheet formula-injection neutralization)
- 3 themes: Light (default), Dark, and Retro (8-bit) with anti-FOUC initialization and self-hosted Geist & Silkscreen fonts

## Stack

| Tool             | Role                                        |
| ---------------- | ------------------------------------------- |
| React 19         | Component UI & lazy route/chart splitting   |
| TypeScript       | Strict typed components, filters, and data  |
| Vite 8           | Dev server and production bundler           |
| React Router DOM | Client-side routing (`/overview`, etc.)     |
| Tailwind CSS 4   | Layout, tokens, and Light/Dark/Retro themes |
| Recharts         | Responsive SVG chart rendering              |
| D3               | Color scales, averages, number formats      |
| Lucide React     | Consistent SVG icons                        |
| date-fns         | Date validation & month/day filtering       |
| Vitest + RTL     | Unit and component integration tests        |

## Getting started

```bash
cd analytics-dashboard
bun install
bun run dev
```

Open the local dev server URL shown in your terminal.

## Scripts

```bash
bun run dev          # local development server
bun run build        # TypeScript check + Vite production build
bun run preview      # preview production build locally
bun run test         # run Vitest unit & integration suite
bun run lint         # run ESLint on JS/MJS config files (typecheck runs via tsc -b)
bun run format:check # check Prettier formatting
```

## Project structure

```text
src/
  app/                 # route views (overview, analytics, transactions, customers, settings, progress)
  components/
    layout/            # sidebar, top navbar (search + notifications), shell
    stats/             # reusable stat cards
    charts/            # revenue line + orders bar
    filters/           # date range filter
    transactions/      # table + status badge
    progress/          # interactive assignment checklist + completion chart
    theme/             # ThemeProvider + useAppTheme hook
    ui/                # loading, error, empty states
  context/             # dashboard date, search, status, and derived stats state
  data/                # deterministic mock series, transactions, customers, checklist
  lib/                 # utils, filters, csv export, chartTheme
tests/
  unit/                # pure filter, stats, and CSV unit tests
  integration/         # React Testing Library component integration tests
```

## Data & CSV export

- Uses built-in deterministic sample data in `src/data/mock.ts` (`source: "sample"`).
- Live export: **Transactions → Export CSV** (exports the currently filtered rows matching date range, search, and status).
- Static sample: [`public/sample-transactions.csv`](./public/sample-transactions.csv) or **Sample CSV** on the Transactions page.

## Themes

Light (default), Dark, and Retro (8-bit) managed by `src/components/theme/ThemeProvider.tsx` (`localStorage` persistence + pre-render `/theme-init.js` script in `index.html`). Switch in the navbar or Settings.

## Author

Deven Ishwar Wagh  
9326126931  
wagh1.2.3.002@gmail.com
