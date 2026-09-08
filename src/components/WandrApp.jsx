"use client";

import { useState, useEffect } from "react";

// Inject styles
if (!document.getElementById("wandr-styles")) {
  const s = document.createElement("style");
  s.id = "wandr-styles";
  s.textContent = [
    "@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;500;600;700&display=swap');",
    "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}",
    ":root{--bg:#FAFAF7;--fg:#111111;--card:#FFFFFF;--muted:#F2F0EB;--muted-fg:#6B6457;--accent:#C8B27D;--accent-fg:#111111;--border:#E8E4DC;--navy:#111111;--navy-fg:#FAFAF7;--destructive:#C0392B;--font-display:'Lora',Georgia,serif;--font-sans:'Nunito Sans',system-ui,sans-serif;--radius:14px;--shadow-soft:0 1px 2px rgba(17,17,17,.06),0 10px 30px -14px rgba(17,17,17,.22);--shadow-lift:0 20px 45px -22px rgba(17,17,17,.40);--gradient-hero:linear-gradient(140deg,#0e0e0e 0%,#1c1a16 45%,#5a4a2a 100%);--gradient-amber:linear-gradient(100deg,#d4b97a,#b8965a)}",
    "body{background:var(--bg);color:var(--fg);font-family:var(--font-sans);-webkit-font-smoothing:antialiased}",
    ".font-display{font-family:var(--font-display)}",
    ".app-shell{min-height:100vh;background:var(--bg);padding-bottom:96px}",
    ".app-content{max-width:720px;margin:0 auto;padding:24px 16px}",
    ".bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:40;border-top:1px solid var(--border);background:rgba(255,255,255,.95);backdrop-filter:blur(12px)}",
    ".bottom-nav-inner{max-width:520px;margin:0 auto;display:flex;justify-content:space-between;padding:6px 8px}",
    ".nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;border-radius:10px;border:none;background:none;cursor:pointer;color:var(--muted-fg);transition:color .15s;font-family:var(--font-sans)}",
    ".nav-item:hover{color:var(--fg)}.nav-item.active{color:var(--accent)}",
    ".nav-label{font-size:11px;font-weight:500}",
    ".card{background:var(--card);border-radius:var(--radius);border:1px solid var(--border)}",
    ".card-hero{background-image:var(--gradient-hero);border-radius:var(--radius);border:none;color:var(--navy-fg);box-shadow:var(--shadow-lift)}",
    ".shadow-soft{box-shadow:var(--shadow-soft)}.shadow-lift{box-shadow:var(--shadow-lift)}",
    ".btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:10px;border:1px solid transparent;cursor:pointer;font-family:var(--font-sans);font-size:14px;font-weight:600;transition:opacity .15s,box-shadow .15s;white-space:nowrap}",
    ".btn:disabled{opacity:.5;cursor:not-allowed}",
    ".btn-primary{background:var(--fg);color:var(--navy-fg)}.btn-primary:hover:not(:disabled){opacity:.85}",
    ".btn-amber{background-image:var(--gradient-amber);color:var(--accent-fg);border:none}.btn-amber:hover:not(:disabled){opacity:.9}",
    ".btn-outline{background:var(--card);color:var(--fg);border-color:var(--border)}.btn-outline:hover:not(:disabled){background:var(--muted)}",
    ".btn-ghost{background:none;border:none;color:var(--fg);padding:8px 12px}.btn-ghost:hover:not(:disabled){background:var(--muted)}",
    ".btn-danger{background:var(--destructive);color:#fff;border:none}",
    ".btn-sm{padding:6px 14px;font-size:13px}.btn-icon{padding:8px;border-radius:8px}.btn-lg{padding:14px 28px;font-size:15px}",
    ".input{width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:10px;font-family:var(--font-sans);font-size:14px;background:var(--card);color:var(--fg);outline:none;transition:border-color .15s}",
    ".input:focus{border-color:var(--accent)}",
    ".textarea{width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:10px;font-family:var(--font-sans);font-size:14px;background:var(--card);color:var(--fg);outline:none;resize:vertical;transition:border-color .15s}",
    ".textarea:focus{border-color:var(--accent)}",
    ".label{font-size:13px;font-weight:600;color:var(--fg);display:block;margin-bottom:6px}",
    ".badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;font-size:12px;font-weight:500;background:var(--muted);color:var(--fg);border:1px solid var(--border)}",
    ".badge-accent{background:rgba(200,178,125,.2);color:var(--accent-fg);border-color:var(--accent)}",
    ".progress-track{height:6px;background:var(--muted);border-radius:99px;overflow:hidden}",
    ".progress-fill{height:100%;background:var(--accent);border-radius:99px;transition:width .4s ease}",
    ".chip{padding:6px 14px;border-radius:99px;border:1px solid var(--border);background:var(--card);cursor:pointer;font-size:13px;font-weight:500;color:var(--fg);transition:background .15s,border-color .15s}",
    ".chip:hover{background:var(--muted)}.chip.active{background:var(--accent);border-color:var(--accent);color:var(--accent-fg)}",
    ".hero-page{min-height:100vh;background-image:var(--gradient-hero);display:flex;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden}",
    ".hero-blob-1{position:absolute;top:40px;left:-96px;width:400px;height:400px;border-radius:50%;background:rgba(200,178,125,.2);filter:blur(80px);pointer-events:none}",
    ".hero-blob-2{position:absolute;bottom:0;right:-80px;width:480px;height:480px;border-radius:50%;background:rgba(50,40,20,.6);filter:blur(80px);pointer-events:none}",
    ".hero-inner{position:relative;z-index:1;max-width:480px;text-align:center}",
    ".hero-eyebrow{font-size:11px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:var(--accent)}",
    ".hero-title{font-family:var(--font-display);font-size:clamp(64px,15vw,96px);font-weight:600;color:var(--navy-fg);line-height:1;margin-top:16px}",
    ".hero-sub{margin-top:20px;font-size:17px;color:rgba(250,250,247,.8);line-height:1.5}",
    ".login-page{min-height:100vh;background-image:var(--gradient-hero);display:flex;align-items:center;justify-content:center;padding:24px}",
    ".section-title{font-family:var(--font-display);font-size:20px;color:var(--fg);margin-bottom:12px}",
    ".page-title{font-family:var(--font-display);font-size:clamp(26px,6vw,32px);color:var(--fg);margin-bottom:4px}",
    ".skeleton{background:linear-gradient(90deg,var(--muted) 25%,var(--border) 50%,var(--muted) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:var(--radius)}",
    "@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}",
    "@keyframes spin{to{transform:rotate(360deg)}}",
    ".spin{animation:spin 1s linear infinite}",
    ".accordion-item{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);overflow:hidden;box-shadow:var(--shadow-soft)}",
    ".accordion-trigger{width:100%;padding:16px;display:flex;justify-content:space-between;align-items:center;border:none;background:none;cursor:pointer;text-align:left;font-family:var(--font-sans)}",
    ".accordion-trigger:hover{background:var(--muted)}",
    ".accordion-content{padding:0 16px 20px;border-top:1px solid var(--border)}",
    ".trip-card{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);overflow:hidden;cursor:pointer;transition:box-shadow .2s}",
    ".trip-card:hover{box-shadow:var(--shadow-lift)}",
    ".trip-card-img{width:100%;height:120px;object-fit:cover}",
    ".trip-card-body{padding:14px}",
    ".trip-card-title{font-family:var(--font-display);font-size:17px;line-height:1.3}",
    ".trip-card-meta{display:flex;flex-wrap:wrap;gap:12px;margin-top:6px;font-size:13px;color:var(--muted-fg)}",
    ".poi-card{background:var(--card);border-radius:var(--radius);border:1px solid rgba(0,0,0,.07);padding:14px}",
    ".stepper-row{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--border);border-radius:12px;padding:12px 16px}",
    ".stepper-controls{display:flex;align-items:center;gap:16px}",
    ".stepper-val{font-size:18px;font-weight:700;min-width:24px;text-align:center}",
    ".modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}",
    ".modal{background:var(--card);border-radius:var(--radius);width:100%;max-width:480px;padding:24px;box-shadow:var(--shadow-lift)}",
    ".modal-title{font-family:var(--font-display);font-size:20px;margin-bottom:16px}",
    ".modal-footer{display:flex;justify-content:space-between;gap:8px;margin-top:20px}",
    ".tip-block{background:var(--muted);border-radius:8px;padding:8px 12px;font-size:12px;color:var(--muted-fg)}",
    ".gen-screen{min-height:100vh;background-image:var(--gradient-hero);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px}",
    ".discover-card{background:var(--card);border-radius:var(--radius);border:1px solid var(--border);overflow:hidden;cursor:pointer;transition:box-shadow .2s;height:100%}",
    ".discover-card:hover{box-shadow:var(--shadow-lift)}",
    ".discover-card-img{width:100%;height:140px;background-image:var(--gradient-hero)}",
    ".discover-card-body{padding:14px}",
    ".grid-2{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}",
    ".space-y-2>*+*{margin-top:8px}.space-y-3>*+*{margin-top:12px}.space-y-4>*+*{margin-top:16px}.space-y-5>*+*{margin-top:20px}.space-y-6>*+*{margin-top:24px}.space-y-8>*+*{margin-top:32px}",
    ".flex{display:flex}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}",
    ".gap-2{gap:8px}.gap-3{gap:12px}.gap-4{gap:16px}",
    ".truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    ".text-sm{font-size:13px}.text-xs{font-size:11px}.font-medium{font-weight:500}.font-semibold{font-weight:600}",
    ".text-muted{color:var(--muted-fg)}.text-accent{color:var(--accent)}.text-white{color:var(--navy-fg)}",
    ".w-full{width:100%}.mt-1{margin-top:4px}.mt-2{margin-top:8px}.mt-3{margin-top:12px}.mt-4{margin-top:16px}.mt-5{margin-top:20px}.mt-6{margin-top:24px}.mt-8{margin-top:32px}",
    ".mb-2{margin-bottom:8px}.p-4{padding:16px}.p-5{padding:20px}.p-6{padding:24px}",
    ".rounded-xl{border-radius:var(--radius)}.text-center{text-align:center}.underline{text-decoration:underline}",
    ".inline-flex{display:inline-flex}.shrink-0{flex-shrink:0}.min-w-0{min-width:0}.flex-1{flex:1}",
    "a{color:inherit;text-decoration:none}",
    ".review-table{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}",
    ".review-row{display:flex;justify-content:space-between;gap:16px;padding:10px 16px;font-size:13px}",
    ".review-row+.review-row{border-top:1px solid var(--border)}",
    ".review-row dt{color:var(--muted-fg)}.review-row dd{font-weight:500;text-align:right}",
    ".inspire-card{background:rgba(200,178,125,.1);border:1px solid rgba(200,178,125,.3);border-radius:var(--radius);padding:20px}",
    ".inspire-result{background:var(--card);border-radius:10px;padding:16px;margin-top:16px}",
    ".avatar{width:48px;height:48px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:18px;color:var(--accent-fg);flex-shrink:0;overflow:hidden}",
    ".avatar img{width:100%;height:100%;object-fit:cover}",
    ".poi-link{color:var(--fg);text-decoration:none;display:inline-flex;align-items:center;gap:3px;font-weight:500;opacity:.75;font-size:12px}",
    ".poi-link:hover{opacity:1;text-decoration:underline}",
    ".poi-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}",
  ].join("\n");
  document.head.appendChild(s);
}

