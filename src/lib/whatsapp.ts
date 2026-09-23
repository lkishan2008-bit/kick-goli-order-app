/**
 * WhatsApp notification helpers for Kick Goli Soda.
 *
 * Change SHOP_WHATSAPP_NUMBER here to update it across the entire app.
 * Format: country-code + number, no spaces or dashes (e.g. "919620416948").
 */
export const SHOP_WHATSAPP_NUMBER = "919620416948";

/** Open a WhatsApp chat link in a new tab. */
export function openWhatsApp(phone: string, message: string) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

type OrderItem = {
  nameSnapshot: string;
  quantity: number;
};

type DeliveryAddress = {
  recipientName: string;
  phone: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
};

/**
 * Builds the customer→shop message sent after a successful order placement.
 * Sent TO the shop number so the owner can see the new order details.
 */
export function buildNewOrderMessage(params: {
  orderId: string;
  customerName: string;
  phone: string;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  totalAmount: number;
}): string {
  const shortId = params.orderId.slice(-8).toUpperCase();
  const itemLines = params.items
    .map((i) => `  • ${i.quantity} × ${i.nameSnapshot}`)
    .join("\n");
  const addr = params.deliveryAddress;
  const fullAddress = [
    addr.addressLine,
    addr.landmark,
    addr.city,
    addr.state,
    addr.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    `🥤 *New Kick Goli Order — #${shortId}*\n\n` +
    `*Customer:* ${params.customerName}\n` +
    `*Phone:* ${params.phone}\n\n` +
    `*Items:*\n${itemLines}\n\n` +
    `*Total:* ₹${params.totalAmount}\n\n` +
    `*Deliver to:* ${addr.recipientName}\n${fullAddress}\n` +
    `*Contact:* ${addr.phone}`
  );
}

/**
 * Builds the shop→customer confirmation message sent from the Admin page.
 * Sent TO the customer's phone to let them know their order is on the way.
 */
export function buildOrderUpdateMessage(params: {
  orderId: string;
  status: string;
}): string {
  const shortId = params.orderId.slice(-8).toUpperCase();
  const statusLine =
    params.status === "out_for_delivery"
      ? "Your Kick Goli Soda order is *out for delivery* and will reach you shortly! 🛵"
      : "Your Kick Goli Soda order *has been confirmed* and is being prepared! 🥤";

  return (
    `Hi! This is Kick Goli Soda.\n\n` +
    `${statusLine}\n\n` +
    `Order ID: *#${shortId}*\n\n` +
    `Thank you for ordering with us! 🙏`
  );
}
