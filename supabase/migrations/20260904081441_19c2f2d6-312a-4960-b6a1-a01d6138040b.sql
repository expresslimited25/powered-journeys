-- Replace security-definer public_profiles view with a table + sync trigger

-- 1. Drop the existing view
DROP VIEW IF EXISTS public.public_profiles;

-- 2. Create the public_profiles table (no email column)
CREATE TABLE public.public_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  avatar_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.public_profiles TO anon, authenticated;
GRANT ALL ON public.public_profiles TO service_role;

ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are readable by everyone"
  ON public.public_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3. Trigger function to keep public_profiles in sync with profiles
CREATE OR REPLACE FUNCTION public.sync_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.public_profiles (id, name, avatar_url)
  VALUES (NEW.id, NEW.name, NEW.avatar_url)
  ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_public_profile() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_public_profile() TO service_role;

-- 4. Attach trigger
CREATE TRIGGER profiles_sync_public
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_public_profile();

-- 5. Backfill existing profiles
INSERT INTO public.public_profiles (id, name, avatar_url)
SELECT id, name, avatar_url FROM public.profiles
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();

-- 6. Add index on public_profiles.id (primary key already creates unique index, but be explicit about FK target)
CREATE INDEX IF NOT EXISTS idx_public_profiles_name ON public.public_profiles(name);
