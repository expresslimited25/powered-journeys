import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Globe2, LogOut, Share2, Trash2 } from "lucide-react";
import { AppShell } from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { formatRange, type TripRow } from "@/lib/itinerary";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Wandr" },
      { name: "description", content: "Manage your saved Wandr itineraries, shared trips and account." },
      { property: "og:title", content: "Your Profile — Wandr" },
      { property: "og:description", content: "Saved itineraries, shared trips and account settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: trips, isLoading } = useQuery({
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

  const shared = (trips ?? []).filter((t) => t.is_public);

  async function remove(id: string) {
    const { error } = await supabase.from("itineraries").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete that trip.");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["trips"] });
    toast.success("Trip deleted");
  }

  async function copyShare(trip: TripRow) {
    if (!trip.is_public) {
      const { error } = await supabase
        .from("itineraries")
        .update({ is_public: true })
        .eq("id", trip.id);
      if (error) {
        toast.error("Could not create a share link.");
        return;
      }
      void queryClient.invalidateQueries({ queryKey: ["trips"] });
    }
    const url = `${window.location.origin}/share/${trip.share_token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied");
    } catch {
      toast.success(`Share link: ${url}`);
    }
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <Card className="flex flex-row items-center gap-4 p-5">
          <Avatar className="size-14">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt="" />
            <AvatarFallback>{(profile?.name ?? "W").slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-display text-xl">{profile?.name}</p>
            <p className="truncate text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </Card>

        <section className="space-y-3">
          <h2 className="font-display text-xl">My Itineraries</h2>
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-xl" />
          ) : trips?.length ? (
            trips.map((trip) => (
              <Card key={trip.id} className="gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link to="/trip/$id" params={{ id: trip.id }} className="min-w-0">
                    <p className="truncate font-medium">{trip.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.destination} · {formatRange(trip.start_date, trip.end_date)}
                    </p>
                  </Link>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Share trip"
                      onClick={() => copyShare(trip)}
                    >
                      <Share2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete trip"
                      onClick={() => remove(trip.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No saved itineraries yet.</p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl">Shared by Me</h2>
          {shared.length ? (
            shared.map((trip) => (
              <Card key={trip.id} className="flex flex-row items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{trip.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    /share/{trip.share_token}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/share/$token" params={{ token: trip.share_token }}>
                    <Globe2 className="size-4" /> View
                  </Link>
                </Button>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">You haven't made any trips public yet.</p>
          )}
        </section>

        <Button variant="outline" className="w-full" onClick={signOut}>
          <LogOut className="size-4" /> Log out
        </Button>
      </div>
    </AppShell>
  );
}
