import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ProductPhoto } from "@/components/ProductPhoto";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/lib/cart-context";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  Banknote,
  CreditCard,
  Loader2,
  MapPin,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

type AddressDraft = {
  recipientName: string;
  phone: string;
  addressLine: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY_ADDRESS: AddressDraft = {
  recipientName: "",
  phone: "",
  addressLine: "",
  landmark: "",
  city: "",
  state: "Karnataka",
  pincode: "",
};

const DELIVERY_FEE = 30;

export default function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const savedAddresses = useQuery(api.addresses.list) ?? [];
  const placeOrder = useMutation(api.orders.place);
  const saveAddress = useMutation(api.addresses.add);

  const [step, setStep] = useState<"address" | "payment">("address");
  const [selectedAddressId, setSelectedAddressId] = useState<Id<"addresses"> | null>(
    null,
  );
  const [draft, setDraft] = useState<AddressDraft>(() => ({
    ...EMPTY_ADDRESS,
    recipientName: user?.name ?? "",
    phone: user?.phone ?? "",
  }));
  const [saveAddressChecked, setSaveAddressChecked] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">(
    "upi",
  );
  const [paying, setPaying] = useState(false);
  const [placing, setPlacing] = useState(false);

  const addressReady = (() => {
    if (selectedAddressId && savedAddresses.some((a) => a._id === selectedAddressId)) {
      return true;
    }
    return (
      draft.recipientName.trim().length > 1 &&
      /^\d{10}$/.test(draft.phone) &&
      draft.addressLine.trim().length > 4 &&
      draft.city.trim().length > 1 &&
      draft.state.trim().length > 1 &&
      /^\d{6}$/.test(draft.pincode.trim())
    );
  })();

  const activeAddress = selectedAddressId
    ? savedAddresses.find((a) => a._id === selectedAddressId)
    : null;

  async function handlePayAndPlace() {
    setPaying(true);
    setPlacing(true);

    // Payment step — test mode. A real gateway intent would be created here
    // (Razorpay/Stripe keys can be wired into this exact spot later).
    await new Promise((r) => setTimeout(r, 1400));

    try {
      let addressId: Id<"addresses"> | undefined = selectedAddressId ?? undefined;
      if (!addressId && saveAddressChecked) {
        addressId = await saveAddress({
          label: "Home",
          recipientName: draft.recipientName.trim(),
          phone: draft.phone.trim(),
          addressLine: draft.addressLine.trim(),
          landmark: draft.landmark.trim() || undefined,
          city: draft.city.trim(),
          state: draft.state.trim(),
          pincode: draft.pincode.trim(),
        });
      }

      const result = await placeOrder({
        addressId,
        address: activeAddress
          ? {
              recipientName: activeAddress.recipientName,
              phone: activeAddress.phone,
              addressLine: activeAddress.addressLine,
              landmark: activeAddress.landmark,
              city: activeAddress.city,
              state: activeAddress.state,
              pincode: activeAddress.pincode,
            }
          : {
              recipientName: draft.recipientName.trim(),
              phone: draft.phone.trim(),
              addressLine: draft.addressLine.trim(),
              landmark: draft.landmark.trim() || undefined,
              city: draft.city.trim(),
              state: draft.state.trim(),
              pincode: draft.pincode.trim(),
            },
        paymentMethod,
      });

      localStorage.setItem("kick-goli-last-order", result.orderId);
      clear();
      toast.success("Payment successful — order placed!");
      navigate(`/order-confirmation?orderId=${result.orderId}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not place the order",
      );
      setPaying(false);
      setPlacing(false);
    }
  }

  if (lines.length === 0 && !placing) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
        <ProductPhoto flavor="orange" className="h-28 w-auto opacity-70" />
        <h1 className="font-display mt-6 text-2xl">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a few bottles and come back to check out.
        </p>
        <Button className="mt-6" onClick={() => navigate("/flavors")}>
          Browse flavours
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight">Checkout</h1>

      {/* step indicator */}
      <ol className="mt-6 flex items-center gap-2 text-sm">
        {(["address", "payment"] as const).map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full border text-xs font-semibold ${
                step === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {i + 1}
            </span>
            <span className={step === s ? "font-medium" : "text-muted-foreground"}>
              {s === "address" ? "Delivery address" : "Payment"}
            </span>
            {i === 0 && <Separator orientation="vertical" className="mx-2 h-4" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {step === "address" && (
            <section className="studio-frame rounded-2xl bg-card p-5 sm:p-6">
              <h2 className="font-display flex items-center gap-2 text-lg">
                <MapPin className="size-4 text-primary" /> Delivery address
              </h2>

              {savedAddresses.length > 0 && (
                <div className="mt-4 space-y-2">
                  {savedAddresses.map((a) => (
                    <label
                      key={a._id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                        selectedAddressId === a._id
                          ? "border-primary/50 bg-accent/40"
                          : "border-border hover:border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="saved-address"
                        className="mt-1 accent-[var(--primary)]"
                        checked={selectedAddressId === a._id}
                        onChange={() => setSelectedAddressId(a._id)}
                      />
                      <span className="text-sm">
                        <span className="font-medium">
                          {a.recipientName} · {a.phone}
                        </span>
                        <span className="mt-0.5 block text-muted-foreground">
                          {a.addressLine}
                          {a.landmark ? `, ${a.landmark}` : ""}, {a.city},{" "}
                          {a.state} — {a.pincode}
                        </span>
                      </span>
                    </label>
                  ))}
                  <p className="px-1 text-xs text-muted-foreground">
                    Or enter a new address below.
                  </p>
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={draft.recipientName}
                    onChange={(e) =>
                      setDraft({ ...draft, recipientName: e.target.value })
                    }
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="phone">Phone (10 digits)</Label>
                  <Input
                    id="phone"
                    inputMode="numeric"
                    maxLength={10}
                    value={draft.phone}
                    onChange={(e) =>
                      setDraft({ ...draft, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                    }
                    placeholder="9620416948"
                    autoComplete="tel"
                  />
                  {draft.phone.length > 0 && draft.phone.length < 10 && (
                    <p className="text-xs text-destructive">Phone must be exactly 10 digits</p>
                  )}
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label htmlFor="addressLine">Address</Label>
                  <Input
                    id="addressLine"
                    value={draft.addressLine}
                    onChange={(e) =>
                      setDraft({ ...draft, addressLine: e.target.value })
                    }
                    placeholder="House / street / area"
                    autoComplete="street-address"
                  />
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label htmlFor="landmark">Landmark (optional)</Label>
                  <Input
                    id="landmark"
                    value={draft.landmark}
                    onChange={(e) =>
                      setDraft({ ...draft, landmark: e.target.value })
                    }
                    placeholder="Near the tea estate gate"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="city">City / town</Label>
                  <Input
                    id="city"
                    value={draft.city}
                    onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                    placeholder="Ajjampura"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={draft.state}
                    onChange={(e) =>
                      setDraft({ ...draft, state: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    inputMode="numeric"
                    value={draft.pincode}
                    onChange={(e) =>
                      setDraft({ ...draft, pincode: e.target.value })
                    }
                    placeholder="577547"
                  />
                </div>
              </div>

              {!selectedAddressId && savedAddresses.length > 0 && (
                <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={saveAddressChecked}
                    onChange={(e) => setSaveAddressChecked(e.target.checked)}
                    className="accent-[var(--primary)]"
                  />
                  Save this address to my account
                </label>
              )}

              <Button
                className="mt-6 w-full sm:w-auto"
                disabled={!addressReady}
                onClick={() => setStep("payment")}
              >
                Continue to payment
              </Button>
              {!addressReady && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Fill name, 10-digit phone, address, city and 6-digit pincode.
                </p>
              )}
            </section>
          )}

          {step === "payment" && (
            <section className="studio-frame rounded-2xl bg-card p-5 sm:p-6">
              <h2 className="font-display flex items-center gap-2 text-lg">
                <CreditCard className="size-4 text-primary" /> Payment
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Test mode — no real money moves. Choose how you'd pay.
              </p>

              <RadioGroup
                className="mt-4 gap-2"
                value={paymentMethod}
                onValueChange={(v) =>
                  setPaymentMethod(v as "upi" | "card" | "cod")
                }
              >
                {[
                  {
                    value: "upi",
                    icon: Smartphone,
                    title: "UPI",
                    desc: "GPay, PhonePe, Paytm — instant",
                  },
                  {
                    value: "card",
                    icon: CreditCard,
                    title: "Card",
                    desc: "Credit or debit card",
                  },
                  {
                    value: "cod",
                    icon: Banknote,
                    title: "Cash on delivery",
                    desc: "Pay the delivery partner",
                  },
                ].map((m) => (
                  <label
                    key={m.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                      paymentMethod === m.value
                        ? "border-primary/50 bg-accent/40"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={m.value} />
                    <m.icon className="size-4 text-primary" />
                    <span className="text-sm">
                      <span className="font-medium">{m.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        {m.desc}
                      </span>
                    </span>
                  </label>
                ))}
              </RadioGroup>

              {paymentMethod !== "cod" && (
                <div className="mt-4 rounded-xl border border-dashed border-border bg-cream/50 p-4 text-sm">
                  <p className="font-medium">Test payment sheet</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    In production this opens the gateway (UPI apps or a card
                    form) once payment keys are connected. For now, pressing
                    "Pay" simulates a successful ₹{(subtotal + DELIVERY_FEE).toFixed(0)}{" "}
                    payment.
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setStep("address")}
                  disabled={paying}
                >
                  Back
                </Button>
                <Button onClick={handlePayAndPlace} disabled={paying}>
                  {paying ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {paymentMethod === "cod"
                        ? "Placing order…"
                        : `Paying ₹${subtotal + DELIVERY_FEE}…`}
                    </>
                  ) : paymentMethod === "cod" ? (
                    "Place order"
                  ) : (
                    `Pay ₹${subtotal + DELIVERY_FEE}`
                  )}
                </Button>
              </div>
            </section>
          )}
        </div>

        {/* order summary */}
        <aside className="studio-frame h-fit rounded-2xl bg-card p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-lg">Order summary</h2>
          <div className="mt-4 space-y-3">
            {lines.map((line) => (
              <div key={line.productId} className="flex items-center gap-3">
                <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-cream">
                  <ProductPhoto flavor={line.imageKey} className="h-12 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{line.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {line.quantity} × ₹{line.price}
                  </p>
                </div>
                <span className="text-sm font-medium tabular-nums">
                  ₹{line.price * line.quantity}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">₹{subtotal}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="tabular-nums">₹{DELIVERY_FEE}</dd>
            </div>
            <div className="flex justify-between border-t border-border/80 pt-2 font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">₹{subtotal + DELIVERY_FEE}</dd>
            </div>
          </dl>
          {activeAddress && (
            <p className="mt-4 rounded-lg bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
              Delivering to {activeAddress.recipientName},{" "}
              {activeAddress.addressLine}, {activeAddress.city} —{" "}
              {activeAddress.pincode}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
