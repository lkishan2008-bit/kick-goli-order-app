import { ProductPhoto } from "@/components/ProductPhoto";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { PackageSearch, RotateCcw } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  placed: "Order placed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-muted text-foreground/80",
  preparing: "bg-accent text-accent-foreground",
  out_for_delivery: "bg-accent text-accent-foreground",
  delivered: "bg-primary/10 text-primary",
};

export default function Orders() {
  const { isAuthenticated, isLoading } = useAuth();
  const orders = useQuery(
    api.orders.listMine,
    isAuthenticated ? {} : "skip",
  );
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (isLoading || orders === undefined) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="studio-frame h-32 animate-pulse rounded-2xl bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
        <PackageSearch className="size-10 text-muted-foreground/40" />
        <h1 className="font-display mt-4 text-2xl">No orders yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          When you order, every crate shows up here with live tracking.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/flavors">Browse flavours</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight">My orders</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {orders.length} order{orders.length > 1 ? "s" : ""} · tap any order to
        track it live.
      </p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="studio-frame studio-frame-hover rounded-2xl bg-card p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(order.placedAt).toLocaleString([], {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  · {order.items.reduce((n, i) => n + i.quantity, 0)} bottles
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status] ?? "bg-muted"}`}
              >
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {order.items.map((item) => (
                <span
                  key={item._id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-cream/60 py-1 pl-1 pr-3 text-xs"
                >
                  <span className="flex h-7 w-6 items-center justify-center overflow-hidden rounded-full bg-cream">
                    <ProductPhoto
                      flavor={item.imageSnapshot}
                      className="h-6 w-5"
                    />
                  </span>
                  {item.quantity} × {item.nameSnapshot}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
              <p className="text-sm font-semibold tabular-nums">
                ₹{order.totalAmount}{" "}
                <span className="font-normal text-muted-foreground">
                  · {order.paymentMethod.toUpperCase()}
                </span>
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    for (const item of order.items) {
                      addItem(
                        {
                          _id: item.productId,
                          slug: item.nameSnapshot
                            .toLowerCase()
                            .replace(/[^a-z]+/g, "-"),
                          name: item.nameSnapshot,
                          price: item.priceSnapshot,
                          imageKey: item.imageSnapshot,
                        },
                        item.quantity,
                      );
                    }
                    toast.success("Added last order to your cart");
                    navigate("/flavors");
                  }}
                >
                  <RotateCcw className="mr-1.5 size-3.5" /> Reorder
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/orders/${order._id}`}>Track</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
