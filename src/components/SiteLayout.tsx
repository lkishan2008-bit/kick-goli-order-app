/**
 * SiteLayout — shared chrome for the storefront: Studio header with thin
 * framing, cart drawer (Sheet), sticky mobile cart bar, and footer.
 */

import { ProductPhoto } from "@/components/ProductPhoto";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/lib/cart-context";
import {
  Check,
  ChevronDown,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  User,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";

type CartLineView = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageKey: string;
};

function CartLineRow({ line }: { line: CartLineView }) {
  const { setQuantity } = useCart();
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-cream">
        <ProductPhoto flavor={line.imageKey} className="h-14 w-10" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{line.name}</p>
        <p className="text-xs text-muted-foreground">200 ml · ₹{line.price}</p>
      </div>
      <div className="flex items-center rounded-full border border-border bg-card">
        <button
          type="button"
          aria-label="Decrease quantity"
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => setQuantity(line.productId, line.quantity - 1)}
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-medium tabular-nums">
          {line.quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:text-primary/80"
          onClick={() => setQuantity(line.productId, line.quantity + 1)}
        >
          <Plus className="size-3.5" />
        </button>
      </div>
      <span className="w-14 text-right text-sm font-semibold tabular-nums">
        ₹{line.price * line.quantity}
      </span>
    </div>
  );
}

function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { lines, subtotal, count } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const deliveryFee = lines.length > 0 ? 30 : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-border/80 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/80 px-5 py-4 text-left">
          <SheetTitle className="font-display text-lg">Your cart</SheetTitle>
          <SheetDescription className="text-xs">
            {count === 0
              ? "Nothing here yet"
              : `${count} bottle${count > 1 ? "s" : ""} · delivered chilled`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingBag className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Your cart is empty — pick a flavour to get started.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/flavors");
                }}
              >
                Browse flavours
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {lines.map((line) => (
                <CartLineRow key={line.productId} line={line} />
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border/80 bg-cream/60 px-5 py-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">₹{subtotal}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="tabular-nums">₹{deliveryFee}</dd>
              </div>
              <div className="flex justify-between border-t border-border/80 pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">₹{subtotal + deliveryFee}</dd>
              </div>
            </dl>
            <Button
              className="mt-4 w-full"
              size="lg"
              onClick={() => {
                onOpenChange(false);
                navigate(
                  isAuthenticated ? "/checkout" : "/auth?returnTo=%2Fcheckout",
                );
              }}
            >
              {isAuthenticated ? "Checkout" : "Sign in to checkout"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function StickyCartBar({ onOpenCart }: { onOpenCart: () => void }) {
  const { count, subtotal } = useCart();
  const location = useLocation();

  const hidden =
    count === 0 ||
    location.pathname === "/checkout" ||
    location.pathname.startsWith("/orders/") ||
    location.pathname === "/order-confirmation";

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 px-4 py-3 backdrop-blur md:hidden">
      <button
        type="button"
        onClick={onOpenCart}
        className="flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-primary-foreground shadow-sm transition-transform active:scale-[0.99]"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="flex size-5 items-center justify-center rounded-md bg-primary-foreground/20 text-xs font-bold tabular-nums">
            {count}
          </span>
          {count} item{count > 1 ? "s" : ""} · ₹{subtotal}
        </span>
        <span className="flex items-center gap-1 text-sm font-semibold">
          View Cart <ChevronDown className="size-4 -rotate-90" />
        </span>
      </button>
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/flavors", label: "Flavours" },
      { to: "/orders", label: "My Orders" },
      { to: "/account", label: "Account" },
    ],
    [],
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-cream">
              <ProductPhoto flavor="orange" className="h-8 w-7" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-semibold tracking-tight">
                Kick Goli Soda
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Vibhin Enterprises
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open cart"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="size-[18px]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground tabular-nums">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Button>

            {isLoading ? null : isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setAccountOpen((v) => !v)}
                >
                  <User className="size-3.5" />
                  <span className="hidden sm:inline">
                    {user?.name ?? "Account"}
                  </span>
                  <ChevronDown className="size-3.5" />
                </Button>
                {accountOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAccountOpen(false)}
                    />
                    <div className="studio-frame absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-card">
                      {navItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block px-4 py-2.5 text-sm text-foreground/90 transition-colors hover:bg-muted"
                          onClick={() => setAccountOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        type="button"
                        className="block w-full border-t border-border/80 px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted"
                        onClick={async () => {
                          setAccountOpen(false);
                          await signOut();
                          navigate("/");
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth?returnTo=%2Fflavors">Sign in</Link>
              </Button>
            )}
          </div>
        </div>

        {/* mobile nav */}
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/60 px-3 py-1.5 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <footer className="border-t border-border/80 bg-cream/50">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-base font-semibold">
              Kick Goli Soda
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
              Traditional 200 ml glass-bottle goli soda, bottled by Vibhin
              Enterprises in the heart of Chikmagalur.
            </p>
            <p className="mt-3 text-xs italic text-muted-foreground">
              “Kick the heat, feel the freshness.”
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Contact
            </p>
            <a
              href="tel:+919620416948"
              className="flex items-center gap-2 text-foreground/90 transition-colors hover:text-primary"
            >
              <Phone className="size-3.5 text-primary" /> 9620 416 948
            </a>
            <p className="mt-3 leading-6 text-muted-foreground">
              Nagarakallu Road, Ajjampura Town,
              <br />
              Tarikere, Chikmagalur — 577547,
              <br />
              Karnataka
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Ingredients
            </p>
            <p className="leading-6 text-muted-foreground">
              Carbonated RO Water, Sugar, Acidity Regulator, Natural Flavour.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <Check className="size-3 text-primary" /> Made in Karnataka
            </p>
          </div>
        </div>
        <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Vibhin Enterprises · Kick Goli Soda
        </div>
      </footer>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <StickyCartBar onOpenCart={() => setCartOpen(true)} />
    </div>
  );
}
