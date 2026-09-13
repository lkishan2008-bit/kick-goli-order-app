import { ProductPhoto } from "@/components/ProductPhoto";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/lib/cart-context";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CATALOG } from "@/data/catalog";
import { toast } from "sonner";

export default function Flavors() {
  const queryProducts = useQuery(api.products.list);
  const ensureSeeded = useMutation(api.products.ensureSeeded);
  const seedAttempted = useRef(false);

  const products =
    queryProducts && queryProducts.length > 0
      ? queryProducts
      : CATALOG.map((p) => ({ ...p, _id: p.slug }));

  // If the catalog hasn't been seeded yet on this deployment, seed it now.
  useEffect(() => {
    if ((!queryProducts || queryProducts.length === 0) && !seedAttempted.current) {
      seedAttempted.current = true;
      ensureSeeded().catch(() => {});
    }
  }, [queryProducts, ensureSeeded]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          The range
        </p>
        <h1 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">
          Seven flavours
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Every bottle is 200 ml of marble-stoppered glass, priced ₹25–30. Add
          what you like — your cart follows your account across devices.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="studio-frame h-80 animate-pulse rounded-2xl bg-muted/50"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <FlavorCard key={p._id} product={p} />
          ))}
        </div>
      )}

      <AddAllSeven products={products} />
    </div>
  );
}

function FlavorCard({
  product,
}: {
  product: {
    _id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    imageKey: string;
  };
}) {
  const { addItem, lines } = useCart();
  const [qty, setQty] = useState(1);
  const inCart = lines.find((l) => l.productId === product._id)?.quantity ?? 0;

  return (
    <Card className="studio-frame studio-frame-hover flex flex-col overflow-hidden border-border/80 py-0 gap-0">
      <CardHeader className="items-center border-b border-border/60 bg-cream/50 pb-2 pt-6">
        <ProductPhoto flavor={product.imageKey} className="h-40 w-auto" />
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-4">
        <CardTitle className="text-base">{product.name}</CardTitle>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>
        {inCart > 0 && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            <Check className="size-3" /> {inCart} in cart
          </p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3 border-t border-border/60 pb-4 pt-4">
        <div>
          <p className="text-lg font-semibold tabular-nums">₹{product.price}</p>
          <p className="text-[11px] text-muted-foreground">200 ml bottle</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-5 text-center text-sm tabular-nums">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:text-primary/80"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <Button
            size="sm"
            onClick={() => {
              addItem(product, qty);
              toast.success(
                inCart === 0
                  ? `Added ${qty} × ${product.name}`
                  : `Updated ${product.name} — ${inCart + qty} in cart`,
              );
            }}
          >
            <ShoppingBag className="mr-1 size-3.5" />
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function AddAllSeven({
  products,
}: {
  products: Array<{
    _id: string;
    slug: string;
    name: string;
    price: number;
    imageKey: string;
  }>;
}) {
  const { addItem, lines } = useCart();
  if (products.length === 0) return null;

  const total = products.reduce((n, p) => n + p.price, 0);
  const allInCart =
    products.length > 0 &&
    products.every(
      (p) =>
        (lines.find((l) => l.productId === p._id)?.quantity ?? 0) >= 1,
    );

  return (
    <div className="studio-frame mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-card px-5 py-5 sm:flex-row">
      <div>
        <p className="font-display text-lg">Can't pick one?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add one of each — all seven flavours for ₹{total}.
        </p>
      </div>
      <Button
        variant={allInCart ? "outline" : "default"}
        disabled={allInCart}
        onClick={() => {
          for (const p of products) addItem(p, 1);
          toast.success("Added one of each — all 7 flavours");
        }}
      >
        {allInCart ? (
          <>
            <Check className="mr-1.5 size-4" /> All 7 in cart
          </>
        ) : (
          "Add one of each"
        )}
      </Button>
    </div>
  );
}