// Icons
const Icon = ({ name, size = 16, style = {} }) => {
  const p = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    sparkles: <><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></>,
    compass: <><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus: <><line x1="5" y1="12" x2="19" y2="12"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    loader: <><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></>,
    pencil: <><line x1="18" y1="2" x2="22" y2="6"/><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    logOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    chevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    externalLink: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    luggage: <><path d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><line x1="12" y1="12" x2="12" y2="12"/><path d="M8 12h8"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {p[name]}
    </svg>
  );
};

// Constants
const INTERESTS = ["Food","Culture","Adventure","Shopping","Nature","History","Nightlife","Family-Friendly","Hidden Gems"];
const BUDGETS = ["Budget","Mid-range","Luxury"];
const POPULAR = ["Kyoto, Japan","Lisbon, Portugal","Georgetown, Malaysia","Tbilisi, Georgia","Oaxaca, Mexico","Ljubljana, Slovenia","Hoi An, Vietnam","Seville, Spain"];
const STEPS = ["Destination","Dates","Travellers","Interests","Budget","Review"];
const TRAVEL_TIPS = [
  "Pack a reusable water bottle — most cities have free refill points.",
  "Screenshot your itinerary; signal drops in the most beautiful places.",
  "Eat where the queue is longest and the menu is shortest.",
  "Book the first slot of the day for popular sights — half the crowd.",
  "Learn three words of the local language. It changes everything.",
];
const DISCOVER_CATEGORIES = ["Hidden Gems","Local Picks","Popular","Off the Beaten Path"];

