# Wandr — next improvements

## Goal
Build on the secured, scalable foundation: make the app feel trustworthy and polished for the beta cohort, and verify the new AI generation queue actually works end to end.

## What we will build

### 1. Verify the generation queue end to end
The queue, rate limits and caching were built but never smoke-tested (skipped to save credits).
- Run one real trip generation through the wizard and confirm: job queues → completes → itinerary renders on the trip page.
- Confirm regeneration on the trip page also works.
- Confirm the friendly error appears when a limit or pause is hit.
- Grant your account the admin role in `user_roles` so the Admin status page (/admin) is actually usable, and link to it from the Profile page for admins only.

### 2. Trip cover photos
Trip cards and the itinerary page are text-only right now. Add a destination cover image (AI-generated on completion, or a curated fallback) shown on trip cards and as a hero on the trip page. Cached per destination so repeat trips cost nothing.

### 3. Profile page polish
- Show the user's generation usage (today / this month, e.g. "3 of 5 plans used today") so limits never surprise anyone.
- Add a working "edit name / avatar" form if not already present.

### 4. Discover feed finishing touches
- Pull-to-refresh / retry on error, nicer empty state, and per-post link sharing.
- Like or save buttons if quick to add (optional, can defer).

### 5. Small UX and SEO pass
- Consistent loading skeletons and empty states across pages.
- Confirm every page has a proper title/description (mostly done) and the share page shows the trip title as its link preview.
- Favicon/app icon in the new ink-and-gold style.

## Out of scope
- Payments, paid tiers, or moving off the free tier.
- Multi-region infra, push notifications, native apps.

## Verification
- Typecheck/build after changes.
- Playwright: full signed-in run — generate a trip, view it, check profile usage, browse Discover.
- No console errors on any page visited.

## Technical notes
- Cover images via Lovable AI image generation, stored in Supabase Storage; cached by destination slug.
- Admin link visibility checked client-side via `has_role`; the page itself stays server-protected.
