import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { siteContent } from "../../../db/schema";

const defaultPayload = {
  soupOfWeek:
    "Monday Broccoli Cheese and Creamy Tomato with Pasta; Tuesday Baked Potato and Southwest Corn Chowder; Wednesday Chicken Enchilada and Mushroom Beer Cheese; Thursday Chicken Tortilla and Creamy Chicken Mushroom; Friday Broccoli Cheese and White Bean Chicken.",
  sandwichOfWeek:
    "SW Turkey with turkey, provolone, green chilis, lettuce, tomato, red onion, and chipotle mayo.",
  dailySpecials:
    "Soup and sandwich pairings are the lunch favorite. Ask about the freshest dessert in the case.",
  announcement: "Premium ingredients. Extraordinarily fresh. Open weekdays for breakfast and lunch.",
  seasonalBanner: "Fresh summer lunches, handmade soups, and catering trays for Burleson teams and offices.",
  hours: "Monday-Thursday 8:30 AM-3:00 PM. Friday 8:30 AM-2:30 PM. Closed Saturday and Sunday.",
};

function mergeDefaults(payload: Partial<typeof defaultPayload>) {
  return {
    soupOfWeek: payload.soupOfWeek || defaultPayload.soupOfWeek,
    sandwichOfWeek: payload.sandwichOfWeek || defaultPayload.sandwichOfWeek,
    dailySpecials: payload.dailySpecials || defaultPayload.dailySpecials,
    announcement: payload.announcement || defaultPayload.announcement,
    seasonalBanner: payload.seasonalBanner || defaultPayload.seasonalBanner,
    hours: payload.hours || defaultPayload.hours,
  };
}

async function ensureTable() {
  const db = await getDb();
  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `));
  return db;
}

export async function GET() {
  try {
    const db = await ensureTable();
    const row = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, "homepage"))
      .get();
    return Response.json({ content: row?.value ? mergeDefaults(JSON.parse(row.value)) : defaultPayload });
  } catch {
    return Response.json({ content: defaultPayload });
  }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user && process.env.NODE_ENV === "production") {
    return Response.json({ error: "Sign in is required." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const content = {
      soupOfWeek: String(payload.soupOfWeek ?? "").trim(),
      sandwichOfWeek: String(payload.sandwichOfWeek ?? "").trim(),
      dailySpecials: String(payload.dailySpecials ?? "").trim(),
      announcement: String(payload.announcement ?? "").trim(),
      seasonalBanner: String(payload.seasonalBanner ?? "").trim(),
      hours: String(payload.hours ?? "").trim(),
    };
    const db = await ensureTable();
    await db
      .insert(siteContent)
      .values({
        key: "homepage",
        value: JSON.stringify(content),
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: {
          value: JSON.stringify(content),
          updatedAt: new Date().toISOString(),
        },
      });

    return Response.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save updates.";
    return Response.json({ error: message }, { status: 500 });
  }
}
