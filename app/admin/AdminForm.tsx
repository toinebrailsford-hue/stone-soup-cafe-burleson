"use client";

import { useEffect, useState } from "react";

type Content = {
  soupOfWeek: string;
  sandwichOfWeek: string;
  dailySpecials: string;
  announcement: string;
  seasonalBanner: string;
  hours: string;
};

const fields: Array<[keyof Content, string, string]> = [
  ["soupOfWeek", "Soup of the Week", "Monday Broccoli Cheese; Tuesday Baked Potato..."],
  ["sandwichOfWeek", "Sandwich of the Week", "SW Turkey with provolone and chipotle mayo"],
  ["dailySpecials", "Daily Specials", "Soup and sandwich combo, dessert case notes..."],
  ["hours", "Hours", "Monday-Thursday 8:30 AM-3:00 PM..."],
  ["announcement", "Announcement", "Open weekdays for breakfast and lunch"],
  ["seasonalBanner", "Seasonal Banner", "Fresh summer lunches and office catering trays"],
];

export function AdminForm({ initialContent }: { initialContent: Content }) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState("Ready to update the public site.");

  useEffect(() => {
    async function loadContent() {
      const response = await fetch("/api/site-content", { cache: "no-store" });
      const data = await response.json();
      setContent((current) => ({ ...current, ...data.content }));
    }
    loadContent().catch(() => setStatus("Using the starter content until storage is available."));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving...");
    const response = await fetch("/api/site-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error ?? "Unable to save updates.");
      return;
    }
    setContent((current) => ({ ...current, ...data.content }));
    setStatus("Saved. Refresh the public site to see the latest updates.");
  }

  return (
    <section className="admin-panel">
      <p className="eyebrow">Staff dashboard</p>
      <h1>Update Stone Soup Cafe without touching code.</h1>
      <p className="lede">
        Keep lunch-time information current: soup, sandwich, hours, announcements,
        and seasonal catering messages.
      </p>
      <form onSubmit={submit}>
        {fields.map(([key, label, placeholder]) => (
          <label key={key}>
            {label}
            <textarea
              value={content[key]}
              placeholder={placeholder}
              onChange={(event) =>
                setContent((current) => ({ ...current, [key]: event.target.value }))
              }
            />
          </label>
        ))}
        <div className="admin-actions">
          <button className="button primary" type="submit">Save Updates</button>
          <a className="button" href="/">View Public Site</a>
          <span className="status" role="status" aria-live="polite">{status}</span>
        </div>
      </form>
    </section>
  );
}
