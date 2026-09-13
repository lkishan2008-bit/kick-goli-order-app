import { ProductPhoto } from "@/components/ProductPhoto";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Check, Clock, MapPin, PackageSearch } from "lucide-react";
import { Link, useParams } from "react-router";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";

const STEPS = [
  { key: "placed", label: "Order Placed", desc: "We've received your order" },
  { key: "preparing", label: "Preparing", desc: "Bottles being packed" },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    desc: "On the way to you",
  },
  { key: "delivered", label: "Delivered", desc: "Enjoy the fizz!" },
] as const;

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const { isAuthenticated, isLoading } = useAuth();

  const order = useQuery(
    api.orders.getMine,
    isAuthenticated && orderId ? { id: orderId as Id<"orders"> } : "skip",
  );

  if (isLoading || order === undefined) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="studio-frame h-64 animate-pulse rounded-2xl bg-muted/50" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
        <PackageSearch className="size-10 text-muted-foreground/40" />
        <h1 className="font-display mt-4 text-2xl">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This order may belong to a different account.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/orders">My orders</Link>
        </Button>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.key === order.status);
  const eta = new Date(order.placedAt + order.etaMinutes * 60_000);
  const etaText = eta.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        Order #{order._id.slice(-8).toUpperCase()}
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-tight">
        {order.status === "delivered"
          ? "Delivered — enjoy!"
          : stepIndex === 2
            ? "On its way"
            : "We're on it"}
      </h1>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm studio-frame">
        <Clock className="size-3.5 text-primary" />
        {order.status === "delivered" ? (
          <span>Delivered</span>
        ) : (
          <span>
            Estimated by <strong>{etaText}</strong>
          </span>
        )}
      </div>

      {/* stepper */}
      <div className="studio-frame mt-8 rounded-2xl bg-card p-6">
        <ol className="relative">
          {STEPS.map((step, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span
                    className={`absolute left-[13px] top-7 h-[calc(100%-28px)] w-px ${
                      i < stepIndex ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
                <span
                  className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : active
                        ? "border-primary bg-card"
                        : "border-border bg-card"
                  }`}
                >
                  {done ? (
                    <Check className="size-3.5" />
                  ) : active ? (
                    <motion.span
                      className="size-2.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                      transition={{ repeat: Infinity, duration: 1.6 }}
                    />
                  ) : (
                    <span className="size-2.5 rounded-full bg-border" />
                  )}
                </span>
                <div className="pt-0.5">
                  <p
                    className={`text-sm font-medium ${
                      done || active ? "" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* summary */}
      <div className="studio-frame mt-6 rounded-2xl bg-card p-6">
        <h2 className="font-display text-lg">Order summary</h2>
        <div className="mt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item._id} className="flex items-center gap-3">
              <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-cream">
                <ProductPhoto flavor={item.imageSnapshot} className="h-12 w-9" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.nameSnapshot}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} × ₹{item.priceSnapshot}
                </p>
              </div>
              <span className="text-sm font-medium tabular-nums">
                ₹{item.priceSnapshot * item.quantity}
              </span>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd className="tabular-nums">₹{order.deliveryFee}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>Total paid</dt>
            <dd className="tabular-nums">₹{order.totalAmount}</dd>
          </div>
        </dl>
        <Separator className="my-4" />
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="font-medium">{order.deliveryAddress.recipientName}</p>
            <p className="text-muted-foreground">
              {order.deliveryAddress.addressLine}
              {order.deliveryAddress.landmark
                ? `, ${order.deliveryAddress.landmark}`
                : ""}
              , {order.deliveryAddress.city}, {order.deliveryAddress.state} —{" "}
              {order.deliveryAddress.pincode}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Phone: {order.deliveryAddress.phone} · Paid via{" "}
              {order.paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to="/orders">All orders</Link>
        </Button>
        <Button className="flex-1" asChild>
          <Link to="/flavors">Order again</Link>
        </Button>
      </div>
    </div>
  );
}
