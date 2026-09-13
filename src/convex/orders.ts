import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const ORDER_STATUSES = [
  "placed",
  "preparing",
  "out_for_delivery",
  "delivered",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const DELIVERY_FEE = 30; // ₹30 flat

async function requireUserId(ctx: Parameters<typeof getAuthUserId>[0]) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");
  return userId;
}

/** Place an order from the signed-in user's DB cart. Payment is marked paid for this v1 (test-mode step on checkout). */
export const place = mutation({
  args: {
    addressId: v.optional(v.id("addresses")),
    address: v.object({
      recipientName: v.string(),
      phone: v.string(),
      addressLine: v.string(),
      landmark: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
    }),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    // Verify the address (if saved) actually belongs to this user.
    if (args.addressId !== undefined) {
      const saved = await ctx.db.get(args.addressId);
      if (!saved || saved.userId !== userId) {
        throw new Error("Invalid address");
      }
    }

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    let subtotal = 0;
    const orderItems = [];
    for (const item of cartItems) {
      const product = await ctx.db.get(item.productId);
      if (!product) continue;
      subtotal += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        nameSnapshot: product.name,
        priceSnapshot: product.price,
        imageSnapshot: product.imageKey,
        quantity: item.quantity,
      });
    }
    if (orderItems.length === 0) throw new Error("Cart is empty");

    const orderId = await ctx.db.insert("orders", {
      userId,
      status: "placed",
      totalAmount: subtotal + DELIVERY_FEE,
      deliveryFee: DELIVERY_FEE,
      paymentMethod: args.paymentMethod,
      paymentStatus: args.paymentMethod === "cod" ? "pending" : "paid",
      deliveryAddress: args.address,
      placedAt: Date.now(),
      etaMinutes: 45,
    });

    for (const item of orderItems) {
      await ctx.db.insert("orderItems", { ...item, orderId });
    }

    // Clear the user's cart after ordering.
    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return { orderId };
  },
});

/** The signed-in user's orders, newest first, with item lines. */
export const listMine = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const limited = args.limit ? orders.slice(0, args.limit) : orders;

    return Promise.all(
      limited.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_order", (q) => q.eq("orderId", order._id))
          .collect();
        return { ...order, items };
      }),
    );
  },
});

/** Single order for the owner (tracking page), with strict user scoping. */
export const getMine = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const order = await ctx.db.get(args.id);
    if (!order || order.userId !== userId) return null;
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();
    return { ...order, items };
  },
});

/** Admin: all orders with customer info and item lines. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const me = await ctx.db.get(userId);
    if (me?.role !== "admin") return null;

    const orders = await ctx.db.query("orders").order("desc").collect();
    return Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_order", (q) => q.eq("orderId", order._id))
          .collect();
        const customer = await ctx.db.get(order.userId);
        return {
          ...order,
          items,
          customerEmail: customer?.email ?? "—",
          customerName: customer?.name ?? null,
        };
      }),
    );
  },
});

/** Admin: advance order status. This is what moves the customer's tracker. */
export const setStatus = mutation({
  args: { id: v.id("orders"), status: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const me = await ctx.db.get(userId);
    if (me?.role !== "admin") throw new Error("Admin access required");
    if (!ORDER_STATUSES.includes(args.status as OrderStatus)) {
      throw new Error("Invalid status");
    }
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    await ctx.db.patch(args.id, { status: args.status });
  },
});
