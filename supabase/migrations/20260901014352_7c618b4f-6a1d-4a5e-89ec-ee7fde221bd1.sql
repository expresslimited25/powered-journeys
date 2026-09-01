ALTER TABLE public.discover_posts
  ADD CONSTRAINT discover_posts_profile_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;