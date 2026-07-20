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

type MenuItem = {
  name: string;
  detail: string;
  price?: string;
  tag?: string;
  pairing?: string;
};

type MenuGroup = {
  category: string;
  note?: string;
  items: MenuItem[];
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

const menu: MenuGroup[] = [
  {
    category: "Soup - Homemade Daily",
    note: "Cup $3.95 · Bowl $4.95 · Pint $5.95 · Slice of bread $.50",
    items: [
      { name: "Soup of the Day", detail: "Homemade daily and served by the cup, bowl, or pint.", price: "$3.95+", tag: "Chef Recommendation", pairing: "Pairs perfectly with a half sandwich." },
      { name: "Weekly Soup Lineup", detail: "Rotating weekday soups, updated by the cafe team." },
      { name: "Bread on the Side", detail: "Add a slice of bread to make it lunch-ready.", price: "$.50" },
    ],
  },
  {
    category: "Deluxe Sandwiches",
    note: "Include cole slaw, potato salad, pasta salad, or chips.",
    items: [
      { name: "SW Turkey", detail: "Turkey, provolone, green chilis, red onions, tomato, lettuce, and chipotle mayonnaise.", price: "$10.95", tag: "Most Popular", pairing: "Order it with today's soup for the lunch move." },
      { name: "Stone Soup Club", detail: "Turkey, ham, bacon, American cheese, tomato, lettuce, and mayo on three slices of toast.", price: "$11.75", tag: "Staff Favorite" },
      { name: "Reuben", detail: "Hot pastrami and turkey, swiss cheese, sauerkraut, and 1000 island on marble rye.", price: "$11.75" },
      { name: "Buffalo Chicken Ranch", detail: "Chicken breast, provolone, buffalo ranch sauce, pickles, lettuce, tomato, and mayo.", price: "$10.95" },
      { name: "California Dreamer", detail: "Smoked turkey, avocado, provolone, lettuce, tomato, and mayo on a croissant.", price: "$11.75" },
      { name: "Veggie Supreme", detail: "Tomato, mushrooms, chilis, cucumber, peppers, olives, onion, mayo, herb cream cheese, and provolone.", price: "$10.95" },
    ],
  },
  {
    category: "Build Your Own",
    note: "Choose bread, meat, cheese, condiments, and add extras.",
    items: [
      { name: "Turkey", detail: "A clean classic with your choice of bread and condiments.", price: "$8.75" },
      { name: "Roasted Chicken", detail: "Build it with lettuce, tomato, red onion, cucumber, bell pepper, mayo, mustard, or dijon.", price: "$8.75" },
      { name: "Pastrami", detail: "A richer build-your-own option with premium meat and cheese choices.", price: "$9.75" },
      { name: "Albacore Tuna", detail: "A cafe staple for a lighter lunch.", price: "$8.75" },
      { name: "Grilled Cheese", detail: "Simple, warm, and lunch-break friendly.", price: "$7.50", tag: "Perfect Pairing", pairing: "Best with tomato soup." },
      { name: "Half Build Your Own", detail: "A smaller sandwich option when soup is the star.", price: "$6.25" },
    ],
  },
  {
    category: "Salads",
    note: "Dressings include Italian, 1000 Island, Ranch, Raspberry Vinaigrette, Honey Mustard, Balsamic Vinaigrette, and Bleu Cheese.",
    items: [
      { name: "Tossed Salad", detail: "Tossed greens, cheese, tomato, and cucumber.", price: "$4.50 / $6.95" },
      { name: "Cooks Salad", detail: "Tossed greens, turkey, ham, cheese, bell pepper, sunflower seeds, croutons, tomato, and cucumber.", price: "$6.50 / $9.95", tag: "Fresh Pick" },
      { name: "Chef Salad", detail: "Tossed greens, turkey, ham, cheese, egg, tomato, and cucumber.", price: "$6.50 / $9.95" },
      { name: "Chicken or Albacore Tuna Salad", detail: "Served on a bed of tossed greens.", price: "$6.50 / $9.95" },
      { name: "Haystack Taco Salad", detail: "A meatless taco salad option.", price: "$6.50 / $9.95" },
    ],
  },
  {
    category: "Breakfast",
    note: "Served weekday mornings.",
    items: [
      { name: "Fried Egg Sandwich - One Egg", detail: "Croissant or bagel with bacon or ham and your choice of cheese.", price: "$7.25", tag: "Morning Favorite" },
      { name: "Fried Egg Sandwich - Two Egg", detail: "Croissant or bagel with bacon or ham and your choice of cheese.", price: "$8.25" },
      { name: "Bagel", detail: "Assorted bagels.", price: "$2.00" },
      { name: "Bagel with Cream Cheese", detail: "Simple and fast for breakfast.", price: "$2.75" },
      { name: "Croissant", detail: "Buttery breakfast side.", price: "$1.75" },
    ],
  },
  {
    category: "Extras & Beverages",
    note: "Delivery available 11am-2pm.",
    items: [
      { name: "Chips, Cole Slaw, Potato Salad, or Pasta Salad", detail: "Classic side choices for sandwiches.", price: "$2.00" },
      { name: "Extra Meat", detail: "Half sandwich or whole sandwich add-on.", price: "$1.50 / $3.00" },
      { name: "Soft Drinks", detail: "Coke, Diet Coke, Root Beer, Dr. Pepper, 7up, Diet Dr Pepper, lemonade, tea, and sweet tea.", price: "$2.25 / $2.75" },
    ],
  },
];

const googleReviews = [
  {
    quote: "Broccoli soup was the best that I've tried around here.",
    author: "Rickey B. Cole",
    note: "Google review",
  },
  {
    quote: "The food was fresh, flavorful, and clearly made with quality ingredients.",
    author: "Sarah Hulcy",
    note: "Google review",
  },
  {
    quote: "Staff was very friendly and patient with me.",
    author: "Rosa",
    note: "Google review",
  },
];

function weeklySoupLineup(soupText: string) {
  return soupText
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [day = "", ...rest] = entry.split(" ");
      return {
        day,
        soups: rest.join(" ").replace(" and ", " + "),
      };
    });
}

