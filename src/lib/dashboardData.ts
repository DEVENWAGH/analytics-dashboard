import {
  customersList,
  monthlySeries,
  transactions,
  type Customer,
  type MonthlyPoint,
  type Transaction,
} from "@/data/mock";
import { getDb } from "./mongodb";

export type DashboardData = {
  series: MonthlyPoint[];
  transactions: Transaction[];
  customers: Customer[];
  source: "mongodb" | "mock";
};

const noId = { projection: { _id: 0 } } as const;

export async function seedDatabase({ reset = false } = {}) {
  const db = await getDb();

  if (reset) {
    await Promise.all([
      db.collection("monthly").deleteMany({}),
      db.collection("transactions").deleteMany({}),
      db.collection("customers").deleteMany({}),
    ]);
  }

  const existing = await db.collection("transactions").countDocuments();
  if (existing > 0) return { seeded: false };

  await Promise.all([
    db.collection("monthly").insertMany(monthlySeries.map((row) => ({ ...row }))),
    db.collection("transactions").insertMany(transactions.map((row) => ({ ...row }))),
    db.collection("customers").insertMany(customersList.map((row) => ({ ...row }))),
  ]);
  await db.collection("transactions").createIndex({ date: -1 });

  return { seeded: true };
}

export async function loadDashboardData(): Promise<DashboardData> {
  try {
    await seedDatabase();
    const db = await getDb();

    const [series, rows, customers] = await Promise.all([
      db.collection<MonthlyPoint>("monthly").find({}, noId).sort({ date: 1 }).toArray(),
      db.collection<Transaction>("transactions").find({}, noId).sort({ date: -1 }).toArray(),
      db.collection<Customer>("customers").find({}, noId).sort({ name: 1 }).toArray(),
    ]);

    return { series, transactions: rows, customers, source: "mongodb" };
  } catch (error) {
    console.warn("MongoDB unavailable, serving mock data:", (error as Error).message);
    return {
      series: monthlySeries,
      transactions,
      customers: customersList,
      source: "mock",
    };
  }
}
