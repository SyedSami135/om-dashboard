import { Pool } from "pg";

const pool =
  globalThis.__pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") globalThis.__pool = pool;

declare global {
  var __pool: Pool | undefined;
}

function sanitizeIdentifier(name: string): string {
  return /^[a-zA-Z0-9_]+$/.test(name) ? name : "";
}

export function getTableName(): string {
  const raw = process.env.TABLE_NAME ?? "oem_returns";
  return sanitizeIdentifier(raw) || "oem_returns";
}

/** Returns schema-qualified table for SQL, e.g. "customer_support"."om_dashboard_ai" */
export function getQualifiedTable(): string {
  const schema = sanitizeIdentifier(process.env.TABLE_SCHEMA ?? "");
  const table = getTableName();
  if (schema) return `"${schema}"."${table}"`;
  return `"${table}"`;
}

export default pool;