function sandwichSpecial(sandwichText: string) {
  const [namePart, detailPart = "Turkey, provolone, green chilis, lettuce, tomato, red onion, and chipotle mayo."] =
    sandwichText.split(" with ");
  const [ingredients = detailPart, included = "Includes a side and cookie."] =
    detailPart.split(". Includes ");
  return {
    name: namePart.trim() || "SW Turkey",
    ingredients: ingredients.trim().replace(/^./, (letter) => letter.toUpperCase()),
    included: included.startsWith("Includes") ? included : `Includes ${included}`,
    price: "$10.95",
  };
}

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
  const soupMenu = menu.find((group) => group.category.includes("Soup"));
  const supportingMenus = menu.filter((group) => !group.category.includes("Soup"));
  const menuPreviewLimit = 4;
  const featuredSoup = soupMenu?.items[0] ?? { name: "Soup of the Day", detail: "Homemade daily and served by the cup, bowl, or pint." };
  const secondarySoups = soupMenu?.items.slice(1) ?? [];
  const soupLineup = weeklySoupLineup(content.soupOfWeek);
  const todaySoup = soupLineup[0];
  const sandwich = sandwichSpecial(content.sandwichOfWeek);

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
          <h1>Lunch should feel this good.</h1>
          <p className="lede">
            Steam rising from handmade soup, sandwiches stacked with care, and
            the kind of neighborhood welcome that makes a quick lunch feel personal.
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
          <span className="steam steam-one" aria-hidden="true" />
          <span className="steam steam-two" aria-hidden="true" />
          <span className="steam steam-three" aria-hidden="true" />
          <div className="photo-card photo-main">
            <span>Soup of the Week</span>
            <strong>{todaySoup ? `${todaySoup.day}: ${todaySoup.soups}` : featuredSoup.name}</strong>
          </div>
          <div className="photo-card photo-side">
            <span>Sandwich of the Week</span>
            <strong>{sandwich.name}</strong>
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

      <section className="food-story-strip" aria-label="Fresh Stone Soup Cafe food photography">
        <div className="food-frame food-frame-large">
          <span>Hot soup. Fresh bread. Lunch made with care.</span>
        </div>
        <div className="food-frame food-frame-small">
          <span>Sandwiches cut to order.</span>
        </div>
      </section>

      <section className="section specials" id="specials">
        <div className="section-heading">
          <p className="eyebrow">Updated by staff</p>
          <h2>Today&apos;s easiest yes.</h2>
          <p>{content.announcement}</p>
        </div>
        <div className="special-grid">
          <article className="featured-special">
            <span>Today&apos;s soup</span>
            <h3>{todaySoup?.soups ?? featuredSoup.name}</h3>
            <p>{todaySoup ? `${todaySoup.day}'s featured bowls, ready for pickup.` : "Fresh soup, ready for pickup."}</p>
          </article>
          <article className="sandwich-special">
            <div className="sandwich-panel">
              <div className="sandwich-topline">
                <span>Featured sandwich</span>
              <div className="special-price">{sandwich.price} deluxe</div>
              </div>
              <h3>{sandwich.name}</h3>
              <p>{sandwich.ingredients}</p>
              <div className="included-note">{sandwich.included}</div>
              <a className="button" href="tel:+18174472989">Order the Sandwich</a>
            </div>
          </article>
          <article className="daily-note">
            <span>Daily note</span>
            <h3>{content.dailySpecials}</h3>
            <div className="daily-note-actions">
              <a href="#menu">See menu</a>
              <a href="tel:+18174472989">Call ahead</a>
            </div>
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
              <h3 id="featured-soup-title">{featuredSoup.name}</h3>
              <p>{featuredSoup.detail}</p>
              <a className="button primary" href="tel:+18174472989">Order This Soup</a>
            </div>
          </article>

          <aside className="soup-sidebar" aria-label="Other soup options and weekly specials">
            <div className="weekly-note">
              <span>Weekly Special</span>
              <div className="weekly-list">
                {soupLineup.map((item) => (
                  <div key={item.day}>
                    <strong>{item.day}</strong>
                    <span>{item.soups}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="other-soups">
              <p className="mini-heading">Other Soups</p>
              {secondarySoups.map((item) => (
                <div className="quiet-soup" key={item.name}>
                  <strong>{item.name}</strong>
                  <span>{item.detail}</span>
                  {item.tag ? <em className="menu-tag">{item.tag}</em> : null}
                  {item.pairing ? <small>{item.pairing}</small> : null}
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="menu-grid supporting-menu">
          {supportingMenus.map((group) => (
            <article className="menu-card" key={group.category}>
              <h3>{group.category}</h3>
              {group.note ? <p className="menu-note">{group.note}</p> : null}
              {group.items.slice(0, menuPreviewLimit).map((item) => (
                <div className="menu-item" key={item.name}>
                  <div className="menu-title-row">
                    <strong>{item.name}</strong>
                    {item.price ? <span className="menu-price">{item.price}</span> : null}
                  </div>
                  <span>{item.detail}</span>
                  {item.tag ? <em className="menu-tag">{item.tag}</em> : null}
                  {item.pairing ? <small>{item.pairing}</small> : null}
                </div>
              ))}
              {group.items.length > menuPreviewLimit ? (
                <p className="more-menu-note">
                  + {group.items.length - menuPreviewLimit} more in the full menu
                </p>
              ) : null}
            </article>
          ))}
        </div>
        <a className="pdf-link" href="https://img1.wsimg.com/blobby/go/b707bd5e-b23c-40e9-9566-f3028ce016d1/MenurevisedJune2025.pdf">
          View full menu
        </a>
      </section>

      <section className="section story" id="story">
        <div className="story-copy">
          <p className="eyebrow">Why Burleson Loves Stone Soup</p>
          <h2>Food that feels homemade because it is treated that way.</h2>
          <p>
            Stone Soup Cafe is built on the small things people remember: fresh
            ingredients, friendly faces, warm recipes, and lunch that makes the
            day feel a little more cared for.
          </p>
        </div>
        <div className="story-points" aria-label="Stone Soup Cafe values">
          <article>
            <span>Fresh</span>
            <p>Soups rotate through the week so lunch always feels alive.</p>
          </article>
          <article>
            <span>Local</span>
            <p>A Burleson cafe with a welcome that feels familiar.</p>
          </article>
          <article>
            <span>Comfort</span>
            <p>Simple food, generous portions, and recipes made for real lunch breaks.</p>
          </article>
        </div>
      </section>

      <section className="section catering" id="catering">
        <div className="catering-hero">
          <div>
            <p className="eyebrow">Catering</p>
            <h2>We&apos;ll handle lunch.</h2>
            <p>
              Whether you&apos;re feeding five people or five hundred, Stone Soup
              makes it simple to serve something warm, fresh, and easy to love.
            </p>
            <a className="button primary" href="tel:+18174472989">Start a Catering Order</a>
          </div>
        </div>
        <div className="catering-details">
          <div>
            <p className="eyebrow">Simple planning</p>
            <h3>Tell us the day, the crowd, and what sounds good.</h3>
            <p>{content.seasonalBanner}</p>
            <ol className="process-list">
              <li><strong>Choose the plan</strong><span>Pickup or delivery, soup, sandwiches, salads, desserts, and drinks.</span></li>
              <li><strong>Share the headcount</strong><span>We help size portions for offices, families, and community groups.</span></li>
              <li><strong>Enjoy the room</strong><span>Lunch arrives simple, friendly, and ready to serve.</span></li>
            </ol>
            <div className="catering-support-card">
              <span>Popular for</span>
              <p>Office lunches, teacher meals, showers, team meetings, and easy Friday gatherings.</p>
            </div>
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
        </div>
      </section>

      <section className="gallery-band" aria-label="Stone Soup Cafe lunch details">
        <div>
          <span>Fresh bread</span>
        </div>
        <div>
          <span>Soup by the bowl</span>
        </div>
        <div>
          <span>Cookies for the finish</span>
        </div>
      </section>

      <section className="section reviews" aria-label="Customer reviews">
        <div className="reviews-heading">
          <p className="eyebrow">Google Reviews</p>
          <h2>People come back for the soup.</h2>
          <p>4.6 stars on Google, surfaced through Restaurant Guru from 244 Google reviews.</p>
        </div>
        {googleReviews.map((review) => (
          <figure key={review.quote}>
            <div className="review-meta">
              <span className="review-avatar" aria-hidden="true">{review.author.charAt(0)}</span>
              <div>
                <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                <figcaption>{review.author} · {review.note}</figcaption>
              </div>
            </div>
            <blockquote>{review.quote}</blockquote>
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

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">S</span>
          <div>
            <strong>Stone Soup Cafe</strong>
            <span>Fresh soup, sandwiches, healthy lunch, and catering in Burleson, Texas.</span>
          </div>
        </div>
        <div className="footer-grid">
          <section aria-label="Hours">
            <h2>Hours</h2>
            <p>{content.hours}</p>
          </section>
          <section aria-label="Contact">
            <h2>Visit</h2>
            <p>333 SW Wilshire Blvd Suite G<br />Burleson, TX 76028</p>
            <a href="tel:+18174472989">817.447.2989</a>
            <a href={directionsUrl}>Get directions</a>
          </section>
          <section aria-label="Quick navigation">
            <h2>Quick Links</h2>
            <a href="#specials">Today&apos;s specials</a>
            <a href="#menu">Menu</a>
            <a href="#catering">Catering</a>
            <a href="/admin">Staff dashboard</a>
          </section>
          <section aria-label="Newsletter signup">
            <h2>Lunch Notes</h2>
            <p>Get soup updates and catering reminders from the cafe.</p>
            <form className="footer-signup">
              <label>
                Email address
                <input type="email" name="email" placeholder="you@example.com" />
              </label>
              <button type="submit">Sign Up</button>
            </form>
          </section>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Stone Soup Cafe.</span>
          <span>Made for warm lunches in Burleson.</span>
        </div>
      </footer>

      <nav className="mobile-actions" aria-label="Mobile quick actions">
        <a href="tel:+18174472989">Order</a>
        <a href="tel:+18174472989">Call</a>
        <a href={directionsUrl}>Directions</a>
      </nav>
    </main>
  );
}
