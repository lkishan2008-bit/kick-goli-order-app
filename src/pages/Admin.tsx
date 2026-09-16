import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { ClipboardList, Lock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
  buildOrderUpdateMessage,
  openWhatsApp,
} from "@/lib/whatsapp";
import { Link } from "react-router";

const STATUS_FLOW = ["placed", "preparing", "out_for_delivery", "delivered"] as const;

const STATUS_LABELS: Record<string, string> = {
  placed: "Order placed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export default function Admin() {
  const { user, isLoading } = useAuth();
  const orders = useQuery(api.orders.listAll, user?.role === "admin" ? {} : "skip");
  const setStatus = useMutation(api.orders.setStatus);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="studio-frame h-48 animate-pulse rounded-2xl bg-muted/50" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <Lock className="size-6 text-muted-foreground" />
        </div>
        <h1 className="font-display mt-5 text-2xl">Owner access only</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This console is for Vibhin Enterprises staff. If you're the owner,
          sign in with the admin email configured for this deployment.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link to="/orders">Back to my orders</Link>
        </Button>
      </div>
    );
  }

  const allOrders = orders ?? [];
  const active = allOrders.filter((o) => o.status !== "delivered");
  const delivered = allOrders.filter((o) => o.status === "delivered");
  const revenue = allOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((n, o) => n + o.totalAmount, 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        Vibhin Enterprises
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight">
        Owner console
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Incoming orders — move a status and the customer's tracker updates
        instantly.
      </p>

      {/* stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active orders", value: active.length },
          { label: "Delivered", value: delivered.length },
          {
            label: "Collected",
            value: `₹${revenue}`,
          },
        ].map((s) => (
          <div key={s.label} className="studio-frame rounded-2xl bg-card p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {s.label}
            </p>
            <p className="font-display mt-2 text-3xl tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* orders */}
      <h2 className="font-display mt-10 flex items-center gap-2 text-xl">
        <ClipboardList className="size-4 text-primary" /> Orders
      </h2>

      {orders === undefined || orders === null ? (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="studio-frame h-28 animate-pulse rounded-2xl bg-muted/50"
            />
          ))}
        </div>
      ) : allOrders.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No orders yet. They'll appear here the moment a customer pays.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {allOrders.map((order) => {
            const currentIndex = STATUS_FLOW.indexOf(
              order.status as (typeof STATUS_FLOW)[number],
            );
            const next = STATUS_FLOW[currentIndex + 1];
            return (
              <div
                key={order._id}
                className="studio-frame rounded-2xl bg-card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      #{order._id.slice(-8).toUpperCase()}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {order.customerName ?? order.customerEmail}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(order.placedAt).toLocaleString([], {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {order.deliveryAddress.city} —{" "}
                      {order.deliveryAddress.pincode}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={order.status === "delivered" ? "text-primary" : ""}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                    {next && (
                      <Select
                        value={order.status}
                        onValueChange={async (v) => {
                          try {
                            await setStatus({ id: order._id, status: v });
                            toast.success(
                              `Order #${order._id.slice(-8).toUpperCase()} → ${STATUS_LABELS[v]}`,
                            );
                          } catch {
                            toast.error("Could not update status");
                          }
                        }}
                      >
                        <SelectTrigger size="sm" className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_FLOW.map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-green-600/40 text-green-700 hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                      onClick={() =>
                        openWhatsApp(
                          order.deliveryAddress.phone,
                          buildOrderUpdateMessage({
                            orderId: order._id,
                            status: order.status,
                          }),
                        )
                      }
                    >
                      <MessageCircle className="size-3.5" />
                      WhatsApp
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {order.items.map((item) => (
                    <span
                      key={item._id}
                      className="rounded-full bg-muted/70 px-2.5 py-1"
                    >
                      {item.quantity} × {item.nameSnapshot}
                    </span>
                  ))}
                  <span className="rounded-full bg-muted/70 px-2.5 py-1 font-medium text-foreground">
                    ₹{order.totalAmount} · {order.paymentMethod.toUpperCase()}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Deliver to: {order.deliveryAddress.recipientName},{" "}
                  {order.deliveryAddress.addressLine}
                  {order.deliveryAddress.landmark
                    ? `, ${order.deliveryAddress.landmark}`
                    : ""}
                  , {order.deliveryAddress.city} · Phone{" "}
                  {order.deliveryAddress.phone}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
