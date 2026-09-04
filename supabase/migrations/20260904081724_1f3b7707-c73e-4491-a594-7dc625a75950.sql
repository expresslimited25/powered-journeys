CREATE OR REPLACE FUNCTION public.claim_generation_job(_job_id uuid)
 RETURNS TABLE(id uuid, user_id uuid, brief_hash text, brief jsonb, attempts integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  WITH claimed AS (
    UPDATE public.generation_jobs
    SET status = 'running',
        started_at = now(),
        attempts = attempts + 1
    WHERE id = _job_id
      AND status = 'pending'
      AND user_id = auth.uid()
    RETURNING public.generation_jobs.id,
              public.generation_jobs.user_id,
              public.generation_jobs.brief_hash,
              public.generation_jobs.brief,
              public.generation_jobs.attempts
  )
  SELECT * FROM claimed;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.claim_generation_job(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_generation_job(uuid) TO service_role;
REVOKE EXECUTE ON FUNCTION public.claim_generation_job(uuid) FROM anon, PUBLIC;
