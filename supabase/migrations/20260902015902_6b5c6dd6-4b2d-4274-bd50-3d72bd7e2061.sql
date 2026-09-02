DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

REVOKE SELECT ON public.profiles FROM anon;

CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = off) AS
SELECT id, name, avatar_url FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;
GRANT ALL ON public.public_profiles TO service_role;