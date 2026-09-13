import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function requireUserId(ctx: Parameters<typeof getAuthUserId>[0]) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");
  return userId;
}

export type CartLine = {
  cartItemId: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  imageKey: string;
};

/** The signed-in user's cart joined with product details. */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return { lines: [], subtotal: 0 };

    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const lines: CartLine[] = [];
    for (const item of items) {
      const product = await ctx.db.get(item.productId);
      if (!product) continue; // product removed; a mutation cleans the line up
      lines.push({
        cartItemId: item._id,
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity: item.quantity,
        imageKey: product.imageKey,
      });
    }
    lines.sort((a, b) => a.name.localeCompare(b.name));
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
    return { lines, subtotal };
  },
});

/** Merge guest quantities into the signed-in user's DB cart (additive). */
export const mergeGuestCart = mutation({
  args: {
    items: v.array(v.object({ slug: v.string(), quantity: v.number() })),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const products = await ctx.db.query("products").collect();
    const bySlug = new Map(products.map((p) => [p.slug, p]));

    for (const item of args.items) {
      if (item.quantity <= 0) continue;
      const product = bySlug.get(item.slug);
      if (!product) continue;

      const existing = await ctx.db
        .query("cartItems")
        .withIndex("by_user_product", (q) =>
          q.eq("userId", userId).eq("productId", product._id),
        )
        .unique();
      if (existing) {
        await ctx.db.patch(existing._id, {
          quantity: Math.min(existing.quantity + item.quantity, 99),
        });
      } else {
        await ctx.db.insert("cartItems", {
          userId,
          productId: product._id,
          quantity: Math.min(item.quantity, 99),
        });
      }
    }
  },
});

export const setQuantity = mutation({
  args: { productId: v.id("products"), quantity: v.number() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    if (args.quantity < 0 || args.quantity > 99) {
      throw new Error("Invalid quantity");
    }

    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", userId).eq("productId", args.productId),
      )
      .unique();

    if (args.quantity === 0) {
      if (existing) await ctx.db.delete(existing._id);
      return;
    }

    if (existing) {
      await ctx.db.patch(existing._id, { quantity: args.quantity });
    } else {
      await ctx.db.insert("cartItems", {
        userId,
        productId: args.productId,
        quantity: args.quantity,
      });
    }
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const items = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
  },
});
