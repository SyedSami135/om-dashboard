import { NextResponse } from "next/server";
import pool, { getQualifiedTable } from "@/lib/db";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 }
    );
  }

  const table = getQualifiedTable();
  const sql = `
    SELECT
      (SELECT ARRAY_AGG(DISTINCT priority ORDER BY priority) FROM ${table} WHERE priority IS NOT NULL AND priority != '') AS priorities,
      (SELECT ARRAY_AGG(DISTINCT status ORDER BY status) FROM ${table} WHERE status IS NOT NULL AND status != '') AS statuses
  `;

  try {
    const res = await pool.query(sql);
    const row = res.rows[0] as { priorities: string[] | null; statuses: string[] | null };
    return NextResponse.json({
      priorities: row?.priorities ?? [],
      statuses: row?.statuses ?? [],
    });
  } catch (err) {
    console.error("Filters API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
