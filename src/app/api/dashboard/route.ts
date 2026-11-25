import { NextResponse, connection } from "next/server";
import { loadDashboardData } from "@/lib/dashboardData";

export async function GET() {
  await connection();
  const data = await loadDashboardData();
  return NextResponse.json(data);
}
