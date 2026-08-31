import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ItineraryData } from "@/lib/itinerary";
import {
  callAi,
  INSPIRE_SYSTEM,
  ITINERARY_SYSTEM,
  itineraryPrompt,
  type TripBrief,
} from "@/lib/ai.server";

export const generateItinerary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: TripBrief) => input)
  .handler(async ({ data }): Promise<ItineraryData> => {
    const result = (await callAi(ITINERARY_SYSTEM, itineraryPrompt(data))) as ItineraryData;
    if (!result || !Array.isArray(result.days)) {
      throw new Error("The AI could not build an itinerary. Please try again.");
    }
    return result;
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
