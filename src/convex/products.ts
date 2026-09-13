import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Canonical catalog — the 7 Kick Goli Soda flavors (200ml glass bottles). */
export const CATALOG = [
  {
    slug: "cola",
    name: "Kick Goli Cola",
    description:
      "The classic — deep, caramel-sweet cola with that sharp goli fizz only a marble bottle can give.",
    price: 25,
    imageKey: "cola",
  },
  {
    slug: "blueberry",
    name: "Kick Goli Blueberry",
    description:
      "Cool blue and bursting with berry. A crowd favourite at every summer wedding and school gate.",
    price: 30,
    imageKey: "blueberry",
  },
  {
    slug: "green-apple",
    name: "Kick Goli Green Apple",
    description:
      "Crisp green-apple tang with a clean finish. Sharp enough to wake you up on a hot afternoon.",
    price: 30,
    imageKey: "green-apple",
  },
  {
    slug: "original",
    name: "Kick Goli Original",
    description:
      "The original clear goli soda, exactly as it has been poured for generations — pure fizz, zero fuss.",
    price: 25,
    imageKey: "original",
  },
  {
    slug: "orange",
    name: "Kick Goli Orange",
    description:
      "Sun-ripened orange notes over a bright, fizzy body. The one that made goli soda famous.",
    price: 25,
    imageKey: "orange",
  },
  {
    slug: "lemon",
    name: "Kick Goli Lemon",
    description:
      "Zesty lemon with a clean citrus bite. Kick the heat, feel the freshness — this is the one.",
    price: 25,
    imageKey: "lemon",
  },
  {
    slug: "rose",
    name: "Kick Goli Rose",
    description:
      "Soft rose water sweetness in a pink, marble-stoppered bottle. Gentle, fragrant, unmistakable.",
    price: 30,
    imageKey: "rose",
  },
] as const;

/**
 * Idempotent seed: inserts any catalog products missing from the DB. Called by
 * the app once per session so a fresh deployment always has the 7 flavors.
 */
export const ensureSeeded = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").collect();
    const bySlug = new Map(existing.map((p) => [p.slug, p]));
    let inserted = 0;
    for (const item of CATALOG) {
      if (!bySlug.has(item.slug)) {
        await ctx.db.insert("products", {
          slug: item.slug,
          name: item.name,
          description: item.description,
          price: item.price,
          imageKey: item.imageKey,
          active: true,
        });
        inserted++;
      }
    }
    return inserted;
  },
});

/** Public catalog of active products. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products
      .filter((p) => p.active)
      .sort(
        (a, b) =>
          CATALOG.findIndex((c) => c.slug === a.slug) -
          CATALOG.findIndex((c) => c.slug === b.slug),
      );
  },
});
