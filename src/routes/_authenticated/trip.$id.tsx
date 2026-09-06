import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  Globe2,
  Loader2,
  MapPin,
  RefreshCw,
  Save,
  Share2,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/BottomNav";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { processMyGenerationJob, submitGenerationJob } from "@/lib/generation.functions";
import { formatRange, type ItineraryData, type TripRow } from "@/lib/itinerary";

export const Route = createFileRoute("/_authenticated/trip/$id")({
  head: () => ({
    meta: [
      { title: "Itinerary — Wandr" },
      { name: "description", content: "Your day-by-day Wandr itinerary with places, tips and map links." },
      { property: "og:title", content: "Itinerary — Wandr" },
      { property: "og:description", content: "A day-by-day plan built by Wandr's AI travel companion." },
    ],
  }),
  component: TripPage,
});

function TripPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const submitJob = useServerFn(submitGenerationJob);
  const processJob = useServerFn(processMyGenerationJob);

  const [draft, setDraft] = useState<ItineraryData | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<"save" | "regen" | null>(null);

  const { data: trip, isLoading } = useQuery({
    queryKey: ["trip", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("itineraries").select("*").eq("id", id).single();
      if (error) throw error;
      return data as unknown as TripRow;
    },
  });

  useEffect(() => {
    if (trip) setDraft(trip.itinerary_data);
  }, [trip]);

  async function save() {
    if (!draft) return;
    setBusy("save");
    const { error } = await supabase
      .from("itineraries")
      .update({ itinerary_data: draft as never })
      .eq("id", id);
    setBusy(null);
    if (error) {
      toast.error("Could not save your itinerary.");
      return;
    }
    setDirty(false);
    void queryClient.invalidateQueries({ queryKey: ["trip", id] });
    toast.success("Itinerary saved");
  }

  async function share() {
    if (!trip) return;
    const { error } = await supabase
      .from("itineraries")
      .update({ is_public: true })
      .eq("id", trip.id);
    if (error) {
      toast.error("Could not create a share link.");
      return;
    }
    const url = `${window.location.origin}/share/${trip.share_token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard");
    } catch {
      toast.success(`Share link: ${url}`);
    }
    void queryClient.invalidateQueries({ queryKey: ["trip", id] });
  }

  async function regen() {
    if (!trip) return;
    setBusy("regen");
    try {
      const brief = {
        destination: trip.destination,
        startDate: trip.start_date ?? new Date().toISOString().slice(0, 10),
        endDate: trip.end_date ?? new Date().toISOString().slice(0, 10),
        adults: trip.pax_adults,
        children: trip.pax_children,
        interests: trip.interests ?? [],
        budget: trip.budget_range,
      };

      const job = await submitJob({ data: { brief, itineraryId: trip.id } });

      if (job.status !== "completed") {
        let attempts = 0;
        let current = await processJob({ data: undefined });
        while (current && current.status !== "completed" && current.status !== "failed" && attempts < 4) {
          attempts += 1;
          await new Promise((r) => setTimeout(r, 3000));
          current = await processJob({ data: undefined });
        }
        if (current?.status !== "completed") {
          throw new Error(current?.error_message ?? "The planner is busy right now. Please try again shortly.");
        }
      }

      const { data: fresh, error } = await supabase.from("itineraries").select("*").eq("id", trip.id).single();
      if (error) throw error;
      setDraft((fresh as unknown as TripRow).itinerary_data);
      setDirty(false);
      void queryClient.invalidateQueries({ queryKey: ["trip", id] });
      toast.success("Fresh itinerary generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not regenerate.");
    } finally {
      setBusy(null);
    }
  }

  if (isLoading || !trip || !draft) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
      >
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/home" })} className="-ml-2">
          <ArrowLeft className="size-4" /> Back
        </Button>

        <Card className="overflow-hidden border-none bg-hero-gradient p-0 text-navy-foreground shadow-lift">
          {trip.cover_image_url ? (
            <img
              src={trip.cover_image_url}
              alt={`${trip.destination} cover`}
              className="h-44 w-full object-cover"
            />
          ) : null}
          <div className="p-6">
            <h1 className="font-display text-3xl">{trip.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-navy-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {trip.destination}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" /> {formatRange(trip.start_date, trip.end_date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" /> {trip.pax_adults} adults · {trip.pax_children} children
            </span>
            {trip.is_public ? (
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="size-4" /> Shared publicly
              </span>
            ) : null}
          </div>
          </div>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button onClick={save} disabled={busy !== null || !dirty}>
            {busy === "save" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Itinerary
          </Button>
          <Button variant="outline" onClick={share} disabled={busy !== null}>
            <Share2 className="size-4" /> Share Itinerary
          </Button>
          <Button variant="outline" onClick={regen} disabled={busy !== null}>
            {busy === "regen" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            Regenerate
          </Button>
        </div>

        {trip.is_public ? (
          <p className="text-xs text-muted-foreground">
            Public link:{" "}
            <Link to="/share/$token" params={{ token: trip.share_token }} className="underline">
              /share/{trip.share_token}
            </Link>
          </p>
        ) : null}

        <ItineraryDisplay
          data={draft}
          editable
          onChange={(next) => {
            setDraft(next);
            setDirty(true);
          }}
        />
      </motion.div>
    </AppShell>
  );
}
