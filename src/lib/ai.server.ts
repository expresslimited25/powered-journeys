const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "openai/gpt-5.6-sol";

export type TripBrief = {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  interests: string[];
  budget: string | null;
};

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("The AI response was not valid JSON.");
  return JSON.parse(raw.slice(start, end + 1));
}

export async function callAi(system: string, user: string): Promise<unknown> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this project.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      reasoning_effort: "none",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (res.status === 429) throw new Error("Too many requests right now — try again in a moment.");
  if (res.status === 402) throw new Error("AI credits are exhausted. Please top up to continue.");
  if (!res.ok) throw new Error(`AI request failed (${res.status}).`);

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content ?? "";
  return extractJson(content);
}

export function daysCount(start: string, end: string) {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  return Math.min(21, Math.max(1, Math.round((b - a) / 86400000) + 1));
}

export const ITINERARY_SYSTEM = `You are Wandr, an expert travel planner.
Reply with ONE JSON object and nothing else — no prose, no markdown fences.
Schema:
{
  "trip_title": string,
  "destination": string,
  "days": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "theme": string,
      "morning": [ { "name": string, "description": string, "category": string, "duration": string, "tips": string } ],
      "afternoon": [ ... same shape ... ],
      "evening": [ ... same shape ... ]
    }
  ],
  "general_tips": string[],
  "suggested_resources": { "flights": string, "hotels": string, "activities": string }
}
Rules: 2-3 real, specific, named places per time block. Descriptions are 1-2 vivid sentences.
"category" must be one of: Food, Culture, Adventure, Shopping, Nature, History, Nightlife, Family-Friendly, Hidden Gems.
Set suggested_resources to https://www.google.com/travel/flights, https://www.booking.com and https://www.klook.com.
Never mention bookings you cannot make.`;

export function itineraryPrompt(brief: TripBrief) {
  const n = daysCount(brief.startDate, brief.endDate);
  return `Plan a ${n}-day trip to ${brief.destination}.
Arrival: ${brief.startDate}. Departure: ${brief.endDate}.
Travellers: ${brief.adults} adult(s)${brief.children ? ` and ${brief.children} child(ren)` : ""}.
Interests: ${brief.interests.length ? brief.interests.join(", ") : "a bit of everything"}.
Budget: ${brief.budget ?? "flexible"}.
Give each day a distinct theme and keep travel between stops sensible. Dates must run consecutively from the arrival date.`;
}

export const INSPIRE_SYSTEM = `You are Wandr's discovery engine. Reply with ONE JSON object only:
{ "destination": string, "country": string, "tagline": string, "description": string, "best_time": string, "tags": string[] }
Pick a genuinely underrated destination — never Paris, Rome, Bali, Tokyo or London.
"description" is 2-3 evocative sentences. "tags" holds 3 short labels.`;
