import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Minus, Plus, Sparkles } from "lucide-react";
import { AppShell } from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { processMyGenerationJob, submitGenerationJob } from "@/lib/generation.functions";
import { BUDGETS, INTERESTS, TRAVEL_TIPS, daysBetween } from "@/lib/itinerary";

export const Route = createFileRoute("/_authenticated/plan")({
  head: () => ({
    meta: [
      { title: "Plan a Trip — Wandr" },
      { name: "description", content: "Answer five quick questions and Wandr's AI builds your day-by-day itinerary." },
      { property: "og:title", content: "Plan a Trip — Wandr" },
      { property: "og:description", content: "Destination, dates, travellers, interests — then let the AI plan it." },
    ],
  }),
  component: PlanPage,
});

const POPULAR = [
  "Kyoto, Japan",
  "Lisbon, Portugal",
  "Georgetown, Malaysia",
  "Tbilisi, Georgia",
  "Oaxaca, Mexico",
  "Ljubljana, Slovenia",
  "Hoi An, Vietnam",
  "Seville, Spain",
];

const STEPS = ["Destination", "Dates", "Travellers", "Interests", "Budget", "Review"];

function PlanPage() {
  const navigate = useNavigate();
  const submitJob = useServerFn(submitGenerationJob);
  const processJob = useServerFn(processMyGenerationJob);

  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = destination.trim()
    ? POPULAR.filter((p) => p.toLowerCase().includes(destination.trim().toLowerCase())).slice(0, 4)
    : [];

  const canContinue = [
    destination.trim().length > 1,
    Boolean(startDate && endDate && endDate >= startDate),
    adults > 0,
    true,
    true,
    true,
  ][step];

  async function submit() {
    setLoading(true);
    try {
      const job = await submitJob({
        data: { brief: { destination, startDate, endDate, adults, children, interests, budget } },
      });

      if (job.status === "completed" && job.itineraryId) {
        toast.success("Your itinerary is ready");
        navigate({ to: "/trip/$id", params: { id: job.itineraryId } });
        return;
      }

      let attempts = 0;
      let current = await processJob({ data: undefined });
      while (current && current.status !== "completed" && current.status !== "failed" && attempts < 4) {
        attempts += 1;
        await new Promise((r) => setTimeout(r, 3000));
        current = await processJob({ data: undefined });
      }

      if (current?.status === "completed" && (current.itinerary_id ?? job.itineraryId)) {
        toast.success("Your itinerary is ready");
        navigate({ to: "/trip/$id", params: { id: (current.itinerary_id ?? job.itineraryId) as string } });
        return;
      }

      throw new Error(current?.error_message ?? "The planner is busy right now. Please try again in a moment.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (loading) return <GeneratingScreen destination={destination} />;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </p>
          <Progress value={((step + 1) / STEPS.length) * 100} className="h-1.5" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-6">
              {step === 0 && (
                <div className="space-y-4">
                  <h1 className="font-display text-2xl">Where are you going?</h1>
                  <Input
                    autoFocus
                    placeholder="e.g. Kyoto, Japan"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    {(suggestions.length ? suggestions : POPULAR.slice(0, 4)).map((p) => (
                      <Badge
                        key={p}
                        variant="secondary"
                        className="cursor-pointer px-3 py-1.5 hover:bg-accent/25"
                        onClick={() => setDestination(p)}
                      >
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h1 className="font-display text-2xl">When are you travelling?</h1>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="start">Arrival</Label>
                      <Input
                        id="start"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="end">Departure</Label>
                      <Input
                        id="end"
                        type="date"
                        min={startDate || undefined}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  {startDate && endDate && endDate >= startDate ? (
                    <p className="text-sm text-muted-foreground">
                      {daysBetween(startDate, endDate)} days on the ground.
                    </p>
                  ) : null}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h1 className="font-display text-2xl">Who's coming along?</h1>
                  <Stepper label="Adults" value={adults} min={1} onChange={setAdults} />
                  <Stepper label="Children" value={children} min={0} onChange={setChildren} />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h1 className="font-display text-2xl">What are you into?</h1>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((i) => {
                      const active = interests.includes(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setInterests((prev) =>
                              active ? prev.filter((x) => x !== i) : [...prev, i],
                            )
                          }
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            active
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border bg-card text-foreground hover:bg-muted"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h1 className="font-display text-2xl">Budget range</h1>
                  <p className="text-sm text-muted-foreground">Optional — skip if you're flexible.</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(budget === b ? null : b)}
                        className={`rounded-xl border px-4 py-4 text-sm font-medium transition-colors ${
                          budget === b
                            ? "border-accent bg-accent/15"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h1 className="font-display text-2xl">Ready to go?</h1>
                  <dl className="divide-y divide-border rounded-xl border border-border">
                    <Row label="Destination" value={destination} />
                    <Row
                      label="Dates"
                      value={`${startDate} → ${endDate} (${daysBetween(startDate, endDate)} days)`}
                    />
                    <Row label="Travellers" value={`${adults} adults, ${children} children`} />
                    <Row label="Interests" value={interests.join(", ") || "Anything goes"} />
                    <Row label="Budget" value={budget ?? "Flexible"} />
                  </dl>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              className="bg-amber-gradient font-semibold text-accent-foreground hover:opacity-90"
            >
              <Sparkles className="size-4" /> Generate itinerary
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          aria-label={`Fewer ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-6 text-center text-lg font-semibold">{value}</span>
        <Button
          variant="outline"
          size="icon"
          aria-label={`More ${label}`}
          onClick={() => onChange(Math.min(12, value + 1))}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function GeneratingScreen({ destination }: { destination: string }) {
  const [tip, setTip] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTip((t) => (t + 1) % TRAVEL_TIPS.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-hero-gradient px-6 text-center">
      <Loader2 className="size-8 animate-spin text-accent" />
      <h1 className="mt-6 font-display text-3xl text-navy-foreground">
        Mapping out {destination}…
      </h1>
      <AnimatePresence mode="wait">
        <motion.p
          key={tip}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-4 max-w-sm text-balance-pretty text-sm text-navy-foreground/75"
        >
          {TRAVEL_TIPS[tip]}
        </motion.p>
      </AnimatePresence>
    </main>
  );
}
