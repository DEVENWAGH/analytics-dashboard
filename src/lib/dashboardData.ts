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

declare global {
  var _seedPromise: Promise<{ seeded: boolean }> | undefined;
}

async function runSeed(reset: boolean): Promise<{ seeded: boolean }> {
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
    db.collection("monthly").bulkWrite(
      monthlySeries.map((row) => ({
        updateOne: {
          filter: { date: row.date },
          update: { $setOnInsert: { ...row } },
          upsert: true,
        },
      })),
    ),
    db.collection("transactions").bulkWrite(
      transactions.map((row) => ({
        updateOne: {
          filter: { id: row.id },
          update: { $setOnInsert: { ...row } },
          upsert: true,
        },
      })),
    ),
    db.collection("customers").bulkWrite(
      customersList.map((row) => ({
        updateOne: {
          filter: { id: row.id },
          update: { $setOnInsert: { ...row } },
          upsert: true,
        },
      })),
    ),
  ]);
  await Promise.all([
    db.collection("transactions").createIndex({ date: -1 }),
    db.collection("transactions").createIndex({ id: 1 }, { unique: true }),
    db.collection("customers").createIndex({ id: 1 }, { unique: true }),
    db.collection("monthly").createIndex({ date: 1 }, { unique: true }),
  ]);

  return { seeded: true };
}

export async function seedDatabase({ reset = false } = {}) {
  if (!reset && globalThis._seedPromise) {
    return globalThis._seedPromise;
  }

  const promise = runSeed(reset).finally(() => {
    if (globalThis._seedPromise === promise) {
      globalThis._seedPromise = undefined;
    }
  });

  if (!reset) {
    globalThis._seedPromise = promise;
  }

  return promise;
}

export async function loadDashboardData(): Promise<DashboardData> {
  try {
    const db = await getDb();

    let [series, rows, customers] = await Promise.all([
      db.collection<MonthlyPoint>("monthly").find({}, noId).sort({ date: 1 }).toArray(),
      db.collection<Transaction>("transactions").find({}, noId).sort({ date: -1 }).toArray(),
      db.collection<Customer>("customers").find({}, noId).sort({ name: 1 }).toArray(),
    ]);

    if (rows.length === 0 || series.length === 0 || customers.length === 0) {
      await seedDatabase();
      [series, rows, customers] = await Promise.all([
        db.collection<MonthlyPoint>("monthly").find({}, noId).sort({ date: 1 }).toArray(),
        db.collection<Transaction>("transactions").find({}, noId).sort({ date: -1 }).toArray(),
        db.collection<Customer>("customers").find({}, noId).sort({ name: 1 }).toArray(),
      ]);
    }

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
