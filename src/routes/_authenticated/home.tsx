import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CalendarDays, MapPin, Plus, Users } from "lucide-react";
import { AppShell } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { formatRange, type TripRow } from "@/lib/itinerary";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Your Wandr Dashboard" },
      { name: "description", content: "Your upcoming trips, recent itineraries and a shortcut to plan something new." },
      { property: "og:title", content: "Your Wandr Dashboard" },
      { property: "og:description", content: "Upcoming trips and AI itineraries, all in one place." },
    ],
  }),
  component: HomePage,
});

function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as TripRow[];
    },
  });
}

export function TripCard({ trip }: { trip: TripRow }) {
  return (
    <Link to="/trip/$id" params={{ id: trip.id }}>
      <Card className="gap-2 overflow-hidden p-0 transition-shadow hover:shadow-lift">
        {trip.cover_image_url ? (
          <img
            src={trip.cover_image_url}
            alt={`${trip.destination} cover`}
            loading="lazy"
            className="h-32 w-full object-cover"
          />
        ) : null}
        <div className="space-y-2 p-4">
          <p className="font-display text-lg leading-tight">{trip.title}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {trip.destination}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" /> {formatRange(trip.start_date, trip.end_date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" /> {trip.pax_adults + trip.pax_children} pax
          </span>
        </div>
      </Card>
    </Link>
  );
}

function HomePage() {
  const { profile } = useAuthUser();
  const { data: trips, isLoading } = useTrips();

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (trips ?? []).filter((t) => !t.end_date || t.end_date >= today);
  const recent = (trips ?? []).slice(0, 4);

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <header>
          <h1 className="font-display text-3xl">
            Hey {profile?.name?.split(" ")[0] ?? "there"}, where to next?
          </h1>
        </header>

        <Card className="overflow-hidden border-none bg-hero-gradient p-6 text-navy-foreground shadow-lift">
          <h2 className="font-display text-2xl">Plan a New Trip</h2>
          <p className="mt-1 max-w-sm text-sm text-navy-foreground/75">
            Tell Wandr where and when — get a day-by-day itinerary in under a minute.
          </p>
          <Button
            asChild
            className="mt-5 bg-amber-gradient font-semibold text-accent-foreground hover:opacity-90"
          >
            <Link to="/plan">
              <Plus className="size-4" /> Start planning
            </Link>
          </Button>
        </Card>

        <section className="space-y-3">
          <h2 className="font-display text-xl">Your Upcoming Trips</h2>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : upcoming.length ? (
            <div className="space-y-3">
              {upcoming.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nothing on the horizon yet. Your next adventure is one tap away.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl">Recently Viewed</h2>
          {isLoading ? (
            <Skeleton className="h-20 w-full rounded-xl" />
          ) : recent.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {recent.map((trip) => (
                <Link key={trip.id} to="/trip/$id" params={{ id: trip.id }}>
                  <Card className="h-full gap-1 p-4 transition-shadow hover:shadow-soft">
                    <p className="font-medium">{trip.title}</p>
                    <p className="text-sm text-muted-foreground">{trip.destination}</p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Itineraries you open will appear here.</p>
          )}
        </section>
      </motion.div>
    </AppShell>
  );
}
