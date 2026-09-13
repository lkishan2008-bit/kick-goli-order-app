/**
 * Cart context — the single source of truth for the cart.
 *
 * - Signed out: cart lives in localStorage (guest browsing).
 * - Signed in: cart is persisted in the Convex database, isolated per user
 *   (every query/mutation is scoped to the authenticated user server-side).
 * - On sign-in, the guest cart is merged into the user's DB cart once.
 */

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageKey: string;
};

type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addItem: (product: { _id: string; slug: string; name: string; price: number; imageKey: string }, qty?: number) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  isSynced: boolean;
};

const CartContext = createContext<CartState | null>(null);

const LS_KEY = "kick-goli-cart";

function readGuestCart(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeGuestCart(cart: Record<string, number>) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  } catch {
    // storage unavailable — ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const dbCart = useQuery(
    api.cart.get,
    isAuthenticated ? {} : "skip",
  ) as { lines: CartLine[]; subtotal: number } | undefined;
  const mergeGuest = useMutation(api.cart.mergeGuestCart);
  const setDbQuantity = useMutation(api.cart.setQuantity);
  const clearDb = useMutation(api.cart.clear);

  const [guestCart, setGuestCart] = useState<Record<string, number>>(() =>
    readGuestCart(),
  );
  const mergeAttempted = useRef(false);

  // Guest lines need names/prices from the product catalog.
  const products = useQuery(api.products.list) ?? [];

  // Merge guest cart into the DB cart once, right after sign-in.
  useEffect(() => {
    if (!isAuthenticated || isLoading || mergeAttempted.current) return;
    mergeAttempted.current = true;
    const guest = readGuestCart();
    const items = Object.entries(guestCart).map(([slug, quantity]) => ({
      slug,
      quantity,
    }));
    if (items.length > 0) {
      mergeGuest({ items })
        .then(() => {
          localStorage.removeItem(LS_KEY);
          setGuestCart({});
        })
        .catch(() => {
          // merge failed; keep guest cart for a retry next session
          mergeAttempted.current = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  const lines: CartLine[] = useMemo(() => {
    if (isAuthenticated) {
      return (dbCart?.lines ?? []).map((l) => ({
        productId: l.productId,
        slug: l.slug,
        name: l.name,
        price: l.price,
        quantity: l.quantity,
        imageKey: l.imageKey,
      }));
    }
    return Object.entries(guestCart).map(([slug, quantity]) => {
      const product = products.find((p) => p.slug === slug);
      return {
        productId: product?._id ?? slug,
        slug,
        name: product?.name ?? slug,
        price: product?.price ?? 0,
        quantity,
        imageKey: product?.imageKey ?? "original",
      };
    });
  }, [isAuthenticated, dbCart, guestCart, products]);

  const count = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines],
  );
  const subtotal = useMemo(
    () => lines.reduce((n, l) => n + l.price * l.quantity, 0),
    [lines],
  );

  const addItem: CartState["addItem"] = useCallback(
    (product, qty = 1) => {
      if (isAuthenticated) {
        const existing = lines.find((l) => l.productId === product._id);
        setDbQuantity({
          productId: product._id as Id<"products">,
          quantity: Math.min((existing?.quantity ?? 0) + qty, 99),
        });
      } else {
        setGuestCart((prev) => {
          const next = {
            ...prev,
            [product.slug]: Math.min((prev[product.slug] ?? 0) + qty, 99),
          };
          writeGuestCart(next);
          return next;
        });
      }
    },
    [isAuthenticated, lines, setDbQuantity],
  );

  const setQuantityFn: CartState["setQuantity"] = useCallback(
    (productId, qty) => {
      if (isAuthenticated) {
        setDbQuantity({ productId: productId as Id<"products">, quantity: qty });
      } else {
        setGuestCart((prev) => {
          const next = { ...prev };
          const line = lines.find((l) => l.productId === productId);
          const key = line?.slug ?? productId;
          if (qty <= 0) delete next[key];
          else next[key] = Math.min(qty, 99);
          writeGuestCart(next);
          return next;
        });
      }
    },
    [isAuthenticated, lines, setDbQuantity],
  );

  const clear = useCallback(() => {
    if (isAuthenticated) {
      clearDb({});
    } else {
      setGuestCart({});
      writeGuestCart({});
    }
  }, [isAuthenticated, clearDb]);

  const value = useMemo<CartState>(
    () => ({
      lines,
      count,
      subtotal,
      addItem,
      setQuantity: setQuantityFn,
      clear,
      isSynced: isAuthenticated ? dbCart !== undefined : true,
    }),
    [lines, count, subtotal, addItem, setQuantityFn, clear, isAuthenticated, dbCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
