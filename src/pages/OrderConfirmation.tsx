import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useSearchParams } from "react-router";
import { Link } from "react-router";
import type { Id } from "@/convex/_generated/dataModel";
import {
  SHOP_WHATSAPP_NUMBER,
  buildNewOrderMessage,
  openWhatsApp,
} from "@/lib/whatsapp";

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const { isAuthenticated, isLoading } = useAuth();

  const order = useQuery(
    api.orders.getMine,
    isAuthenticated && orderId
      ? { id: orderId as Id<"orders"> }
      : "skip",
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  function handleNotifyShop() {
    if (!order || !orderId) return;
    const message = buildNewOrderMessage({
      orderId,
      customerName:
        order.deliveryAddress.recipientName,
      phone: order.deliveryAddress.phone,
      deliveryAddress: order.deliveryAddress,
      items: order.items,
      totalAmount: order.totalAmount,
    });
    openWhatsApp(SHOP_WHATSAPP_NUMBER, message);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="size-8 text-primary" />
      </div>
      <h1 className="font-display mt-6 text-3xl tracking-tight">
        Payment successful
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Your Kick Goli Soda order is confirmed and already being prepared.
        We've saved it to your order history.
      </p>
      <div className="mt-8 flex w-full flex-col gap-2">
        <Button size="lg" asChild>
          <Link to={`/orders/${orderId}`}>Track my order</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/orders">All my orders</Link>
        </Button>
        {order && (
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-green-600/40 text-green-700 hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
            onClick={handleNotifyShop}
          >
            <MessageCircle className="size-4" />
            Notify shop on WhatsApp
          </Button>
        )}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Questions? Call the factory on 9620 416 948.
      </p>
    </div>
  );
}
