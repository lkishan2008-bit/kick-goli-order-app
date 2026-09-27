import { BottleFamily, FactoryBanner } from "@/components/ProductPhoto";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const FEATURES = [
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
] as const;

export default function Landing() {
  return (
    <div>
      {/* ————— Hero ————— */}
      <section className="relative overflow-hidden border-b border-border/60">
        {/* faint radial washes keep it airy, never colorful */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 8%, rgba(226,118,27,0.055), transparent 70%), radial-gradient(50% 40% at 85% 85%, rgba(120,140,110,0.05), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-20 pt-20 text-center sm:pt-28 md:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground"
          >
            Vibhin Enterprises · Chikmagalur
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 0.61, 0.36, 1], delay: 0.05 }}
            className="font-display text-display-1 max-w-4xl"
          >
            Kick the heat,
            <br />
            feel the freshness.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 0.61, 0.36, 1], delay: 0.12 }}
            className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground"
          >
            The traditional 200 ml glass-bottle goli soda — marble stopper,
            sharp fizz, seven flavours. Bottled in Ajjampura, made to be opened
            with a crack and finished in three gulps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 0.61, 0.36, 1], delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Button size="lg" className="studio-btn" asChild>
              <Link to="/flavors">
                Order flavours <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="studio-btn" asChild>
              <a href="tel:+919620416948">
                <Phone className="mr-1.5 size-4 text-primary" /> 9620 416 948
              </a>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/orders">Track an order</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 0.61, 0.36, 1], delay: 0.3 }}
            className="mt-20 md:mt-28"
          >
            <BottleFamily />
            <p className="mt-8 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Seven flavours · One marble · 200 ml
            </p>
          </motion.div>
        </div>
      </section>

      {/* ————— Brand story ————— */}
      <section className="border-b border-border/60 bg-cream/50">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 section-pad md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              The factory
            </p>
            <h2 className="font-display text-display-2 mt-4">
              Vibhin Enterprises&apos; Kick Goli Soda Manufacturing &amp; Head
              Office
            </h2>
            <p className="mt-7 text-lg leading-8 text-muted-foreground">
              Our plant sits on Nagarakallu Road in Ajjampura Town, Tarikere —
              ringed by the tea gardens of Chikmagalur District. The same water
              that feeds those estates goes through RO, carbonation and a
              hand-filled marble bottle before it leaves for shops across the
              district.
            </p>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Small batches. Glass, never plastic. Fizz you can hear before the
              bottle reaches the table.
            </p>
            <a
              href="tel:+919620416948"
              className="studio-frame mt-9 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40"
            >
              <Phone className="size-4 text-primary" />
              Call the factory — 9620 416 948
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="studio-frame overflow-hidden rounded-3xl">
              <FactoryBanner className="h-72 w-full object-cover md:h-[26rem]" />
              <div className="border-t border-border/60 bg-card px-6 py-5">
                <p className="text-sm font-medium">
                  Manufacturing &amp; Head Office — Ajjampura
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Nagarakallu Road, Ajjampura Town, Tarikere, Chikmagalur —
                  577547, Karnataka
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ————— About / product notes ————— */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-4 section-pad">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Why goli soda
            </p>
            <h2 className="font-display text-display-2 mt-4">
              Made the old way, on purpose.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-10">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
                  <f.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-display text-display-3 mt-5">{f.title}</h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {f.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ————— CTA ————— */}
      <section className="bg-cream/50">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 section-pad text-center">
          <Reveal>
            <h2 className="font-display text-display-2 max-w-2xl">
              Seven flavours, one crack of the marble.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              Cola, Blueberry, Green Apple, Original, Orange, Lemon and Rose —
              ₹25–30 a bottle, delivered in about 45 minutes.
            </p>
            <Button size="lg" className="studio-btn mt-10" asChild>
              <Link to="/flavors">
                Browse &amp; order <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
