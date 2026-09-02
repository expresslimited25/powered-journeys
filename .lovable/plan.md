# Make Wandr scalable from 100 beta users to thousands (free-tier first)

## Goal
Prepare the app to grow from a small beta (≈100 users) to thousands of users while staying on Lovable Cloud and AI Gateway free tiers as long as possible. The biggest risk is heavy, concurrent AI itinerary generation — it is slow, rate-limited, and the most expensive operation per user.

## What we will build

### 1. Rate-limit and shape AI usage
- Add per-user daily/monthly limits on itinerary generation (e.g. 5 new trips per day, configurable).
- Add a global concurrent-generation cap so the app never overwhelms the AI Gateway.
- Track usage in a small `generation_usage` table (user_id, date, count, last_used_at) with RLS so users can read their own stats.
- Return friendly, actionable errors when limits are hit instead of raw gateway failures.

### 2. Cache and deduplicate AI requests
- Cache generated itineraries by a hash of the trip brief (destination, dates, travellers, interests, budget) in a `itinerary_cache` table or reuse the existing `itineraries` structure.
- Before calling the AI, check whether an identical or near-identical brief was already generated recently (e.g. within 30 days) and return the cached result.
- This dramatically cuts AI spend when users experiment with the same destination or share prompts.

### 3. Move heavy generation into a background queue
- Convert itinerary generation from a synchronous server function into an async job:
  - User submits the wizard form.
  - A `generation_jobs` row is created with status `pending`.
  - A lightweight server function polls/job worker picks up pending jobs sequentially (respecting the concurrent cap and rate limits).
  - The client polls for status or listens via realtime updates.
- Benefits: users are not blocked by slow AI calls, timeouts are avoided, and bursts of traffic are smoothed out.

### 4. Database hardening for scale
- Add indexes on high-traffic lookup columns: `itineraries.user_id`, `itineraries.share_token`, `itineraries.is_public`, `discover_posts.user_id`, `discover_posts.created_at`, `generation_jobs.user_id`/`status`.
- Add a partial index for public discover posts so the feed stays fast.
- Confirm RLS policies are still correct after adding new tables.

### 5. Public/share-page caching
- Public share links (`/share/:token`) are read-heavy and ideal for edge caching.
- Add short-term HTTP cache headers to the share route response so repeat views do not hit the database every time.
- Keep the share token random and long to prevent enumeration.

### 6. Cost guards and monitoring
- Add a server-side feature flag / kill switch for AI generation that can be flipped instantly if credits run low.
- Surface a simple admin/status endpoint (or protected page) showing:
  - Today's generation count vs. limit
  - Queue depth (pending jobs)
  - Cache hit rate
- Wire up friendly user-facing messages for "AI is busy" or "generation paused" states.

### 7. Optional: anonymous browse vs. authenticated generate
- Allow unauthenticated users to browse the Discover feed and public share pages.
- Reserve Google sign-in only for generating/saving trips. This lowers friction and reduces unnecessary auth load.

## Out of scope for this plan
- Multi-region deployment or dedicated load balancers (not needed until much larger scale).
- Switching off Lovable Cloud to a self-managed backend.
- Paid-tier upgrades (we will design for free-tier limits; upgrading remains an option later).

## Verification
- Typecheck and build the app after changes.
- Run a load-style smoke test: submit several trip plans in quick succession and confirm they queue, complete, and surface results without gateway 429s.
- Confirm the Discover feed and share pages still render quickly.
- Check that rate limits correctly block excessive generation and show helpful messages.

## Technical notes
- All new tables get RLS enabled and explicit `GRANT`s per project rules.
- Background job worker runs as a TanStack server route or a scheduled call to a protected endpoint; no Supabase Edge Functions.
- The AI Gateway already returns `429` with `Retry-After`; the queue will honor that header.
