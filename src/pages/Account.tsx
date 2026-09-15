import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import {
  LogOut,
  MapPin,
  Plus,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function OwnerConsoleEntry() {
  const role = useQuery(api.profile.myRole);
  const claimAdmin = useMutation(api.profile.claimAdmin);
  const [claiming, setClaiming] = useState(false);
  const { user } = useAuth();

  if (role === "admin") {
    return (
      <div className="mt-6 flex items-center justify-between rounded-xl border border-primary/30 bg-accent/40 p-4">
        <div className="text-sm">
          <p className="flex items-center gap-2 font-medium">
            <ShieldCheck className="size-4 text-primary" /> Owner access
            enabled
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            You can manage incoming orders in the console.
          </p>
        </div>
        <Button size="sm" asChild>
          <a href="/admin">Open console</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-dashed border-border p-4">
      <p className="text-sm font-medium">Vibhin Enterprises staff?</p>
      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
        Claim the owner console with your registered admin email to manage
        incoming orders.
      </p>
      <Button
        size="sm"
        variant="outline"
        className="mt-3"
        disabled={claiming}
        onClick={async () => {
          if (!user?.email) return;
          setClaiming(true);
          try {
            await claimAdmin({ email: user.email });
            toast.success("Owner access enabled");
            window.location.reload();
          } catch (err) {
            toast.error(
              err instanceof Error
                ? err.message
                : "Could not enable owner access",
            );
          } finally {
            setClaiming(false);
          }
        }}
      >
        {claiming ? "Checking…" : "Claim owner access"}
      </Button>
    </div>
  );
}

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const addresses = useQuery(api.addresses.list) ?? [];
  const updateProfile = useMutation(api.profile.updateProfile);
  const addAddress = useMutation(api.addresses.add);
  const removeAddress = useMutation(api.addresses.remove);
  const setDefaultAddress = useMutation(api.addresses.setDefault);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [phoneError, setPhoneError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [draftPhoneError, setDraftPhoneError] = useState("");
  const [draft, setDraft] = useState({
    label: "Home",
    recipientName: "",
    phone: "",
    addressLine: "",
    landmark: "",
    city: "",
    state: "Karnataka",
    pincode: "",
  });

  async function handleSaveProfile() {
    const digits = phone.replace(/\D/g, "");
    if (phone.trim() !== "" && digits.length !== 10) {
      setPhoneError("Phone must be exactly 10 digits");
      return;
    }
    setPhoneError("");
    setSavingProfile(true);
    try {
      await updateProfile({ name: name.trim(), phone: digits });
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleAddAddress() {
    const addrDigits = draft.phone.replace(/\D/g, "");
    if (addrDigits.length !== 10) {
      setDraftPhoneError("Phone must be exactly 10 digits");
      return;
    }
    setDraftPhoneError("");
    try {
      await addAddress({
        label: draft.label.trim() || "Address",
        recipientName: draft.recipientName.trim(),
        phone: addrDigits,
        addressLine: draft.addressLine.trim(),
        landmark: draft.landmark.trim() || undefined,
        city: draft.city.trim(),
        state: draft.state.trim(),
        pincode: draft.pincode.trim(),
      });
      toast.success("Address saved");
      setShowForm(false);
      setDraftPhoneError("");
      setDraft({
        label: "Home",
        recipientName: "",
        phone: "",
        addressLine: "",
        landmark: "",
        city: "",
        state: "Karnataka",
        pincode: "",
      });
    } catch {
      toast.error("Could not save address — check the fields");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl tracking-tight">Account</h1>

      {/* profile */}
      <section className="studio-frame mt-8 rounded-2xl bg-card p-5 sm:p-6">
        <h2 className="font-display flex items-center gap-2 text-lg">
          <UserRound className="size-4 text-primary" /> Profile
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Signed in as {user?.email ?? "guest"}
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="acc-name">Name</Label>
            <Input
              id="acc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="acc-phone">Phone</Label>
            <Input
              id="acc-phone"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(digits);
                setPhoneError("");
              }}
              placeholder="9620416948"
            />
            {phoneError && (
              <p className="text-xs text-destructive">{phoneError}</p>
            )}
          </div>
        </div>
        <Button
          className="mt-4"
          size="sm"
          onClick={handleSaveProfile}
          disabled={savingProfile}
        >
          Save changes
        </Button>
      </section>

      {/* addresses */}
      <section className="studio-frame mt-6 rounded-2xl bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display flex items-center gap-2 text-lg">
            <MapPin className="size-4 text-primary" /> Saved addresses
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus className="mr-1 size-3.5" /> Add
          </Button>
        </div>

        {showForm && (
          <div className="mt-4 grid gap-3 rounded-xl border border-dashed border-border p-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="ad-label">Label</Label>
              <Input
                id="ad-label"
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="Home / Shop"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ad-name">Recipient</Label>
              <Input
                id="ad-name"
                value={draft.recipientName}
                onChange={(e) =>
                  setDraft({ ...draft, recipientName: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ad-phone">Phone (10 digits)</Label>
              <Input
                id="ad-phone"
                inputMode="numeric"
                maxLength={10}
                value={draft.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setDraft({ ...draft, phone: digits });
                  setDraftPhoneError("");
                }}
              />
              {draftPhoneError && (
                <p className="text-xs text-destructive">{draftPhoneError}</p>
              )}
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="ad-line">Address</Label>
              <Input
                id="ad-line"
                value={draft.addressLine}
                onChange={(e) =>
                  setDraft({ ...draft, addressLine: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="ad-landmark">Landmark (optional)</Label>
              <Input
                id="ad-landmark"
                value={draft.landmark}
                onChange={(e) =>
                  setDraft({ ...draft, landmark: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ad-city">City</Label>
              <Input
                id="ad-city"
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ad-state">State</Label>
              <Input
                id="ad-state"
                value={draft.state}
                onChange={(e) => setDraft({ ...draft, state: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ad-pin">Pincode</Label>
              <Input
                id="ad-pin"
                inputMode="numeric"
                value={draft.pincode}
                onChange={(e) =>
                  setDraft({ ...draft, pincode: e.target.value })
                }
              />
            </div>
            <div className="flex items-end">
              <Button size="sm" onClick={handleAddAddress}>
                Save address
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          {addresses.length === 0 && !showForm && (
            <p className="text-sm text-muted-foreground">
              No saved addresses yet — add one for faster checkout.
            </p>
          )}
          {addresses.map((a) => (
            <div
              key={a._id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border p-3.5"
            >
              <div className="text-sm">
                <p className="flex items-center gap-2 font-medium">
                  {a.label}
                  {a.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                      <Star className="size-2.5" /> Default
                    </span>
                  )}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {a.recipientName} · {a.phone}
                  <br />
                  {a.addressLine}
                  {a.landmark ? `, ${a.landmark}` : ""}, {a.city}, {a.state} —{" "}
                  {a.pincode}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {!a.isDefault && (
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Set default"
                    onClick={async () => {
                      await setDefaultAddress({ id: a._id });
                      toast.success("Default address updated");
                    }}
                  >
                    <Star className="size-4" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete address"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={async () => {
                    await removeAddress({ id: a._id });
                    toast.success("Address removed");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* owner console entry — only useful for Vibhin staff */}
      <OwnerConsoleEntry />

      <Separator className="my-8" />

      <Button
        variant="outline"
        className="text-destructive hover:text-destructive"
        onClick={async () => {
          await signOut();
          navigate("/");
        }}
      >
        <LogOut className="mr-2 size-4" /> Sign out
      </Button>
    </div>
  );
}
