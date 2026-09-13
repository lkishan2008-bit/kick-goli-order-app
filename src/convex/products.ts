import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { CATALOG } from "../data/catalog";

export { CATALOG };

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
