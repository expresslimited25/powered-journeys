# Secure the profiles table (stop public email exposure)

## Problem
The security scan confirmed that `profiles` has a public read policy returning every column, including `email`. Anyone on the internet can list all user emails.

## Fix

**1. Database migration**
- Drop the public read policy on `profiles` ("Profiles are viewable by everyone").
- Add an owner-scoped read policy: signed-in users can only read their own full profile (needed for the Profile page, which shows name/email/avatar).
- Create a view `public_profiles` exposing only safe columns (`id`, `name`, `avatar_url`), running with the view owner's privileges so it bypasses row-level security safely.
- Grant read on `public_profiles` to everyone (anon + signed-in); grant everything to the service role.
- Result: emails are never returned to anyone except the owner; names/avatars stay available for the community feed.

**2. Update the Discover feed query** (`src/routes/_authenticated/discover.tsx`)
- Replace the embedded `profiles(name, avatar_url)` join with the safe `public_profiles` view: fetch posts, then fetch the matching public profiles by user id and merge them in code. No UI change.

**3. Verify**
- Re-run the security scan and confirm the email-exposure finding is gone, then mark it fixed.
- Typecheck the app and smoke-test Discover + Profile in the preview.

## Technical details
- Migration via the database migration tool (your approval required).
- No other tables change: `itineraries` and `discover_posts` already have correct owner-scoped policies; share links already use random tokens and only expose `is_public` trips.
