import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wandr — Your AI Travel Companion" },
      {
        name: "description",
        content:
          "Wandr plans smarter trips with AI: day-by-day itineraries, hidden gems and travel inspiration in seconds.",
      },
      { property: "og:title", content: "Wandr — Your AI Travel Companion" },
      {
        property: "og:description",
        content: "Plan smarter, explore further. AI-built itineraries for wherever you're headed.",
      },
    ],
  }),
  component: Welcome,
});

const WELCOME_KEY = "wandr.welcome.seen";

function Welcome() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const seen = window.localStorage.getItem(WELCOME_KEY);
      if (!seen) {
        if (!cancelled) setReady(true);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      navigate({ to: data.session ? "/home" : "/login", replace: true });
    }
    void check();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function start() {
    window.localStorage.setItem(WELCOME_KEY, "1");
    navigate({ to: "/login" });
  }

  if (!ready) {
    return <div className="min-h-screen bg-hero-gradient" />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-drift absolute -left-24 top-10 size-[26rem] rounded-full bg-accent/25 blur-3xl" />
        <div className="animate-drift-slow absolute -right-20 bottom-0 size-[30rem] rounded-full bg-navy-soft/60 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.45em] text-accent">Welcome to</p>
        <h1 className="mt-4 font-display text-7xl font-semibold text-navy-foreground sm:text-8xl">
          Wandr
        </h1>
        <p className="mx-auto mt-5 max-w-md text-balance-pretty text-lg text-navy-foreground/80">
          Your AI travel companion. Plan smarter, explore further.
        </p>
        <Button
          size="lg"
          onClick={start}
          className="mt-10 bg-amber-gradient px-8 text-base font-semibold text-accent-foreground shadow-lift hover:opacity-90"
        >
          Start Exploring
        </Button>
      </motion.div>
    </main>
  );
}
