import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateProfile = mutation({
  args: { name: v.string(), phone: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    await ctx.db.patch(userId, {
      name: args.name.trim() || undefined,
      phone: args.phone.trim() || undefined,
    });
  },
});

/**
 * One-time admin bootstrap: a user whose email matches ADMIN_EMAIL env var
 * claims the admin role by calling this once after signing in. Set
 * ADMIN_EMAIL in the Convex dashboard environment variables.
 */
export const claimAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error("ADMIN_EMAIL is not configured on the deployment");
    }
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const normalized = args.email.trim().toLowerCase();
    if (normalized !== adminEmail.trim().toLowerCase()) {
      throw new Error("This email is not authorized for admin access");
    }
    await ctx.db.patch(userId, { role: "admin" });
    return true;
  },
});

export const myRole = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const me = await ctx.db.get(userId);
    return me?.role ?? null;
  },
});
