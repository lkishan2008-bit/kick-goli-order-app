import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      phone: v.optional(v.string()),
    }).index("email", ["email"]),

    products: defineTable({
      slug: v.string(),
      name: v.string(),
      description: v.string(),
      price: v.number(),
      imageKey: v.string(),
      active: v.boolean(),
    }).index("slug", ["slug"]),

    cartItems: defineTable({
      userId: v.id("users"),
      productId: v.id("products"),
      quantity: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_product", ["userId", "productId"]),

    addresses: defineTable({
      userId: v.id("users"),
      label: v.string(),
      recipientName: v.string(),
      phone: v.string(),
      addressLine: v.string(),
      landmark: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      pincode: v.string(),
      isDefault: v.optional(v.boolean()),
    }).index("by_user", ["userId"]),

    orders: defineTable({
      userId: v.id("users"),
      status: v.string(),
      totalAmount: v.number(),
      deliveryFee: v.number(),
      paymentMethod: v.string(),
      paymentStatus: v.string(),
      deliveryAddress: v.object({
        recipientName: v.string(),
        phone: v.string(),
        addressLine: v.string(),
        landmark: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        pincode: v.string(),
      }),
      placedAt: v.number(),
      etaMinutes: v.number(),
    }).index("by_user", ["userId"]),

    orderItems: defineTable({
      orderId: v.id("orders"),
      productId: v.id("products"),
      nameSnapshot: v.string(),
      priceSnapshot: v.number(),
      imageSnapshot: v.string(),
      quantity: v.number(),
    }).index("by_order", ["orderId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
