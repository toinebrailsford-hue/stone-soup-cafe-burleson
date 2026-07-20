import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { siteContent } from "../db/schema";

export const metadata: Metadata = {
  title: "Stone Soup Cafe | Fresh Soup, Sandwiches & Catering in Burleson, TX",
  description:
    "Stone Soup Cafe in Burleson, Texas serves fresh soups, sandwiches, salads, desserts, and catering for local lunches and events.",
};

type Content = {
  soupOfWeek: string;
  sandwichOfWeek: string;
  dailySpecials: string;
  announcement: string;
  seasonalBanner: string;
  hours: string;
};

const defaultContent: Content = {
  soupOfWeek:
    "Monday Broccoli Cheese and Creamy Tomato with Pasta; Tuesday Baked Potato and Southwest Corn Chowder; Wednesday Chicken Enchilada and Mushroom Beer Cheese; Thursday Chicken Tortilla and Creamy Chicken Mushroom; Friday Broccoli Cheese and White Bean Chicken.",
  sandwichOfWeek:
    "SW Turkey with turkey, provolone, green chilis, lettuce, tomato, red onion, and chipotle mayo. Includes a side and cookie.",
  dailySpecials:
    "Soup and sandwich pairings are the lunch favorite. Ask about the freshest dessert in the case when you arrive.",
  announcement: "Premium ingredients. Extraordinarily fresh. Open weekdays for breakfast and lunch.",
  seasonalBanner: "Fresh summer lunches, handmade soups, and catering trays for Burleson teams and offices.",
  hours: "Monday-Thursday 8:30 AM-3:00 PM. Friday 8:30 AM-2:30 PM. Closed Saturday and Sunday.",
};

const menu = [
  {
    category: "Soups",
    items: [
      ["Broccoli Cheese", "Velvety, comforting, and a weekly favorite."],
      ["Chicken Tortilla", "Savory chicken, gentle spice, and crisp toppings."],
      ["Baked Potato", "Creamy potato soup built for a proper lunch break."],
    ],
  },
  {
    category: "Sandwiches",
    items: [
      ["SW Turkey", "Turkey, provolone, green chilis, vegetables, and chipotle mayo."],
      ["Build Your Own", "Choose your bread, protein, cheese, vegetables, and spread."],
      ["Half Sandwich + Soup", "The fast Stone Soup classic for lunch in Burleson."],
    ],
  },
  {
    category: "Salads",
    items: [
      ["House Salad", "Crisp greens, fresh vegetables, and your choice of dressing."],
      ["Chicken Salad Plate", "A lighter lunch with the cafe's handmade feel."],
      ["Seasonal Bowl", "Fresh produce-driven specials when available."],
    ],
  },
  {
    category: "Desserts & Drinks",
    items: [
      ["Cookie Included", "Select lunches include a cookie for the sweetest finish."],
      ["Cupcakes", "Rotating flavors from the bakery case."],
      ["Tea & Soft Drinks", "Easy pairings for pickup, dine-in, or office orders."],
    ],
  },
];

const reviews = [
  "Fresh, friendly, and exactly what a local cafe should be.",
  "The soup and sandwich combo is the lunch move in Burleson.",
  "Reliable catering, warm service, and food people actually finish.",
];

async function getContent(): Promise<Content> {
  try {
    const db = await getDb();
    const row = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, "homepage"))
      .get();
    if (!row?.value) return defaultContent;
    const saved = JSON.parse(row.value) as Partial<Content>;
    return {
      soupOfWeek: saved.soupOfWeek || defaultContent.soupOfWeek,
      sandwichOfWeek: saved.sandwichOfWeek || defaultContent.sandwichOfWeek,
      dailySpecials: saved.dailySpecials || defaultContent.dailySpecials,
      announcement: saved.announcement || defaultContent.announcement,
      seasonalBanner: saved.seasonalBanner || defaultContent.seasonalBanner,
      hours: saved.hours || defaultContent.hours,
    };
  } catch {
    return defaultContent;
  }
}

