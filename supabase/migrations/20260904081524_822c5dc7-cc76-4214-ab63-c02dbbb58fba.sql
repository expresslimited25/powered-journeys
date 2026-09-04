-- Lock down trigger-only sync function
REVOKE EXECUTE ON FUNCTION public.sync_public_profile() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_public_profile() TO service_role;