// Helpers
function daysBetween(start, end) { return Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000) + 1); }
function formatRange(start, end) {
  if (!start || !end) return "Dates TBC";
  const o = { day: "numeric", month: "short" };
  return `${new Date(start).toLocaleDateString("en-GB", o)} – ${new Date(end).toLocaleDateString("en-GB", { ...o, year: "numeric" })}`;
}
function load(k, def) { try { const v = localStorage.getItem("wandr." + k); return v ? JSON.parse(v) : def; } catch { return def; } }
function save(k, v) { try { localStorage.setItem("wandr." + k, JSON.stringify(v)); } catch {} }

// Claude API — uses the artifact-native Anthropic endpoint (no key needed)
async function callClaude(system, user, maxTokens = 4000) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error("API error " + res.status + (errText ? ": " + errText.slice(0, 120) : ""));
  }
  const data = await res.json();

  // If AI hit the token limit, JSON is truncated — tell user clearly
  if (data.stop_reason === "max_tokens") {
    throw new Error("Trip too long to generate. Try a shorter trip (3-5 days) or fewer interests.");
  }

  const text = (data.content || []).map(b => b.text || "").join("");

  // Strip markdown fences
  const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

  // Extract outermost JSON object
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI returned an unexpected format. Please try again.");

  try {
    return JSON.parse(stripped.slice(start, end + 1));
  } catch {
    try { return JSON.parse(text); } catch {}
    console.error("Raw AI response:", text.slice(0, 800));
    throw new Error("AI response could not be parsed. Please try again.");
  }
}

const ITINERARY_SYSTEM = `You are Wandr, an expert travel planner.
CRITICAL: Reply with a single raw JSON object ONLY. No prose, no markdown, no backticks, no explanation. Start with { and end with }.
Schema (use exactly these field names):
{"trip_title":string,"destination":string,"days":[{"day":number,"date":"YYYY-MM-DD","theme":string,"morning":[{"name":string,"desc":string,"cat":string,"dur":string,"tip":string}],"afternoon":[{"name":string,"desc":string,"cat":string,"dur":string,"tip":string}],"evening":[{"name":string,"desc":string,"cat":string,"dur":string,"tip":string}]}],"tips":string[]}
Rules:
- ONLY 1 place per time block (morning/afternoon/evening) to keep response short
- cat must be one of: Food,Culture,Adventure,Shopping,Nature,History,Nightlife,Family-Friendly,Hidden Gems
- desc and tip: max 1 short sentence each
- tips: max 3 general travel tips for the destination
- No suggested_resources field needed`;

const INSPIRE_SYSTEM = `You are Wandr discovery engine. You MUST reply with a single raw JSON object and nothing else — no prose, no markdown, no backticks. Your entire response must start with { and end with }. Format: {"destination":string,"country":string,"tagline":string,"description":string,"best_time":string,"tags":string[]}. Pick a genuinely underrated destination, never Paris Rome Bali Tokyo London. description is 2-3 evocative sentences. tags holds 3 short labels.`;