function JsonLd({ content }: { content: Content }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Stone Soup Cafe",
    servesCuisine: ["American", "Soup", "Sandwiches", "Healthy Lunch", "Catering"],
    url: "https://stonesouptexas.com",
    telephone: "+18174472989",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "333 SW Wilshire Blvd Suite G",
      addressLocality: "Burleson",
      addressRegion: "TX",
      postalCode: "76028",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:30",
        closes: "15:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "08:30",
        closes: "14:30",
      },
    ],
    hasMenu: "#menu",
    makesOffer: {
      "@type": "Offer",
      name: "Today's Specials",
      description: `${content.soupOfWeek} ${content.sandwichOfWeek}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function Home() {
  const content = await getContent();
  const encodedAddress = encodeURIComponent("333 SW Wilshire Blvd Suite G Burleson TX 76028");
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const soupMenu = menu.find((group) => group.category === "Soups");
  const supportingMenus = menu.filter((group) => group.category !== "Soups");
  const featuredSoup = soupMenu?.items[0] ?? ["Broccoli Cheese", "Velvety, comforting, and a weekly favorite."];
  const secondarySoups = soupMenu?.items.slice(1) ?? [];

  return (
    <main>
      <JsonLd content={content} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Stone Soup Cafe home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Stone Soup Cafe</span>
        </a>
        <nav>
          <a href="#specials">Specials</a>
          <a href="#menu">Menu</a>
          <a href="#catering">Catering</a>
          <a href="#visit">Visit</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Burleson, Texas • Fresh weekday lunch</p>
          <h1>Handmade soup, stacked sandwiches, and catering with a local heart.</h1>
          <p className="lede">
            Stone Soup Cafe is the easy choice for a warm lunch, a quick pickup order,
            or food that makes the whole office pause for a better meal.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button primary" href="tel:+18174472989">Call to Order</a>
            <a className="button" href="#specials">Today&apos;s Specials</a>
            <a className="button ghost" href={directionsUrl}>Directions</a>
          </div>
          <dl className="open-card" aria-label="Current restaurant details">
            <div>
              <dt>Open</dt>
              <dd>{content.hours}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>333 SW Wilshire Blvd Suite G, Burleson, TX</dd>
            </div>
          </dl>
        </div>
        <div className="hero-visual" aria-label="Fresh soup and sandwich lunch photography">
          <div className="photo-card photo-main">
            <span>Soup of the Week</span>
            <strong>{content.soupOfWeek.split(";")[0]}</strong>
          </div>
          <div className="photo-card photo-side">
            <span>Sandwich of the Week</span>
            <strong>{content.sandwichOfWeek}</strong>
          </div>
        </div>
      </section>

      <section className="quick-strip" aria-label="Fast actions">
        <a href="tel:+18174472989">Order Pickup</a>
        <a href="#specials">View Specials</a>
        <a href="#menu">View Menu</a>
        <a href="#catering">Order Catering</a>
        <a href={directionsUrl}>Find Directions</a>
      </section>

      <section className="section specials" id="specials">
        <div className="section-heading">
          <p className="eyebrow">Updated by staff</p>
          <h2>Today&apos;s easiest yes.</h2>
          <p>{content.announcement}</p>
        </div>
        <div className="special-grid">
          <article>
            <span>Today&apos;s soup</span>
            <h3>{content.soupOfWeek}</h3>
          </article>
          <article>
            <span>Featured sandwich</span>
            <h3>{content.sandwichOfWeek}</h3>
          </article>
          <article>
            <span>Daily note</span>
            <h3>{content.dailySpecials}</h3>
          </article>
        </div>
      </section>

      <section className="section menu-section" id="menu">
        <div className="section-heading">
          <p className="eyebrow">Menu</p>
          <h2>Built for lunch-hour clarity.</h2>
          <p>Scan fast, choose confidently, and call when you&apos;re ready for pickup.</p>
        </div>

        <div className="soup-showcase" aria-labelledby="featured-soup-title">
          <article className="featured-soup-card">
            <div className="featured-soup-photo" aria-label="Creamy soup with sandwich and iced tea" />
            <div className="featured-soup-copy">
              <span className="badge">Chef&apos;s Pick</span>
              <p className="eyebrow">Today&apos;s Featured Soup</p>
              <h3 id="featured-soup-title">{featuredSoup[0]}</h3>
              <p>{featuredSoup[1]}</p>
              <a className="button primary" href="tel:+18174472989">Order This Soup</a>
            </div>
          </article>

          <aside className="soup-sidebar" aria-label="Other soup options and weekly specials">
            <div className="weekly-note">
              <span>Weekly Special</span>
              <strong>{content.soupOfWeek}</strong>
            </div>
            <div className="other-soups">
              <p className="mini-heading">Other Soups</p>
              {secondarySoups.map(([name, detail]) => (
                <div className="quiet-soup" key={name}>
                  <strong>{name}</strong>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="menu-grid supporting-menu">
          {supportingMenus.map((group) => (
            <article className="menu-card" key={group.category}>
              <h3>{group.category}</h3>
              {group.items.map(([name, detail]) => (
                <div className="menu-item" key={name}>
                  <strong>{name}</strong>
                  <span>{detail}</span>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="section catering" id="catering">
        <div>
          <p className="eyebrow">Catering</p>
          <h2>Bring Stone Soup to your meeting, shower, team lunch, or local event.</h2>
          <p>{content.seasonalBanner}</p>
          <ul className="check-list">
            <li>Soup, sandwich, salad, dessert, and drink-friendly menus</li>
            <li>Pickup or delivery planning</li>
            <li>Friendly portions for offices, families, and community groups</li>
          </ul>
        </div>
        <form className="catering-form" aria-label="Catering request form">
          <label>Date<input type="date" name="date" required /></label>
          <label>Guest count<input type="number" name="guests" min="1" placeholder="25" required /></label>
          <label>Budget<input type="text" name="budget" placeholder="$250-$400" /></label>
          <label>Pickup or delivery<select name="fulfillment"><option>Pickup</option><option>Delivery</option></select></label>
          <label>Preferred menu<textarea name="menu" placeholder="Soup and sandwich trays, salads, desserts..." /></label>
          <label>Business name<input type="text" name="business" placeholder="Company or event name" /></label>
          <label>Contact information<input type="text" name="contact" placeholder="Name, phone, and email" required /></label>
          <a className="button primary full" href="tel:+18174472989">Call to Request Catering</a>
        </form>
      </section>

      <section className="section reviews" aria-label="Customer reviews">
        {reviews.map((review) => (
          <figure key={review}>
            <blockquote>{review}</blockquote>
            <figcaption>Local customer</figcaption>
          </figure>
        ))}
      </section>

      <section className="section about" id="visit">
        <div>
          <p className="eyebrow">Why Stone Soup</p>
          <h2>Premium ingredients without the premium fuss.</h2>
          <p>
            This is the kind of neighborhood cafe people remember: warm service,
            fresh food, simple choices, and a lunch experience that respects your time.
          </p>
        </div>
        <div className="visit-card">
          <h3>Visit Us</h3>
          <p>333 SW Wilshire Blvd Suite G<br />Burleson, TX 76028</p>
          <p><a href="tel:+18174472989">817.447.2989</a></p>
          <p>{content.hours}</p>
          <a className="button primary full" href={directionsUrl}>Get Directions</a>
        </div>
      </section>

      <footer>
        <strong>Stone Soup Cafe</strong>
        <span>Fresh soup, sandwiches, healthy lunch, and catering in Burleson, Texas.</span>
        <a href="/admin">Staff dashboard</a>
      </footer>

      <nav className="mobile-actions" aria-label="Mobile quick actions">
        <a href="tel:+18174472989">Order</a>
        <a href="tel:+18174472989">Call</a>
        <a href={directionsUrl}>Directions</a>
      </nav>
    </main>
  );
}
