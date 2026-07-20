import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export async function getDb() {
  const workers = (await import("cloudflare:workers").catch(() => null)) as {
    env?: { DB?: D1Database };
  } | null;
  const db = workers?.env?.DB;

  if (!db) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. The public site will use its built-in defaults until platform storage is available."
    );
  }

  return drizzle(db, { schema });
}
