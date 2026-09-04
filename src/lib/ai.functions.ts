import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ItineraryData } from "@/lib/itinerary";
import { buildItinerary, callAi, INSPIRE_SYSTEM, type TripBrief } from "@/lib/ai.server";

export const generateItinerary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: TripBrief) => input)
  .handler(async ({ data }): Promise<ItineraryData> => {
    return buildItinerary(data);
  });

export const inspireMe = createServerFn({ method: "POST" }).handler(async () => {
  return (await callAi(
    INSPIRE_SYSTEM,
    `Suggest one underrated destination for a curious traveller. Seed: ${Math.random().toString(36).slice(2)}`,
  )) as {
    destination: string;
    country: string;
    tagline: string;
    description: string;
    best_time: string;
    tags: string[];
  };
});
