import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
};

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const meta = (user?.user_metadata ?? {}) as Record<string, string | undefined>;
  const profile: Profile | null = user
    ? {
        id: user.id,
        email: user.email ?? null,
        name: meta["full_name"] ?? meta["name"] ?? user.email?.split("@")[0] ?? "Traveller",
        avatar_url: meta["avatar_url"] ?? meta["picture"] ?? null,
      }
    : null;

  return { user, profile, loading };
}