// Bottom Nav
function BottomNav({ page, setPage }) {
  const items = [
    { id: "home", label: "Home", icon: "home" },
    { id: "mytrips", label: "My Trips", icon: "luggage" },
    { id: "discover", label: "Discover", icon: "compass" },
    { id: "profile", label: "Profile", icon: "user" },
  ];
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {items.map(({ id, label, icon }) => (
          <button key={id} className={"nav-item" + (page === id ? " active" : "")} onClick={() => setPage(id)}>
            <Icon name={icon} size={20} />
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function Shell({ page, setPage, children }) {
  return (
    <div className="app-shell">
      <div className="app-content">{children}</div>
      <BottomNav page={page} setPage={setPage} />
    </div>
  );
}

// Welcome
function WelcomePage({ onStart }) {
  return (
    <main className="hero-page">
      <div className="hero-blob-1" />
      <div className="hero-blob-2" />
      <div className="hero-inner">
        <p className="hero-eyebrow">Welcome to</p>
        <h1 className="hero-title font-display">Wandr</h1>
        <p className="hero-sub">Your AI travel companion. Plan smarter, explore further.</p>
        <button className="btn btn-amber btn-lg" style={{ marginTop: 40 }} onClick={onStart}>Start Exploring</button>
      </div>
    </main>
  );
}

// Login
function LoginPage({ onLogin }) {
  return (
    <main className="login-page">
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div className="card p-6 text-center shadow-lift">
          <h1 className="font-display" style={{ fontSize: 36 }}>Wandr</h1>
          <p className="text-sm text-muted mt-1">Sign in to start planning your next trip.</p>
          <button className="btn btn-outline w-full" style={{ marginTop: 28, justifyContent: "center" }} onClick={onLogin}>
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 8 }}>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z"/>
              <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"/>
              <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1Z"/>
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 7 8.9 4.8 12 4.8Z"/>
            </svg>
            Continue with Google (demo)
          </button>
        </div>
      </div>
    </main>
  );
}

// Generating screen
function GenScreen({ destination }) {
  const [tip, setTip] = useState(0);
  useEffect(() => { const id = setInterval(() => setTip(t => (t + 1) % TRAVEL_TIPS.length), 3500); return () => clearInterval(id); }, []);
  return (
    <main className="gen-screen">
      <Icon name="loader" size={32} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
      <h1 className="font-display text-white" style={{ fontSize: 28, marginTop: 24 }}>Mapping out {destination}…</h1>
      <p className="text-white" style={{ marginTop: 16, maxWidth: 360, fontSize: 14, opacity: 0.75, lineHeight: 1.6 }}>{TRAVEL_TIPS[tip]}</p>
    </main>
  );
}

// Trip card
function TripCard({ trip, onClick }) {
  return (
    <div className="trip-card" onClick={onClick}>
      <div className="trip-card-body">
        <p className="trip-card-title">{trip.title}</p>
        <div className="trip-card-meta">
          <span><Icon name="mapPin" size={13} /> {trip.destination}</span>
          <span><Icon name="calendar" size={13} /> {formatRange(trip.start_date, trip.end_date)}</span>
          <span><Icon name="users" size={13} /> {(trip.pax_adults || 0) + (trip.pax_children || 0)} pax</span>
        </div>
      </div>
    </div>
  );
}

// Home
const QUICK_INSPO = ["Weekend in Tbilisi", "5 days in Kyoto", "Lisbon food trail", "Oaxaca culture trip"];

function HomePage({ trips, profile, setPage, setCurrentTrip }) {
  const today = new Date().toISOString().slice(0, 10);
  const nextTrip = trips.find(t => t.end_date >= today);
  const recentTrips = trips.slice(0, 2);

  return (
    <Shell page="home" setPage={setPage}>
      <div className="space-y-6">

        {/* Greeting */}
        <header style={{ paddingTop: 8 }}>
          <p className="text-xs font-semibold text-accent" style={{ letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>Good to see you</p>
          <h1 className="page-title">Hey {profile?.name?.split(" ")[0] ?? "there"} ✦</h1>
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>Where are we going next?</p>
        </header>

        {/* Plan a New Trip hero card */}
        <div className="card-hero p-6" style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(200,178,125,0.15)", filter: "blur(40px)", pointerEvents: "none" }} />
          <p className="text-xs font-semibold" style={{ letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>AI-Powered Planning</p>
          <h2 className="font-display text-white" style={{ fontSize: 26, lineHeight: 1.2 }}>Plan a New Trip</h2>
          <p className="text-white" style={{ marginTop: 8, fontSize: 13, opacity: 0.7, maxWidth: 300, lineHeight: 1.6 }}>
            Tell Wandr where and when — get a full day-by-day itinerary in under a minute.
          </p>
          {/* Inline destination quick-start */}
          <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {QUICK_INSPO.map(q => (
              <button key={q} onClick={() => setPage("plan")}
                style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid rgba(200,178,125,0.4)", background: "rgba(200,178,125,0.12)", color: "rgba(250,250,247,0.9)", cursor: "pointer", fontSize: 12, fontWeight: 500, backdropFilter: "blur(4px)" }}>
                {q}
              </button>
            ))}
          </div>
          <button className="btn btn-amber" style={{ marginTop: 20 }} onClick={() => setPage("plan")}>
            <Icon name="sparkles" size={15} /> Start planning
          </button>
        </div>

        {/* Next upcoming trip teaser */}
        {nextTrip && (
          <section>
            <p className="section-title" style={{ marginBottom: 10 }}>Up Next</p>
            <div className="card" style={{ overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s" }}
              onClick={() => { setCurrentTrip(nextTrip); setPage("trip"); }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-lift)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
              <div style={{ background: "var(--gradient-hero)", height: 80, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: "12px 16px" }}>
                  <span className="badge" style={{ background: "rgba(200,178,125,0.25)", borderColor: "rgba(200,178,125,0.5)", color: "#fff", fontSize: 11 }}>
                    {nextTrip.budget_range ?? "Trip planned"}
                  </span>
                </div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <p className="font-display" style={{ fontSize: 18 }}>{nextTrip.title}</p>
                <div className="trip-card-meta" style={{ marginTop: 6 }}>
                  <span><Icon name="mapPin" size={13} /> {nextTrip.destination}</span>
                  <span><Icon name="calendar" size={13} /> {formatRange(nextTrip.start_date, nextTrip.end_date)}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick links row */}
        <section>
          <p className="section-title" style={{ marginBottom: 10 }}>Explore Wandr</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "My Trips", sub: `${trips.length} saved`, icon: "luggage", page: "mytrips", color: "#C8B27D" },
              { label: "Discover", sub: "Community picks", icon: "compass", page: "discover", color: "#7D9CB2" },
            ].map(item => (
              <button key={item.label} onClick={() => setPage(item.page)}
                style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px", textAlign: "left", cursor: "pointer", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-lift)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ""}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                  <Icon name={item.icon} size={18} style={{ color: item.color }} />
                </div>
                <p className="font-semibold" style={{ fontSize: 14 }}>{item.label}</p>
                <p className="text-xs text-muted" style={{ marginTop: 2 }}>{item.sub}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Travel tip of the day */}
        <div style={{ background: "var(--muted)", borderRadius: "var(--radius)", padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>✦</span>
          <div>
            <p className="text-xs font-semibold text-accent" style={{ letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>Wandr Tip</p>
            <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>{TRAVEL_TIPS[new Date().getDay() % TRAVEL_TIPS.length]}</p>
          </div>
        </div>

      </div>
    </Shell>
  );
}


// My Trips Page
function MyTripsPage({ trips, setPage, setCurrentTrip, onTripCreated }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = trips.filter(t => !t.end_date || t.end_date >= today);
  const past = trips.filter(t => t.end_date && t.end_date < today);

  return (
    <Shell page="mytrips" setPage={setPage}>
      <div className="space-y-6">
        <header style={{ paddingTop: 8 }}>
          <h1 className="page-title">My Trips</h1>
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>Your saved itineraries, all in one place.</p>
        </header>

        {/* Plan new trip CTA */}
        <button onClick={() => setPage("plan")} style={{ width: "100%", background: "var(--card)", border: "2px dashed var(--border)", borderRadius: "var(--radius)", padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "border-color 0.15s, background 0.15s", textAlign: "left" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(200,178,125,0.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card)"; }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(200,178,125,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="sparkles" size={20} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <p className="font-semibold" style={{ fontSize: 14 }}>Plan a new trip</p>
            <p className="text-xs text-muted" style={{ marginTop: 2 }}>AI-generated itinerary in under a minute</p>
          </div>
          <Icon name="arrowRight" size={16} style={{ marginLeft: "auto", color: "var(--muted-fg)", flexShrink: 0 }} />
        </button>

        {/* Upcoming trips */}
        {upcoming.length > 0 && (
          <section className="space-y-3">
            <p className="section-title">Upcoming</p>
            {upcoming.map(t => <TripCard key={t.id} trip={t} onClick={() => { setCurrentTrip(t); setPage("trip"); }} />)}
          </section>
        )}

        {/* Past trips */}
        {past.length > 0 && (
          <section className="space-y-3">
            <p className="section-title" style={{ color: "var(--muted-fg)" }}>Past Trips</p>
            {past.map(t => (
              <div key={t.id} className="trip-card" style={{ opacity: 0.7 }} onClick={() => { setCurrentTrip(t); setPage("trip"); }}>
                <div className="trip-card-body">
                  <p className="trip-card-title">{t.title}</p>
                  <div className="trip-card-meta">
                    <span><Icon name="mapPin" size={13} /> {t.destination}</span>
                    <span><Icon name="calendar" size={13} /> {formatRange(t.start_date, t.end_date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Empty state */}
        {trips.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
            <p className="font-display" style={{ fontSize: 18, marginBottom: 8 }}>No trips yet</p>
            <p className="text-sm text-muted">Hit the button above and let Wandr plan your first adventure.</p>
          </div>
        )}
      </div>
    </Shell>
  );
}

// Plan
function PlanPage({ setPage, onTripCreated }) {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const suggestions = destination.trim() ? POPULAR.filter(p => p.toLowerCase().includes(destination.toLowerCase())).slice(0, 4) : [];
  const canContinue = [destination.trim().length > 1, Boolean(startDate && endDate && endDate >= startDate), adults > 0, true, true, true][step];

  async function submit() {
    setLoading(true); setError(null);
    try {
      const rawDays = daysBetween(startDate, endDate);
      const n = Math.min(rawDays, 5); // cap at 5 days to keep JSON size manageable
      const prompt = `Plan a ${n}-day trip to ${destination}. Start: ${startDate}. Travellers: ${adults} adult(s)${children ? ` and ${children} child(ren)` : ""}. Interests: ${interests.length ? interests.join(", ") : "general sightseeing"}. Budget: ${budget ?? "flexible"}. Give each day a distinct theme. Keep descriptions short.`;
      const itinerary = await callClaude(ITINERARY_SYSTEM, prompt, 4000);
      if (!itinerary || !Array.isArray(itinerary.days) || itinerary.days.length === 0) throw new Error("AI returned an incomplete itinerary. Please try again.");
      const trip = {
        id: crypto.randomUUID(), title: itinerary.trip_title ?? destination + " Trip",
        destination, start_date: startDate, end_date: endDate,
        pax_adults: adults, pax_children: children,
        interests, budget_range: budget, itinerary_data: itinerary,
        share_token: crypto.randomUUID(), created_at: new Date().toISOString(),
      };
      onTripCreated(trip);
    } catch (err) {
      console.error("Itinerary generation failed:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (loading) return <GenScreen destination={destination} />;

  return (
    <Shell page="mytrips" setPage={setPage}>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-accent" style={{ letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </p>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
        </div>
        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#991b1b" }}>{error}</div>}
        <div className="card p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h1 className="font-display" style={{ fontSize: 24 }}>Where are you going?</h1>
              <input className="input" autoFocus placeholder="e.g. Kyoto, Japan" value={destination} onChange={e => setDestination(e.target.value)} />
              <div className="flex flex-wrap gap-2">
                {(suggestions.length ? suggestions : POPULAR.slice(0, 4)).map(p => (
                  <button key={p} className="badge" style={{ cursor: "pointer" }} onClick={() => setDestination(p)}>{p}</button>
                ))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h1 className="font-display" style={{ fontSize: 24 }}>When are you travelling?</h1>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><label className="label">Arrival</label><input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div><label className="label">Departure</label><input className="input" type="date" min={startDate || undefined} value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
              </div>
              {startDate && endDate && endDate >= startDate && (
                <div>
                  <p className="text-sm text-muted">{daysBetween(startDate, endDate)} days on the ground.</p>
                  {daysBetween(startDate, endDate) > 5 && (
                    <p className="text-sm" style={{ color: "var(--accent)", marginTop: 4 }}>
                      ✦ Wandr will plan the first 5 days — perfect for a taster itinerary.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5">
              <h1 className="font-display" style={{ fontSize: 24 }}>Who's coming along?</h1>
              {[{ label: "Adults", val: adults, min: 1, set: setAdults }, { label: "Children", val: children, min: 0, set: setChildren }].map(({ label, val, min, set }) => (
                <div key={label} className="stepper-row">
                  <span className="font-semibold">{label}</span>
                  <div className="stepper-controls">
                    <button className="btn btn-outline btn-icon" onClick={() => set(Math.max(min, val - 1))}><Icon name="minus" size={15} /></button>
                    <span className="stepper-val">{val}</span>
                    <button className="btn btn-outline btn-icon" onClick={() => set(Math.min(12, val + 1))}><Icon name="plus" size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h1 className="font-display" style={{ fontSize: 24 }}>What are you into?</h1>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(i => {
                  const active = interests.includes(i);
                  return (
                    <button key={i} onClick={() => setInterests(prev => active ? prev.filter(x => x !== i) : [...prev, i])}
                      style={{ padding: "8px 16px", borderRadius: 99, border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`, background: active ? "var(--accent)" : "var(--card)", color: active ? "var(--accent-fg)" : "var(--fg)", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h1 className="font-display" style={{ fontSize: 24 }}>Budget range</h1>
              <p className="text-sm text-muted">Optional — skip if you're flexible.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {BUDGETS.map(b => (
                  <button key={b} onClick={() => setBudget(budget === b ? null : b)}
                    style={{ padding: "16px 12px", borderRadius: 12, border: `1px solid ${budget === b ? "var(--accent)" : "var(--border)"}`, background: budget === b ? "rgba(200,178,125,.15)" : "var(--card)", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <h1 className="font-display" style={{ fontSize: 24 }}>Ready to go?</h1>
              <dl className="review-table">
                {[["Destination", destination], ["Dates", `${startDate} → ${endDate} (${daysBetween(startDate, endDate)} days)`], ["Travellers", `${adults} adults, ${children} children`], ["Interests", interests.join(", ") || "Anything goes"], ["Budget", budget ?? "Flexible"]].map(([k, v]) => (
                  <div key={k} className="review-row"><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}><Icon name="arrowLeft" size={15} /> Back</button>
          {step < STEPS.length - 1
            ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canContinue}>Continue <Icon name="arrowRight" size={15} /></button>
            : <button className="btn btn-amber" onClick={submit}><Icon name="sparkles" size={15} /> Generate itinerary</button>}
        </div>
      </div>
    </Shell>
  );
}

// Edit modal
function EditModal({ target, draft, setDraft, onSave, onRemove, onClose }) {
  if (!target || !draft) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <p className="modal-title">Edit stop</p>
        <div className="space-y-3">
          <div><label className="label">Name</label><input className="input" value={draft.name || ""} onChange={e => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><label className="label">Description</label><textarea className="textarea" rows={3} value={draft.description || ""} onChange={e => setDraft({ ...draft, description: e.target.value })} /></div>
          <div><label className="label">Tips</label><input className="input" value={draft.tips || ""} onChange={e => setDraft({ ...draft, tips: e.target.value })} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger btn-sm" onClick={onRemove}><Icon name="trash" size={13} /> Remove</button>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={onSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Itinerary display
const BLOCKS = ["morning", "afternoon", "evening"];
const BLOCK_LABEL = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

function ItineraryDisplay({ data, editable, onChange }) {
  const [open, setOpen] = useState(["day-0"]);
  const [target, setTarget] = useState(null);
  const [draft, setDraft] = useState(null);

  function mutate(fn) { const next = JSON.parse(JSON.stringify(data)); fn(next); onChange?.(next); }
  function removePoi() { mutate(next => { next.days[target.dayIndex][target.block].splice(target.poiIndex, 1); }); setTarget(null); }
  function savePoi() { if (!target || !draft) return; mutate(next => { next.days[target.dayIndex][target.block][target.poiIndex] = draft; }); setTarget(null); }

  const days = data?.days ?? [];
  return (
    <div className="space-y-4">
      {days.map((day, dayIndex) => {
        const key = "day-" + dayIndex;
        const isOpen = open.includes(key);
        return (
          <div key={key} className="accordion-item">
            <button className="accordion-trigger" onClick={() => setOpen(o => isOpen ? o.filter(k => k !== key) : [...o, key])}>
              <div>
                <span className="text-xs font-semibold text-accent" style={{ display: "block", letterSpacing: "0.2em", textTransform: "uppercase" }}>Day {day.day ?? dayIndex + 1} · {day.date}</span>
                <span className="font-display" style={{ fontSize: 17 }}>{day.theme}</span>
              </div>
              <Icon name="chevronDown" size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .25s", flexShrink: 0 }} />
            </button>
            {isOpen && (
              <div className="accordion-content space-y-5" style={{ paddingTop: 16 }}>
                {BLOCKS.map(block => {
                  const pois = day[block] ?? [];
                  if (!pois.length) return null;
                  return (
                    <div key={block} className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted" style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>{BLOCK_LABEL[block]}</h4>
                      {pois.map((poi, poiIndex) => (
                        <div key={poi.name + poiIndex} className="poi-card">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">{poi.name}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {(poi.cat || poi.category) && <span className="badge badge-accent">{poi.cat || poi.category}</span>}
                                {(poi.dur || poi.duration) && <span className="text-xs text-muted">{poi.dur || poi.duration}</span>}
                              </div>
                            </div>
                            {editable && (
                              <button className="btn btn-ghost btn-icon" onClick={() => { setTarget({ dayIndex, block, poiIndex }); setDraft({ ...poi }); }}>
                                <Icon name="pencil" size={14} />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-muted" style={{ marginTop: 8, lineHeight: 1.55 }}>{poi.desc || poi.description}</p>
                          {(poi.tip || poi.tips) && <div className="tip-block" style={{ marginTop: 8 }}>Tip · {poi.tip || poi.tips}</div>}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <a href={"https://www.google.com/search?q=" + encodeURIComponent(poi.name + " " + (data.destination || ""))} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Icon name="search" size={13} /> Search</a>
                            <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(poi.name + " " + (data.destination || ""))} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Icon name="mapPin" size={13} /> Maps</a>
                          </div>
                          <div className="poi-links">
                            <a className="poi-link" href={"https://www.klook.com/search/?query=" + encodeURIComponent(poi.name)} target="_blank" rel="noreferrer">Book via Klook <Icon name="externalLink" size={11} /></a>
                            <a className="poi-link" href="https://www.booking.com" target="_blank" rel="noreferrer">Booking.com <Icon name="externalLink" size={11} /></a>
                            <a className="poi-link" href="https://www.google.com/travel/flights" target="_blank" rel="noreferrer">Flights <Icon name="externalLink" size={11} /></a>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      {((data?.tips || data?.general_tips) || []).length > 0 && (
        <div style={{ background: "rgba(200,178,125,.1)", border: "1px solid rgba(200,178,125,.3)", borderRadius: "var(--radius)", padding: 20 }}>
          <h3 className="font-display" style={{ fontSize: 18 }}>Good to know</h3>
          <ul className="mt-2 space-y-2">{(data.tips || data.general_tips || []).map(tip => <li key={tip} className="text-sm text-muted">· {tip}</li>)}</ul>
        </div>
      )}
      <p className="text-xs text-muted">Wandr never handles bookings or payments — every link opens an external site.</p>
      <EditModal target={target} draft={draft} setDraft={setDraft} onSave={savePoi} onRemove={removePoi} onClose={() => setTarget(null)} />
    </div>
  );
}

// Trip page
function TripPage({ trip: initialTrip, setPage, onTripUpdated, onDeleteTrip }) {
  const [trip, setTrip] = useState(initialTrip);
  const [draft, setDraft] = useState(initialTrip?.itinerary_data ?? null);
  const [savedDraft, setSavedDraft] = useState(initialTrip?.itinerary_data ?? null);
  const [dirty, setDirty] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [busy, setBusy] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); }

  function saveTrip() {
    const updated = { ...trip, itinerary_data: draft, updated_at: new Date().toISOString() };
    setTrip(updated); onTripUpdated(updated); setDirty(false); setEditMode(false);
    setSavedDraft(draft); showToast("Changes saved");
  }

  function cancelEdit() {
    setDraft(savedDraft); setDirty(false); setEditMode(false);
  }
  function share() { navigator.clipboard.writeText(window.location.href + "?share=" + trip.share_token).then(() => showToast("Share link copied!")).catch(() => showToast("Share: " + trip.share_token)); }

  function downloadPDF() {
    const data = draft;
    if (!data) return;
    const BLOCKS = ["morning", "afternoon", "evening"];
    const BLOCK_LABEL = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

    const daysHtml = (data.days || []).map(day => {
      const blocksHtml = BLOCKS.map(block => {
        const pois = day[block] || [];
        if (!pois.length) return "";
        const poisHtml = pois.map(poi => `
          <div class="poi">
            <div class="poi-name">${poi.name || ""}</div>
            ${poi.cat || poi.category ? `<span class="badge">${poi.cat || poi.category}</span>` : ""}
            ${poi.dur || poi.duration ? `<span class="dur">${poi.dur || poi.duration}</span>` : ""}
            <div class="poi-desc">${poi.desc || poi.description || ""}</div>
            ${poi.tip || poi.tips ? `<div class="poi-tip">Tip · ${poi.tip || poi.tips}</div>` : ""}
          </div>`).join("");
        return `<div class="block"><div class="block-label">${BLOCK_LABEL[block]}</div>${poisHtml}</div>`;
      }).join("");
      return `
        <div class="day">
          <div class="day-header">
            <span class="day-num">Day ${day.day} · ${day.date}</span>
            <span class="day-theme">${day.theme}</span>
          </div>
          ${blocksHtml}
        </div>`;
    }).join("");

    const tipsHtml = (data.tips || data.general_tips || []).length > 0
      ? `<div class="tips-section"><div class="tips-title">Good to know</div><ul>${(data.tips || data.general_tips).map(t => `<li>${t}</li>`).join("")}</ul></div>`
      : "";

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${data.trip_title || trip.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito Sans', sans-serif; color: #111; background: #fff; padding: 40px; max-width: 760px; margin: 0 auto; }
  .cover { margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #E8E4DC; }
  .cover h1 { font-family: 'Lora', serif; font-size: 32px; color: #111; margin-bottom: 8px; }
  .cover-meta { display: flex; gap: 24px; font-size: 13px; color: #6B6457; flex-wrap: wrap; margin-top: 8px; }
  .cover-meta span { display: flex; align-items: center; gap: 4px; }
  .day { margin-bottom: 32px; page-break-inside: avoid; }
  .day-header { margin-bottom: 12px; }
  .day-num { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #C8B27D; }
  .day-theme { font-family: 'Lora', serif; font-size: 20px; color: #111; }
  .block { margin-bottom: 16px; padding-left: 12px; border-left: 2px solid #E8E4DC; }
  .block-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #9E9484; margin-bottom: 8px; }
  .poi { margin-bottom: 12px; }
  .poi-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
  .badge { display: inline-block; background: rgba(200,178,125,0.2); color: #111; border: 1px solid #C8B27D; border-radius: 99px; font-size: 10px; font-weight: 600; padding: 2px 8px; margin-right: 6px; }
  .dur { font-size: 11px; color: #6B6457; }
  .poi-desc { font-size: 13px; color: #444; line-height: 1.55; margin-top: 4px; }
  .poi-tip { font-size: 12px; color: #6B6457; background: #F2F0EB; border-radius: 6px; padding: 6px 10px; margin-top: 6px; }
  .tips-section { margin-top: 32px; padding: 20px; background: rgba(200,178,125,0.08); border: 1px solid rgba(200,178,125,0.3); border-radius: 10px; }
  .tips-title { font-family: 'Lora', serif; font-size: 16px; margin-bottom: 10px; }
  .tips-section ul { padding-left: 16px; }
  .tips-section li { font-size: 13px; color: #6B6457; margin-bottom: 4px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E8E4DC; font-size: 11px; color: #9E9484; text-align: center; }
  @media print {
    body { padding: 20px; }
    .day { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="cover">
    <h1>${data.trip_title || trip.title}</h1>
    <div class="cover-meta">
      <span>📍 ${trip.destination}</span>
      <span>📅 ${trip.start_date} – ${trip.end_date}</span>
      <span>👥 ${trip.pax_adults} adults${trip.pax_children ? ", " + trip.pax_children + " children" : ""}</span>
      ${trip.budget_range ? `<span>💰 ${trip.budget_range}</span>` : ""}
    </div>
  </div>
  ${daysHtml}
  ${tipsHtml}
  <div class="footer">Generated by Wandr · wandr.app</div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) { showToast("Allow popups to download PDF", "error"); return; }
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      setTimeout(() => {
        win.focus();
        win.print();
      }, 500);
    };
    showToast("PDF ready — use Save as PDF in the print dialog");
  }

  async function regen() {
    setBusy("regen");
    try {
      const n = daysBetween(trip.start_date, trip.end_date);
      const prompt = `Plan a ${n}-day trip to ${trip.destination}. Arrival: ${trip.start_date}. Departure: ${trip.end_date}. Travellers: ${trip.pax_adults} adults${trip.pax_children ? " and " + trip.pax_children + " children" : ""}. Interests: ${(trip.interests || []).join(", ") || "a bit of everything"}. Budget: ${trip.budget_range ?? "flexible"}. Give each day a distinct theme.`;
      const itinerary = await callClaude(ITINERARY_SYSTEM, prompt);
      const updated = { ...trip, itinerary_data: itinerary, updated_at: new Date().toISOString() };
      setTrip(updated); setDraft(itinerary); setDirty(false); onTripUpdated(updated); showToast("Fresh itinerary generated");
    } catch (err) { showToast(err.message || "Could not regenerate.", "error"); }
    finally { setBusy(null); }
  }

  if (busy === "regen") return <GenScreen destination={trip.destination} />;

  return (
    <Shell page="home" setPage={setPage}>
      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: toast.type === "error" ? "var(--destructive)" : "var(--fg)", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
          {toast.msg}
        </div>
      )}
      <div className="space-y-5">
        <button className="btn btn-ghost" style={{ marginLeft: -8 }} onClick={() => setPage("home")}><Icon name="arrowLeft" size={15} /> Back</button>
        <div className="card-hero p-6">
          <h1 className="font-display text-white" style={{ fontSize: 28 }}>{trip.title}</h1>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-white" style={{ opacity: 0.8 }}>
            <span className="inline-flex items-center gap-2"><Icon name="mapPin" size={14} /> {trip.destination}</span>
            <span className="inline-flex items-center gap-2"><Icon name="calendar" size={14} /> {formatRange(trip.start_date, trip.end_date)}</span>
            <span className="inline-flex items-center gap-2"><Icon name="users" size={14} /> {trip.pax_adults} adults · {trip.pax_children} children</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!editMode ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => setEditMode(true)} disabled={busy !== null}><Icon name="pencil" size={13} /> Edit</button>
              <button className="btn btn-outline btn-sm" onClick={share} disabled={busy !== null}><Icon name="share" size={13} /> Share</button>
              <button className="btn btn-outline btn-sm" onClick={downloadPDF} disabled={busy !== null}><Icon name="download" size={13} /> Download PDF</button>
              <button className="btn btn-outline btn-sm" onClick={regen} disabled={busy !== null}><Icon name="refresh" size={13} /> Regenerate</button>
            </>
          ) : (
            <>
              <button className="btn btn-amber btn-sm" onClick={saveTrip}><Icon name="save" size={13} /> Save Changes</button>
              <button className="btn btn-outline btn-sm" onClick={cancelEdit}>Cancel</button>
            </>
          )}
        </div>
        {editMode && (
          <div style={{ background: "rgba(200,178,125,0.12)", border: "1px solid rgba(200,178,125,0.35)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--muted-fg)" }}>
            ✏️ Edit mode — tap the pencil icon on any stop to make changes. Hit <strong>Save Changes</strong> when done.
          </div>
        )}
        {draft && <ItineraryDisplay data={draft} editable={editMode} onChange={next => { setDraft(next); setDirty(true); }} />}
      </div>
    </Shell>
  );
}

// Discover
function DiscoverPage({ setPage }) {
  const [category, setCategory] = useState(null);
  const [idea, setIdea] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(null);
  const posts = [
    { id: "1", title: "Hidden Cafés of Tbilisi", destination: "Tbilisi", country: "Georgia", days_count: 5, tags: ["Hidden Gems", "Food"], author: "Alex W." },
    { id: "2", title: "Slow Travel in Hoi An", destination: "Hoi An", country: "Vietnam", days_count: 7, tags: ["Culture", "Food"], author: "Maya T." },
    { id: "3", title: "Ljubljana Weekend", destination: "Ljubljana", country: "Slovenia", days_count: 3, tags: ["Popular", "Nature"], author: "Sam K." },
    { id: "4", title: "Oaxacan Food Trail", destination: "Oaxaca", country: "Mexico", days_count: 4, tags: ["Food", "Local Picks"], author: "Priya R." },
  ];
  const filtered = posts.filter(p => !category || p.tags?.includes(category));

  async function getIdea() {
    setThinking(true); setError(null);
    try { setIdea(await callClaude(INSPIRE_SYSTEM, "Suggest one underrated destination. Seed: " + Math.random().toString(36).slice(2))); }
    catch (err) { setError(err.message || "Could not find inspiration right now."); }
    finally { setThinking(false); }
  }

  return (
    <Shell page="discover" setPage={setPage}>
      <div className="space-y-6">
        <header>
          <h1 className="page-title">Discover</h1>
          <p className="text-sm text-muted">Itineraries and local tips from the Wandr community.</p>
        </header>
        <div style={{ background: "rgba(200,178,125,.1)", border: "1px solid rgba(200,178,125,.3)", borderRadius: "var(--radius)", padding: 20 }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display" style={{ fontSize: 20 }}>Inspire Me</h2>
              <p className="text-sm text-muted">One underrated destination, picked by AI.</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={getIdea} disabled={thinking}>
              {thinking ? <Icon name="loader" size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Icon name="sparkles" size={13} />} Surprise me
            </button>
          </div>
          {error && <p className="text-sm mt-2" style={{ color: "var(--destructive)" }}>{error}</p>}
          {idea && (
            <div style={{ background: "var(--card)", borderRadius: 10, padding: 16, marginTop: 16 }}>
              <p className="font-display" style={{ fontSize: 17 }}>{idea.destination}, {idea.country}</p>
              <p className="text-sm font-medium" style={{ color: "var(--accent)", marginTop: 2 }}>{idea.tagline}</p>
              <p className="text-sm text-muted mt-2" style={{ lineHeight: 1.55 }}>{idea.description}</p>
              <p className="text-xs text-muted mt-2">Best time: {idea.best_time}</p>
              <div className="flex flex-wrap gap-2 mt-3">{(idea.tags ?? []).map(t => <span key={t} className="badge">{t}</span>)}</div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setPage("plan")}><Icon name="sparkles" size={13} /> Plan This Trip</button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={"chip" + (!category ? " active" : "")} onClick={() => setCategory(null)}>All</button>
          {DISCOVER_CATEGORIES.map(c => <button key={c} className={"chip" + (category === c ? " active" : "")} onClick={() => setCategory(c)}>{c}</button>)}
        </div>
        <div className="grid-2">
          {filtered.map(post => (
            <div key={post.id} className="discover-card">
              <div className="discover-card-img" />
              <div className="discover-card-body">
                <p className="font-display" style={{ fontSize: 16 }}>{post.title}</p>
                <p className="text-sm text-muted mt-1">{post.destination} · {post.days_count} days</p>
                <div className="flex flex-wrap gap-1 mt-2">{(post.tags ?? []).map(t => <span key={t} className="badge">{t}</span>)}</div>
                <p className="text-xs text-muted mt-3">by {post.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// Profile
function ProfilePage({ profile, trips, setPage, setCurrentTrip, onLogout, onDeleteTrip }) {
  return (
    <Shell page="profile" setPage={setPage}>
      <div className="space-y-8">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="avatar">{(profile?.name ?? "W").slice(0, 1)}</div>
            <div className="min-w-0 flex-1">
              <p className="font-display truncate" style={{ fontSize: 20 }}>{profile?.name}</p>
              <p className="text-sm text-muted truncate">{profile?.email}</p>
            </div>
          </div>
        </div>
        <section className="space-y-3">
          <p className="section-title">My Itineraries</p>
          {trips.length ? trips.map(trip => (
            <div key={trip.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1" style={{ cursor: "pointer" }} onClick={() => { setCurrentTrip(trip); setPage("trip"); }}>
                  <p className="font-medium truncate">{trip.title}</p>
                  <p className="text-sm text-muted">{trip.destination} · {formatRange(trip.start_date, trip.end_date)}</p>
                </div>
                <button className="btn btn-ghost btn-icon shrink-0" onClick={() => onDeleteTrip(trip.id)}><Icon name="trash" size={14} /></button>
              </div>
            </div>
          )) : <p className="text-sm text-muted">No saved itineraries yet.</p>}
        </section>
        <button className="btn btn-outline w-full" style={{ justifyContent: "center" }} onClick={onLogout}><Icon name="logOut" size={14} /> Log out</button>
      </div>
    </Shell>
  );
}

// Root
export default function App() {
  const [screen, setScreen] = useState(() => load("screen", "welcome"));
  const [page, setPageRaw] = useState(() => load("page", "home"));
  const [trips, setTrips] = useState(() => load("trips", []));
  const [currentTrip, setCurrentTrip] = useState(null);
  const profile = { name: "Nayyom", email: "nayyom@example.com" };

  function setPage(p) { setPageRaw(p); save("page", p); if (p !== "trip") setCurrentTrip(null); }
  function onTripCreated(trip) { const u = [trip, ...trips]; setTrips(u); save("trips", u); setCurrentTrip(trip); setPageRaw("trip"); }
  function onTripUpdated(trip) { const u = trips.map(t => t.id === trip.id ? trip : t); setTrips(u); save("trips", u); }
  function onDeleteTrip(id) { const u = trips.filter(t => t.id !== id); setTrips(u); save("trips", u); }
  function onLogin() { save("screen", "app"); setScreen("app"); }
  function onLogout() { save("screen", "welcome"); setScreen("welcome"); setPageRaw("home"); }

  if (screen === "welcome") return <WelcomePage onStart={() => { save("screen", "login"); setScreen("login"); }} />;
  if (screen === "login") return <LoginPage onLogin={onLogin} />;
  if (page === "trip" && currentTrip) return <TripPage trip={currentTrip} setPage={setPage} onTripUpdated={onTripUpdated} onDeleteTrip={onDeleteTrip} />;
  if (page === "plan") return <PlanPage setPage={setPage} onTripCreated={onTripCreated} />;
  if (page === "mytrips") return <MyTripsPage trips={trips} setPage={setPage} setCurrentTrip={t => { setCurrentTrip(t); setPageRaw("trip"); }} onTripCreated={onTripCreated} />;
  if (page === "discover") return <DiscoverPage setPage={setPage} />;
  if (page === "profile") return <ProfilePage profile={profile} trips={trips} setPage={setPage} setCurrentTrip={t => { setCurrentTrip(t); setPageRaw("trip"); }} onLogout={onLogout} onDeleteTrip={onDeleteTrip} />;
  return <HomePage trips={trips} profile={profile} setPage={p => { setPageRaw(p); save("page", p); }} setCurrentTrip={t => { setCurrentTrip(t); setPageRaw("trip"); }} />;
}
