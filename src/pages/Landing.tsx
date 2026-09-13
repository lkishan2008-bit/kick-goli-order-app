import { BottleFamily } from "@/components/BottleArt";
import { FactoryScene } from "@/components/FactoryScene";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";

export default function Landing() {
  return (
    <div>
      {/* ————— Hero ————— */}
      <section className="relative overflow-hidden border-b border-border/70">
        {/* faint radial washes keep it airy, never colorful */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 10%, rgba(226,118,27,0.06), transparent 70%), radial-gradient(50% 40% at 85% 80%, rgba(120,140,110,0.06), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-16 pt-14 text-center sm:pt-20">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Vibhin Enterprises · Chikmagalur
          </p>
          <h1 className="font-display max-w-3xl text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            Kick the heat,
            <br />
            feel the freshness.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            The traditional 200 ml glass-bottle goli soda — marble stopper,
            sharp fizz, seven flavours. Bottled in Ajjampura, made to be opened
            with a crack and finished in three gulps.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button size="lg" asChild>
              <Link to="/flavors">
                Order flavours <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="tel:+919620416948">
                <Phone className="mr-1.5 size-4 text-primary" /> 9620 416 948
              </a>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/orders">Track an order</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="mt-14"
          >
            <BottleFamily />
            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Seven flavours · One marble · 200 ml
            </p>
          </motion.div>
        </div>
      </section>

      {/* ————— Brand story ————— */}
      <section className="border-b border-border/70 bg-cream/60">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              The factory
            </p>
            <h2 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">
              Vibhin Enterprises&apos; Kick Goli Soda
              <br />
              Manufacturing &amp; Head Office
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              Our plant sits on Nagarakallu Road in Ajjampura Town, Tarikere —
              ringed by the tea gardens of Chikmagalur District. The same water
              that feeds those estates goes through RO, carbonation and a
              hand-filled marble bottle before it leaves for shops across the
              district.
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Small batches. Glass, never plastic. Fizz you can hear before the
              bottle reaches the table.
            </p>
            <a
              href="tel:+919620416948"
              className="studio-frame mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40"
            >
              <Phone className="size-4 text-primary" />
              Call the factory — 9620 416 948
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="studio-frame overflow-hidden rounded-2xl"
          >
            <FactoryScene className="h-full w-full" />
            <div className="border-t border-border/70 bg-card px-5 py-4">
              <p className="text-sm font-medium">
                Manufacturing &amp; Head Office — Ajjampura
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Nagarakallu Road, Ajjampura Town, Tarikere, Chikmagalur —
                577547, Karnataka
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ————— About / product notes ————— */}
      <section className="border-b border-border/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "The marble makes it",
                body: "A glass goli traps the fizz against the stopper until the moment you pop it — a sharper, livelier carbonation than any plastic-capped bottle.",
              },
              {
                icon: Leaf,
                title: "Simple, honest ingredients",
                body: "Carbonated RO water, sugar, acidity regulator and natural flavour. Nothing you can't name, nothing you don't need.",
              },
              {
                icon: Phone,
                title: "From the estate road",
                body: "Bottled at Ajjampura in Chikmagalur District and delivered to shops and homes across Tarikere taluk the same week it's made.",
              },
            ].map((f) => (
              <div key={f.title}>
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-display mt-4 text-xl">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— CTA ————— */}
      <section className="bg-cream/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center">
          <h2 className="font-display max-w-2xl text-3xl tracking-tight sm:text-4xl">
            Seven flavours, one crack of the marble.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
            Cola, Blueberry, Green Apple, Original, Orange, Lemon and Rose —
            ₹25–30 a bottle, delivered in about 45 minutes.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link to="/flavors">
              Browse &amp; order <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
