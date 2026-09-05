import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { getGenerationStats } from "@/lib/generation.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Generation Status — Wandr" },
      { name: "description", content: "Live queue, cache and AI generation status for Wandr administrators." },
      { property: "og:title", content: "Generation Status — Wandr" },
      { property: "og:description", content: "Queue depth, cached plans and generation health at a glance." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const fetchStats = useServerFn(getGenerationStats);

  const { data, isLoading, error } = useQuery({
    queryKey: ["generation-stats"],
    queryFn: () => fetchStats({ data: undefined }),
    refetchInterval: 15000,
  });

  return (
    <AppShell>
      <div className="space-y-5">
        <h1 className="font-display text-3xl">Generation status</h1>

        {isLoading ? (
          <Loader2 className="size-5 animate-spin text-accent" />
        ) : error ? (
          <Card className="p-6 text-sm text-muted-foreground">
            This page is only available to administrators.
          </Card>
        ) : data ? (
          <>
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">AI planning</p>
              <p className="mt-1 font-display text-2xl">{data.paused ? "Paused" : "Running"}</p>
            </Card>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Waiting" value={data.pending} />
              <Stat label="In progress" value={data.running} />
              <Stat label="Completed" value={data.completed} />
              <Stat label="Failed" value={data.failed} />
              <Stat label="Cached plans" value={data.cache} />
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </Card>
  );
}
