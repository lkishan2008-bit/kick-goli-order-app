import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function requireUserId(ctx: Parameters<typeof getAuthUserId>[0]) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");
  return userId;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    label: v.string(),
    recipientName: v.string(),
    phone: v.string(),
    addressLine: v.string(),
    landmark: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    pincode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const existing = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const id = await ctx.db.insert("addresses", {
      ...args,
      userId,
      isDefault: existing.length === 0,
    });

    // Cap saved addresses at 10 per user.
    if (existing.length >= 10) {
      const oldest = existing
        .filter((a) => a._id !== id)
        .sort((a, b) => a._creationTime - b._creationTime)[0];
      if (oldest) await ctx.db.delete(oldest._id);
    }
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("addresses") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const address = await ctx.db.get(args.id);
    if (!address || address.userId !== userId) {
      throw new Error("Address not found");
    }
    await ctx.db.delete(args.id);
  },
});

export const setDefault = mutation({
  args: { id: v.id("addresses") },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const address = await ctx.db.get(args.id);
    if (!address || address.userId !== userId) {
      throw new Error("Address not found");
    }
    const all = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const a of all) {
      await ctx.db.patch(a._id, { isDefault: a._id === args.id });
    }
  },
});
