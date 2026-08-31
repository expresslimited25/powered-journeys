import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in to Wandr" },
      {
        name: "description",
        content: "Sign in with Google to build, save and share AI-generated travel itineraries on Wandr.",
      },
      { property: "og:title", content: "Sign in to Wandr" },
      {
        property: "og:description",
        content: "One tap with Google and your next trip starts planning itself.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) navigate({ to: "/home", replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function signIn() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Could not sign in with Google. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/home", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-hero-gradient px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm"
      >
        <Card className="border-none p-8 text-center shadow-lift">
          <h1 className="font-display text-4xl">Wandr</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to start planning your next trip.
          </p>
          <Button
            onClick={signIn}
            disabled={busy}
            size="lg"
            variant="outline"
            className="mt-7 w-full gap-3 font-medium"
          >
            <GoogleMark />
            {busy ? "Opening Google…" : "Sign in with Google"}
          </Button>
        </Card>
        <p className="mx-auto mt-6 max-w-xs text-center text-sm text-navy-foreground/70">
          Wandr turns a destination and a few interests into a day-by-day itinerary — with hidden
          gems, maps links and travel tips. No bookings, no payments, just great plans.
        </p>
      </motion.div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 7 8.9 4.8 12 4.8Z"
      />
    </svg>
  );
}
