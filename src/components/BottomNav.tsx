import { Link } from "@tanstack/react-router";
import { Compass, Home, Sparkles, User } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/plan", label: "Plan", icon: Sparkles },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-2 py-1.5">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-accent" }}
          >
            <Icon className="size-5" />
            <span className="text-[11px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto w-full max-w-3xl px-4 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
