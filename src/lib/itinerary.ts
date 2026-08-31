export type Poi = {
  name: string;
  description: string;
  category: string;
  duration?: string;
  tips?: string;
};

export type ItineraryDay = {
  day: number;
  date: string;
  theme: string;
  morning: Poi[];
  afternoon: Poi[];
  evening: Poi[];
};

export type ItineraryData = {
  trip_title: string;
  destination: string;
  days: ItineraryDay[];
  general_tips: string[];
  suggested_resources: {
    flights?: string;
    hotels?: string;
    activities?: string;
    [key: string]: string | undefined;
  };
};

export type TripRow = {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  pax_adults: number;
  pax_children: number;
  interests: string[];
  budget_range: string | null;
  itinerary_data: ItineraryData;
  is_public: boolean;
  share_token: string;
  created_at: string;
  updated_at: string;
};

export const INTERESTS = [
  "Food",
  "Culture",
  "Adventure",
  "Shopping",
  "Nature",
  "History",
  "Nightlife",
  "Family-Friendly",
  "Hidden Gems",
] as const;

export const BUDGETS = ["Budget", "Mid-range", "Luxury"] as const;

export const DISCOVER_CATEGORIES = [
  "Hidden Gems",
  "Local Picks",
  "Popular",
  "Off the Beaten Path",
] as const;

export const TRAVEL_TIPS = [
  "Pack a reusable water bottle — most cities have free refill points.",
  "Screenshot your itinerary; signal drops in the most beautiful places.",
  "Eat where the queue is longest and the menu is shortest.",
  "Book the first slot of the day for popular sights — half the crowd.",
  "Learn three words of the local language. It changes everything.",
  "Keep a photo of your passport in your email drafts.",
  "Walk one neighbourhood with no plan at all. That's where the trip happens.",
  "Cash still rules at markets. Small notes travel further.",
];

export function googleSearchUrl(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function googleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function daysBetween(start: string, end: string) {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

export function formatRange(start?: string | null, end?: string | null) {
  if (!start || !end) return "Dates to be confirmed";
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const s = new Date(start).toLocaleDateString("en-GB", opts);
  const e = new Date(end).toLocaleDateString("en-GB", { ...opts, year: "numeric" });
  return `${s} – ${e}`;
}
