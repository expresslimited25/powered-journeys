-- Tighten SECURITY DEFINER function grants

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

REVOKE ALL ON FUNCTION public.record_generation_attempt(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_generation_attempt(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.claim_generation_job(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_generation_job(uuid) TO authenticated, service_role;

-- Ensure the existing trigger function is also locked down
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO service_role;
