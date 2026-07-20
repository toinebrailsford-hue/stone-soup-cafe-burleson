import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { requireChatGPTUser } from "../chatgpt-auth";
import { getDb } from "../../db";
import { siteContent } from "../../db/schema";
import { AdminForm } from "./AdminForm";

export const metadata: Metadata = {
  title: "Stone Soup Cafe Staff Dashboard",
  description: "Update Stone Soup Cafe specials, hours, announcements, and banners.",
};

const initialContent = {
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

async function getInitialContent() {
  try {
    const db = await getDb();
    const row = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, "homepage"))
      .get();
    if (!row?.value) return initialContent;
    const saved = JSON.parse(row.value);
    return {
      soupOfWeek: saved.soupOfWeek || initialContent.soupOfWeek,
      sandwichOfWeek: saved.sandwichOfWeek || initialContent.sandwichOfWeek,
      dailySpecials: saved.dailySpecials || initialContent.dailySpecials,
      announcement: saved.announcement || initialContent.announcement,
      seasonalBanner: saved.seasonalBanner || initialContent.seasonalBanner,
      hours: saved.hours || initialContent.hours,
    };
  } catch {
    return initialContent;
  }
}

export default async function AdminPage() {
  if (process.env.NODE_ENV === "production") {
    await requireChatGPTUser("/admin");
  }
  const content = await getInitialContent();

  return (
    <main className="admin-shell">
      <AdminForm initialContent={content} />
    </main>
  );
}
