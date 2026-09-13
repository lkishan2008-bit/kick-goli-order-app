import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router";
import { Link } from "react-router";

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
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
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Questions? Call the factory on 9620 416 948.
      </p>
    </div>
  );
}
