-- Lock down SECURITY DEFINER helper functions

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.record_generation_attempt(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.claim_generation_job(uuid) FROM anon, PUBLIC;

-- Ensure service_role can still run everything
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.record_generation_attempt(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_generation_job(uuid) TO service_role;
