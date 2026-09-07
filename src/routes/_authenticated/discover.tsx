import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Loader2, Share2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { inspireMe } from "@/lib/ai.functions";
import { DISCOVER_CATEGORIES } from "@/lib/itinerary";

export const Route = createFileRoute("/_authenticated/discover")({
  head: () => ({
    meta: [
      { title: "Discover Trips — Wandr" },
      { name: "description", content: "Browse community itineraries, local picks and hidden gems, or let AI suggest an underrated destination." },
      { property: "og:title", content: "Discover Trips — Wandr" },
      { property: "og:description", content: "Community itineraries, hidden gems and AI-picked destinations." },
    ],
  }),
  component: DiscoverPage,
});

type Post = {
  id: string;
  itinerary_id: string | null;
  title: string;
  description: string | null;
  tags: string[];
  destination: string | null;
  country: string | null;
  cover_image_url: string | null;
  days_count: number | null;
  user_id: string;
  itineraries?: { share_token: string; is_public: boolean } | null;
  profiles?: { name: string | null; avatar_url: string | null } | null;
};

type Inspiration = {
  destination: string;
  country: string;
  tagline: string;
  description: string;
  best_time: string;
  tags: string[];
};

function DiscoverPage() {
  const navigate = useNavigate();
  const inspire = useServerFn(inspireMe);
  const [country, setCountry] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [idea, setIdea] = useState<Inspiration | null>(null);
  const [thinking, setThinking] = useState(false);

  const { data: posts, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["discover"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discover_posts")
        .select("*, itineraries(share_token, is_public)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as unknown as Post[];
      const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
      if (userIds.length === 0) return rows;
      const { data: profiles } = await supabase
        .from("public_profiles")
        .select("id, name, avatar_url")
        .in("id", userIds);
      const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
      return rows.map((r) => ({ ...r, profiles: byId.get(r.user_id) ?? null }));
    },
  });

  const countries = Array.from(
    new Set((posts ?? []).map((p) => p.country).filter(Boolean) as string[]),
  );

  const filtered = (posts ?? []).filter(
    (p) => (!country || p.country === country) && (!category || p.tags?.includes(category)),
  );

  async function getIdea() {
    setThinking(true);
    try {
      setIdea(await inspire({}));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not find inspiration right now.");
    } finally {
      setThinking(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="font-display text-3xl">Discover</h1>
          <p className="text-sm text-muted-foreground">
            Itineraries and local tips shared by the Wandr community.
          </p>
        </header>

        <Card className="border-accent/30 bg-accent/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl">Inspire Me</h2>
              <p className="text-sm text-muted-foreground">
                One underrated destination, picked by AI.
              </p>
            </div>
            <Button onClick={getIdea} disabled={thinking}>
              {thinking ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Surprise me
            </Button>
          </div>
          {idea ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl bg-card p-4"
            >
              <p className="font-display text-lg">
                {idea.destination}, {idea.country}
              </p>
              <p className="text-sm font-medium text-accent-foreground/80">{idea.tagline}</p>
              <p className="mt-2 text-sm text-muted-foreground">{idea.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">Best time: {idea.best_time}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(idea.tags ?? []).map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <Button
                className="mt-4"
                size="sm"
                onClick={() => navigate({ to: "/plan" })}
              >
                Plan This Trip
              </Button>
            </motion.div>
          ) : null}
        </Card>

        <div className="space-y-3">
          {countries.length ? (
            <div className="flex flex-wrap gap-2">
              <FilterChip active={!country} onClick={() => setCountry(null)} label="All countries" />
              {countries.map((c) => (
                <FilterChip
                  key={c}
                  active={country === c}
                  onClick={() => setCountry(c)}
                  label={c}
                />
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <FilterChip active={!category} onClick={() => setCategory(null)} label="All categories" />
            {DISCOVER_CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
                label={c}
              />
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-56 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <p className="font-display text-lg">We couldn't load the feed</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check your connection and try again.
            </p>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
                {isFetching ? <Loader2 className="size-4 animate-spin" /> : null} Try again
              </Button>
            </div>
          </Card>
        ) : filtered.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="font-display text-lg">Nothing shared here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Share one of your own itineraries from the trip page and it can live here.
            </p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

function PostCard({ post }: { post: Post }) {
  const token = post.itineraries?.share_token;
  const body = (
    <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-lift">
      <div className="h-36 w-full bg-hero-gradient">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={`${post.destination ?? post.title} cover`}
            loading="lazy"
            className="h-36 w-full object-cover"
          />
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <p className="font-display text-lg leading-tight">{post.title}</p>
        <p className="text-sm text-muted-foreground">
          {post.destination}
          {post.days_count ? ` · ${post.days_count} days` : ""}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(post.tags ?? []).slice(0, 3).map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={post.profiles?.avatar_url ?? undefined} alt="" />
              <AvatarFallback>{(post.profiles?.name ?? "W").slice(0, 1)}</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs text-muted-foreground">
              {post.profiles?.name ?? "Traveller"}
            </span>
          </div>
          {token ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy link to this trip"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = `${window.location.origin}/share/${token}`;
                navigator.clipboard
                  .writeText(url)
                  .then(() => toast.success("Link copied"))
                  .catch(() => toast.success(`Link: ${url}`));
              }}
            >
              <Share2 className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );

  if (!token) return body;
  return (
    <Link to="/share/$token" params={{ token }}>
      {body}
    </Link>
  );
}
