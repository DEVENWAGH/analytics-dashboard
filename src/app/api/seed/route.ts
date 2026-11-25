import { NextResponse, connection } from "next/server";
import { seedDatabase } from "@/lib/dashboardData";

export async function POST() {
  await connection();

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seeding is disabled in production." }, { status: 403 });
  }

  try {
    const result = await seedDatabase({ reset: true });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
