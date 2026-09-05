import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatRange, type TripRow } from "@/lib/itinerary";

export const Route = createFileRoute("/share/$token")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "A Shared Itinerary on Wandr" },
      { name: "description", content: "Someone shared their AI-built travel itinerary with you. Browse it day by day on Wandr." },
      { property: "og:title", content: "A Shared Itinerary on Wandr" },
      { property: "og:description", content: "A day-by-day travel plan, shared with you via Wandr." },
    ],
  }),
  component: SharedTrip,
});

function SharedTrip() {
  const { token } = Route.useParams();

  const { data: trip, isLoading } = useQuery({
    queryKey: ["shared", token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .eq("share_token", token)
        .eq("is_public", true)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as TripRow) ?? null;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="mx-auto w-full max-w-3xl px-4 pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ) : !trip ? (
          <Card className="p-8 text-center">
            <h1 className="font-display text-2xl">This itinerary isn't available</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The link may have expired or the trip is no longer shared.
            </p>
            <Button asChild className="mt-6">
              <Link to="/">Explore Wandr</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-5">
            <Card className="border-none bg-hero-gradient p-6 text-navy-foreground shadow-lift">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Shared via Wandr
              </p>
              <h1 className="mt-2 font-display text-3xl">{trip.title}</h1>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-navy-foreground/80">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" /> {trip.destination}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" /> {formatRange(trip.start_date, trip.end_date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" /> {trip.pax_adults + trip.pax_children} pax
                </span>
              </div>
            </Card>
            <ItineraryDisplay data={trip.itinerary_data} />
            <Card className="p-5 text-center">
              <p className="font-display text-lg">Want an itinerary like this?</p>
              <Button asChild className="mt-3 bg-amber-gradient font-semibold text-accent-foreground hover:opacity-90">
                <Link to="/">Try Wandr</Link>
              </Button>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
