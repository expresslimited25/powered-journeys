import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { buildItinerary, type TripBrief } from "@/lib/ai.server";
import type { ItineraryData } from "@/lib/itinerary";
import type { Json } from "@/integrations/supabase/types";

const MAX_DAILY = 5;
const MAX_MONTHLY = 50;

function stableBriefJson(brief: TripBrief): string {
  const ordered = {
    destination: brief.destination,
    startDate: brief.startDate,
    endDate: brief.endDate,
    adults: brief.adults,
    children: brief.children,
    interests: [...brief.interests].sort(),
    budget: brief.budget,
  };
  return JSON.stringify(ordered);
}

async function hashBrief(brief: TripBrief): Promise<string> {
  const encoder = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode(stableBriefJson(brief)));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isPaused(supabase: {
  from: (table: "app_config") => {
    select: (...args: unknown[]) => Promise<{ data: { value: string } | null; error: Error | null }>;
  };
}) {
  const { data, error } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", "generation_paused")
    .single();
  if (error) {
    console.error("Failed to read generation_paused config:", error.message);
    return false;
  }
  return data?.value === "true";
}

async function setPaused(supabaseAdmin: { from: (table: "app_config") => { upsert: (values: unknown) => Promise<{ error: Error | null }> } }) {
  const { error } = await supabaseAdmin.from("app_config").upsert({
    key: "generation_paused",
    value: "true",
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Failed to pause generation:", error.message);
}

async function createItineraryShell(
  supabase: {
    from: (table: "itineraries") => {
      insert: (values: unknown) => { select: (cols: string) => Promise<{ data: { id: string }[] | null; error: Error | null }> };
    };
  },
  userId: string,
  brief: TripBrief,
) {
  const { data, error } = await supabase
    .from("itineraries")
    .insert({
      user_id: userId,
      title: `Planning ${brief.destination}…`,
      destination: brief.destination,
      start_date: brief.startDate,
      end_date: brief.endDate,
      pax_adults: brief.adults,
      pax_children: brief.children,
      interests: brief.interests,
      budget_range: brief.budget,
      itinerary_data: { days: [], trip_title: brief.destination, destination: brief.destination } as unknown as Json,
      is_public: false,
    })
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Could not create itinerary shell.");
  return data[0].id;
}

async function updateItineraryFromResult(
  supabase: {
    from: (table: "itineraries") => {
      update: (values: unknown) => { eq: (col: string, val: string) => Promise<{ error: Error | null }> };
    };
  },
  itineraryId: string,
  result: ItineraryData,
  brief: TripBrief,
) {
  const { error } = await supabase
    .from("itineraries")
    .update({
      title: result.trip_title ?? brief.destination,
      destination: result.destination ?? brief.destination,
      itinerary_data: result as unknown as Json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itineraryId);
  if (error) throw error;
}

async function writeCache(
  supabase: {
    from: (table: "itinerary_cache") => {
      upsert: (values: unknown) => Promise<{ error: Error | null }>;
    };
  },
  briefHash: string,
  brief: TripBrief,
  result: ItineraryData,
) {
  const { error } = await supabase.from("itinerary_cache").upsert({
    brief_hash: briefHash,
    destination: brief.destination,
    start_date: brief.startDate,
    end_date: brief.endDate,
    pax_adults: brief.adults,
    pax_children: brief.children,
    interests: brief.interests,
    budget_range: brief.budget,
    itinerary_data: result as unknown as Json,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
  if (error) console.error("Failed to write cache:", error.message);
}

export const submitGenerationJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { brief: TripBrief; itineraryId?: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    if (await isPaused(supabase)) {
      throw new Error("AI generation is temporarily paused. Please try again later.");
    }

    const briefHash = await hashBrief(data.brief);

    const { data: cached } = await supabase
      .from("itinerary_cache")
      .select("itinerary_data")
      .eq("brief_hash", briefHash)
      .single();

    if (cached) {
      const itineraryId = data.itineraryId ?? (await createItineraryShell(supabase, userId, data.brief));
      const { data: job, error } = await supabase
        .from("generation_jobs")
        .insert({
          user_id: userId,
          brief_hash: briefHash,
          brief: data.brief as unknown as Json,
          status: "completed",
          result: cached.itinerary_data,
          completed_at: new Date().toISOString(),
          itinerary_id: itineraryId,
        })
        .select("id, status, itinerary_id, error_message")
        .single();
      if (error) throw error;

      await updateItineraryFromResult(supabase, itineraryId, cached.itinerary_data as unknown as ItineraryData, data.brief);

      return { jobId: job.id, status: job.status, itineraryId: job.itinerary_id, errorMessage: job.error_message };
    }

    const { data: usageResult, error: usageError } = await supabase.rpc("record_generation_attempt", {
      _user_id: userId,
    });
    if (usageError) throw usageError;
    if (!usageResult?.allowed) {
      throw new Error(
        `Generation limit reached: ${usageResult.daily}/${MAX_DAILY} today, ${usageResult.monthly}/${MAX_MONTHLY} this month.`,
      );
    }

    const itineraryId = data.itineraryId ?? (await createItineraryShell(supabase, userId, data.brief));

    const { data: job, error } = await supabase
      .from("generation_jobs")
      .insert({
        user_id: userId,
        brief_hash: briefHash,
        brief: data.brief as unknown as Json,
        status: "pending",
        itinerary_id: itineraryId,
      })
      .select("id, status, itinerary_id, error_message")
      .single();
    if (error) throw error;

    return { jobId: job.id, status: job.status, itineraryId: job.itinerary_id, errorMessage: job.error_message };
  });

export const pollGenerationJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { jobId: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: job, error } = await supabase
      .from("generation_jobs")
      .select("*")
      .eq("id", data.jobId)
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return job;
  });

export const processMyGenerationJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: pending } = await supabase
      .from("generation_jobs")
      .select("id, brief_hash, brief, attempts, itinerary_id")
      .eq("user_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!pending) {
      const { data: latest } = await supabase
        .from("generation_jobs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return latest ?? null;
    }

    const { data: claimed } = await supabase.rpc("claim_generation_job", { _job_id: pending.id });
    if (!claimed || claimed.length === 0) {
      const { data: job } = await supabase.from("generation_jobs").select("*").eq("id", pending.id).single();
      return job;
    }

    const job = claimed[0];
    const brief = job.brief as unknown as TripBrief;

    try {
      const result = await buildItinerary(brief);

      const { error: updateError } = await supabase
        .from("generation_jobs")
        .update({
          status: "completed",
          result: result as unknown as Json,
          completed_at: new Date().toISOString(),
        })
        .eq("id", job.id);
      if (updateError) throw updateError;

      await writeCache(supabase, job.brief_hash, brief, result);

      if (job.itinerary_id) {
        await updateItineraryFromResult(supabase, job.itinerary_id, result, brief);
      }

      const { data: completedJob } = await supabase.from("generation_jobs").select("*").eq("id", job.id).single();
      return completedJob;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const isCreditError = message.includes("exhausted") || message.includes("paused");
      const isRateLimit = message.includes("Too many requests") || message.includes("rate limit");

      let nextStatus: "pending" | "failed" = "failed";
      if (isRateLimit && job.attempts < 3) {
        nextStatus = "pending";
      }

      const { data: updatedJob } = await supabase
        .from("generation_jobs")
        .update({
          status: nextStatus,
          error_message: message,
          completed_at: nextStatus === "failed" ? new Date().toISOString() : null,
        })
        .eq("id", job.id)
        .select("*")
        .single();

      if (isCreditError) {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await setPaused(supabaseAdmin);
      }

      return updatedJob;
    }
  });

export const getGenerationStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");

    const { data: paused } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "generation_paused")
      .single();

    const { count: pendingCount } = await supabase
      .from("generation_jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: runningCount } = await supabase
      .from("generation_jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "running");

    const { count: completedCount } = await supabase
      .from("generation_jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");

    const { count: failedCount } = await supabase
      .from("generation_jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed");

    const { count: cacheCount } = await supabase.from("itinerary_cache").select("*", { count: "exact", head: true });

    return {
      paused: paused?.value === "true",
      pending: pendingCount ?? 0,
      running: runningCount ?? 0,
      completed: completedCount ?? 0,
      failed: failedCount ?? 0,
      cache: cacheCount ?? 0,
    };
  });
