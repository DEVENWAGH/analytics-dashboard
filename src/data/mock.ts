export type TransactionStatus = "completed" | "pending" | "failed" | "refunded";

export type Transaction = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  method: string;
};

export type MonthlyPoint = {
  month: string;
  date: string;
  revenue: number;
  orders: number;
  users: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  status: "active" | "churned" | "new";
};

const customers = [
  "Ava Patel",
  "Noah Chen",
  "Mia Rodriguez",
  "Liam Brooks",
  "Sophia Kim",
  "Ethan Wallace",
  "Olivia Grant",
  "Lucas Meyer",
  "Emma Torres",
  "Mason Clarke",
  "Isabella Nguyen",
  "James Harper",
  "Amelia Shaw",
  "Benjamin Cruz",
  "Charlotte Reed",
  "Henry Ortiz",
  "Harper Singh",
  "Alexander Bloom",
  "Evelyn Park",
  "Sebastian Hale",
  "Aria Quinn",
  "Jack Donovan",
  "Scarlett Hayes",
  "Daniel Frost",
];

const methods = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"];
const statuses: TransactionStatus[] = [
  "completed",
  "completed",
  "completed",
  "pending",
  "failed",
  "refunded",
];

function seed(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

export const monthlySeries: MonthlyPoint[] = [
  { month: "Jan", date: "2026-01-01", revenue: 42100, orders: 312, users: 1840 },
  { month: "Feb", date: "2026-02-01", revenue: 45820, orders: 340, users: 1912 },
  { month: "Mar", date: "2026-03-01", revenue: 51240, orders: 378, users: 2044 },
  { month: "Apr", date: "2026-04-01", revenue: 48760, orders: 361, users: 2108 },
  { month: "May", date: "2026-05-01", revenue: 55310, orders: 402, users: 2240 },
  { month: "Jun", date: "2026-06-01", revenue: 60120, orders: 438, users: 2388 },
  { month: "Jul", date: "2026-07-01", revenue: 57840, orders: 420, users: 2456 },
  { month: "Aug", date: "2026-08-01", revenue: 62450, orders: 455, users: 2590 },
  { month: "Sep", date: "2026-09-01", revenue: 65980, orders: 481, users: 2712 },
  { month: "Oct", date: "2026-10-01", revenue: 71240, orders: 520, users: 2864 },
  { month: "Nov", date: "2026-11-01", revenue: 74560, orders: 544, users: 2988 },
  { month: "Dec", date: "2026-12-01", revenue: 80120, orders: 590, users: 3120 },
];

export const transactions: Transaction[] = Array.from({ length: 64 }, (_, i) => {
  const day = 1 + Math.floor(seed(i + 3) * 27);
  const month = 1 + Math.floor(seed(i + 11) * 11);
  const customer = customers[i % customers.length];
  const amount = Math.round(28 + seed(i + 21) * 920) * (seed(i) > 0.85 ? 4 : 1);

  return {
    id: `ORD-${2400 + i}`,
    customer,
    email: `${customer.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    amount,
    status: statuses[Math.floor(seed(i + 7) * statuses.length)],
    date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    method: methods[i % methods.length],
  };
}).sort((a, b) => b.date.localeCompare(a.date));

export const customersList: Customer[] = customers.map((name, i) => ({
  id: `CUS-${1000 + i}`,
  name,
  email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
  orders: 2 + Math.floor(seed(i + 5) * 28),
  spent: Math.round(120 + seed(i + 9) * 8400),
  joined: `2025-${String(1 + (i % 12)).padStart(2, "0")}-${String(3 + (i % 24)).padStart(2, "0")}`,
  status: (["active", "active", "new", "churned"] as const)[
    Math.floor(seed(i + 2) * 4)
  ],
}));

export type AssignmentTask = {
  id: string;
  day: string;
  title: string;
  items: { id: string; label: string; done: boolean }[];
};

export const assignmentTasks: AssignmentTask[] = [
  {
    id: "mon",
    day: "Monday",
    title: "Setup and shell",
    items: [
      { id: "m1", label: "Next.js + Tailwind + folder structure", done: true },
      { id: "m2", label: "Sidebar + top navbar layout", done: true },
      { id: "m3", label: "Mobile drawer navigation", done: true },
    ],
  },
  {
    id: "tue",
    day: "Tuesday",
    title: "Stats and routes",
    items: [
      { id: "t1", label: "4 statistics cards with icons and % change", done: true },
      { id: "t2", label: "5 pages with App Router routes", done: true },
    ],
  },
  {
    id: "wed",
    day: "Wednesday",
    title: "Charts and date filter",
    items: [
      { id: "w1", label: "Line chart: monthly revenue (Recharts + tooltip)", done: true },
      { id: "w2", label: "Bar chart: monthly orders (Recharts + tooltip)", done: true },
      { id: "w3", label: "Date range filter with reset and validation", done: true },
    ],
  },
  {
    id: "thu",
    day: "Thursday",
    title: "Transactions and states",
    items: [
      { id: "th1", label: "Table: search, status filter, pagination", done: true },
      { id: "th2", label: "Empty, loading, and error states", done: true },
      { id: "th3", label: "Responsive polish", done: true },
    ],
  },
  {
    id: "fri",
    day: "Friday",
    title: "Ship",
    items: [
      { id: "f1", label: "README + screenshots", done: true },
      { id: "f2", label: "GitHub push + Vercel/Netlify deploy", done: false },
      { id: "f3", label: "Bonus: dark theme + CSV export", done: true },
    ],
  },
];
