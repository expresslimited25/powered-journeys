import { useState } from "react";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, MapPin, Pencil, Search, Trash2 } from "lucide-react";
import {
  googleMapsUrl,
  googleSearchUrl,
  type ItineraryData,
  type Poi,
} from "@/lib/itinerary";

type Block = "morning" | "afternoon" | "evening";
const BLOCKS: Block[] = ["morning", "afternoon", "evening"];
const BLOCK_LABEL: Record<Block, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

type EditTarget = { dayIndex: number; block: Block; poiIndex: number; poi: Poi };

export function ItineraryDisplay({
  data,
  editable = false,
  onChange,
}: {
  data: ItineraryData;
  editable?: boolean;
  onChange?: (next: ItineraryData) => void;
}) {
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [draft, setDraft] = useState<Poi | null>(null);

  const days = data.days ?? [];

  function mutate(fn: (next: ItineraryData) => void) {
    const next = JSON.parse(JSON.stringify(data)) as ItineraryData;
    fn(next);
    onChange?.(next);
  }

  function removePoi(t: EditTarget) {
    mutate((next) => {
      next.days[t.dayIndex]![t.block].splice(t.poiIndex, 1);
    });
    setTarget(null);
  }

  function savePoi() {
    if (!target || !draft) return;
    mutate((next) => {
      next.days[target.dayIndex]![target.block][target.poiIndex] = draft;
    });
    setTarget(null);
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={["day-0"]} className="space-y-3">
        {days.map((day, dayIndex) => (
          <AccordionItem
            key={day.day ?? dayIndex}
            value={`day-${dayIndex}`}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-soft"
          >
            <AccordionTrigger className="px-4 py-4 hover:no-underline">
              <div className="flex flex-col items-start text-left">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Day {day.day ?? dayIndex + 1} · {day.date}
                </span>
                <span className="font-display text-lg text-foreground">{day.theme}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 px-4 pb-5">
              {BLOCKS.map((block) => {
                const pois = day[block] ?? [];
                if (!pois.length) return null;
                return (
                  <div key={block} className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {BLOCK_LABEL[block]}
                    </h4>
                    {pois.map((poi, poiIndex) => (
                      <motion.div
                        key={`${poi.name}-${poiIndex}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: poiIndex * 0.04 }}
                      >
                        <Card className="gap-3 border-border/70 p-4 shadow-none">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-foreground">{poi.name}</p>
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                {poi.category ? (
                                  <Badge variant="secondary" className="bg-accent/15 text-foreground">
                                    {poi.category}
                                  </Badge>
                                ) : null}
                                {poi.duration ? (
                                  <span className="text-xs text-muted-foreground">{poi.duration}</span>
                                ) : null}
                              </div>
                            </div>
                            {editable ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Edit ${poi.name}`}
                                onClick={() => {
                                  setTarget({ dayIndex, block, poiIndex, poi });
                                  setDraft({ ...poi });
                                }}
                              >
                                <Pencil className="size-4" />
                              </Button>
                            ) : null}
                          </div>

                          <p className="text-sm text-muted-foreground text-balance-pretty">
                            {poi.description}
                          </p>
                          {poi.tips ? (
                            <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                              Tip · {poi.tips}
                            </p>
                          ) : null}

                          <div className="flex flex-wrap gap-2">
                            <Button asChild variant="outline" size="sm">
                              <a
                                href={googleSearchUrl(`${poi.name} ${data.destination}`)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Search className="size-3.5" /> Search Online
                              </a>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <a
                                href={googleMapsUrl(`${poi.name} ${data.destination}`)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <MapPin className="size-3.5" /> Find on Maps
                              </a>
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs">
                            <span className="text-muted-foreground">Suggested links:</span>
                            <a
                              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
                              href={`https://www.klook.com/search/?query=${encodeURIComponent(poi.name)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Book via Klook <ExternalLink className="size-3" />
                            </a>
                            <a
                              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
                              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(data.destination)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Hotels on Booking.com <ExternalLink className="size-3" />
                            </a>
                            <a
                              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
                              href="https://www.google.com/travel/flights"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Flights <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {data.general_tips?.length ? (
        <Card className="border-accent/30 bg-accent/10 p-5">
          <h3 className="font-display text-lg">Good to know</h3>
          <ul className="mt-2 space-y-2">
            {data.general_tips.map((tip) => (
              <li key={tip} className="text-sm text-muted-foreground">
                · {tip}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <p className="px-1 text-xs text-muted-foreground">
        Wandr never handles bookings or payments — every link opens an external site.
      </p>

      <Dialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit stop</DialogTitle>
          </DialogHeader>
          {draft ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="poi-name">Name</Label>
                <Input
                  id="poi-name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="poi-category">Category</Label>
                <Input
                  id="poi-category"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="poi-desc">Description</Label>
                <Textarea
                  id="poi-desc"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
            </div>
          ) : null}
          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              variant="destructive"
              onClick={() => target && removePoi(target)}
              className="sm:mr-auto"
            >
              <Trash2 className="size-4" /> Remove
            </Button>
            <Button onClick={savePoi}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
