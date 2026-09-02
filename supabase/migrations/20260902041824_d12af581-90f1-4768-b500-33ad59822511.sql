-- Scalable generation infrastructure

-- 1. Job queue
CREATE TABLE public.generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  brief_hash text NOT NULL,
  brief jsonb NOT NULL,
  result jsonb,
  error_message text,
  itinerary_id uuid REFERENCES public.itineraries(id) ON DELETE SET NULL,
  target_itinerary_id uuid REFERENCES public.itineraries(id) ON DELETE SET NULL,
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone
);

GRANT SELECT, INSERT, UPDATE ON public.generation_jobs TO authenticated;
GRANT ALL ON public.generation_jobs TO service_role;

ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generation jobs"
  ON public.generation_jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own generation jobs"
  ON public.generation_jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generation jobs"
  ON public.generation_jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Per-user usage counters
CREATE TABLE public.generation_usage (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_count integer NOT NULL DEFAULT 0,
  daily_date date NOT NULL DEFAULT current_date,
  monthly_count integer NOT NULL DEFAULT 0,
  monthly_date date NOT NULL DEFAULT date_trunc('month', current_date)::date,
  total_count integer NOT NULL DEFAULT 0,
  last_used_at timestamp with time zone
);

GRANT SELECT, INSERT, UPDATE ON public.generation_usage TO authenticated;
GRANT ALL ON public.generation_usage TO service_role;

ALTER TABLE public.generation_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON public.generation_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON public.generation_usage FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON public.generation_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Itinerary result cache (no user_id — results are reusable travel plans)
CREATE TABLE public.itinerary_cache (
  brief_hash text PRIMARY KEY,
  destination text NOT NULL,
  start_date date,
  end_date date,
  pax_adults integer NOT NULL DEFAULT 1,
  pax_children integer NOT NULL DEFAULT 0,
  interests text[] NOT NULL DEFAULT '{}'::text[],
  budget_range text,
  itinerary_data jsonb NOT NULL,
  hit_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '30 days')
);

GRANT SELECT, INSERT, UPDATE ON public.itinerary_cache TO authenticated;
GRANT ALL ON public.itinerary_cache TO service_role;

ALTER TABLE public.itinerary_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read cache"
  ON public.itinerary_cache FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can write cache"
  ON public.itinerary_cache FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update cache"
  ON public.itinerary_cache FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. App config / feature flags
CREATE TABLE public.app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_config TO anon, authenticated;
GRANT ALL ON public.app_config TO service_role;

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Config readable by all"
  ON public.app_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Config writable by service role"
  ON public.app_config FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO public.app_config (key, value) VALUES ('generation_paused', 'false');

-- 5. Helper: atomically record usage and enforce daily/monthly limits
CREATE OR REPLACE FUNCTION public.record_generation_attempt(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today date := current_date;
  this_month date := date_trunc('month', current_date)::date;
  rec public.generation_usage%ROWTYPE;
  result jsonb;
BEGIN
  SELECT * INTO rec FROM public.generation_usage WHERE user_id = _user_id FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.generation_usage
      (user_id, daily_count, daily_date, monthly_count, monthly_date, total_count, last_used_at)
    VALUES
      (_user_id, 1, today, 1, this_month, 1, now())
    RETURNING * INTO rec;
    result := jsonb_build_object('allowed', true, 'daily', 1, 'monthly', 1);
  ELSE
    IF rec.daily_date <> today THEN
      rec.daily_count := 0;
      rec.daily_date := today;
    END IF;
    IF rec.monthly_date <> this_month THEN
      rec.monthly_count := 0;
      rec.monthly_date := this_month;
    END IF;

    IF rec.daily_count >= 5 OR rec.monthly_count >= 50 THEN
      result := jsonb_build_object('allowed', false, 'daily', rec.daily_count, 'monthly', rec.monthly_count);
    ELSE
      rec.daily_count := rec.daily_count + 1;
      rec.monthly_count := rec.monthly_count + 1;
      rec.total_count := rec.total_count + 1;
      rec.last_used_at := now();

      UPDATE public.generation_usage
      SET daily_count = rec.daily_count,
          daily_date = rec.daily_date,
          monthly_count = rec.monthly_count,
          monthly_date = rec.monthly_date,
          total_count = rec.total_count,
          last_used_at = rec.last_used_at
      WHERE user_id = _user_id;

      result := jsonb_build_object('allowed', true, 'daily', rec.daily_count, 'monthly', rec.monthly_count);
    END IF;
  END IF;

  RETURN result;
END;
$$;

-- 6. Helper: atomically claim a pending job
CREATE OR REPLACE FUNCTION public.claim_generation_job(_job_id uuid)
RETURNS TABLE(id uuid, user_id uuid, brief_hash text, brief jsonb, attempts integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH claimed AS (
    UPDATE public.generation_jobs
    SET status = 'running',
        started_at = now(),
        attempts = attempts + 1
    WHERE id = _job_id AND status = 'pending'
    RETURNING public.generation_jobs.id,
              public.generation_jobs.user_id,
              public.generation_jobs.brief_hash,
              public.generation_jobs.brief,
              public.generation_jobs.attempts
  )
  SELECT * FROM claimed;
END;
$$;

-- 7. Indexes for scale
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON public.itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_share_token ON public.itineraries(share_token);
CREATE INDEX IF NOT EXISTS idx_itineraries_public_created ON public.itineraries(created_at DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_discover_posts_user_id ON public.discover_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_discover_posts_created_at ON public.discover_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_status ON public.generation_jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_brief_hash ON public.generation_jobs(brief_hash);
CREATE INDEX IF NOT EXISTS idx_itinerary_cache_expires ON public.itinerary_cache(expires_at);

-- 8. Updated-at trigger for generation_jobs
CREATE TRIGGER generation_jobs_updated_at
  BEFORE UPDATE ON public.generation_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
