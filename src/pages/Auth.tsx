import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { BottleFamily, ProductPhoto } from "@/components/ProductPhoto";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, ShoppingBag, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/flavors",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(
        `Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 px-4 py-12 lg:grid-cols-2">
        {/* brand panel — bottles do the talking */}
        <div className="order-2 hidden flex-col items-center text-center lg:order-1 lg:flex">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-cream">
              <ProductPhoto flavor="orange" className="h-8 w-7" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold tracking-tight">
                Kick Goli Soda
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Vibhin Enterprises
              </span>
            </span>
          </Link>
          <BottleFamily className="mt-12" />
          <p className="font-display mt-8 max-w-sm text-2xl leading-snug">
            Kick the heat, feel the freshness.
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Sign in to keep your cart, addresses and orders on your account —
            ready on any device.
          </p>
        </div>

        {/* form panel */}
        <div className="order-1 lg:order-2">
          <div className="studio-frame mx-auto w-full max-w-sm rounded-2xl bg-card">
            {step === "signIn" ? (
              <>
                <div className="border-b border-border/70 px-6 pb-5 pt-6 text-center lg:hidden">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2"
                    aria-label="Back to home"
                  >
                    <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-cream">
                      <ProductPhoto
                        flavor="orange"
                        className="h-7 w-6"
                      />
                    </span>
                    <span className="font-display text-base font-semibold">
                      Kick Goli Soda
                    </span>
                  </Link>
                </div>
                <div className="px-6 pb-6 pt-6">
                  <h1 className="font-display text-2xl tracking-tight">
                    Sign in to order
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Enter your email — we'll send a 6-digit code.
                  </p>

                  <form onSubmit={handleEmailSubmit} className="mt-5">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-destructive">{error}</p>
                    )}
                    <Button
                      type="submit"
                      className="mt-4 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <>
                          Send code <ArrowRight className="ml-1.5 size-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-2 text-xs uppercase tracking-wide text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-5 w-full"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                  >
                    <ShoppingBag className="mr-2 size-4" />
                    Keep browsing as guest
                  </Button>

                  <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <UserX className="size-3" />
                    Guest carts merge into your account when you sign in.
                  </p>
                </div>
              </>
            ) : (
              <div className="px-6 pb-6 pt-8 text-center">
                <h1 className="font-display text-2xl tracking-tight">
                  Check your email
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  We sent a 6-digit code to {step.email}
                </p>
                <form onSubmit={handleOtpSubmit} className="mt-6">
                  <input type="hidden" name="email" value={step.email} />
                  <input type="hidden" name="code" value={otp} />
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          otp.length === 6 &&
                          !isLoading
                        ) {
                          const form = (e.target as HTMLElement).closest(
                            "form",
                          );
                          if (form) form.requestSubmit();
                        }
                      }}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && (
                    <p className="mt-3 text-sm text-destructive">{error}</p>
                  )}
                  <Button
                    type="submit"
                    className="mt-6 w-full"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        Verify &amp; continue{" "}
                        <ArrowRight className="ml-1.5 size-4" />
                      </>
                    )}
                  </Button>
                </form>
                <p className="mt-4 text-sm text-muted-foreground">
                  Didn't receive it?{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => setStep("signIn")}
                  >
                    Try again
                  </Button>
                </p>
              </div>
            )}
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            <Link to="/flavors" className="underline hover:text-foreground">
              Continue browsing without an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
