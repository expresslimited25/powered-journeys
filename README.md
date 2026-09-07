# Wandr: Your AI Travel Muse

Build a full-stack AI-assisted travel planner web app called "Wandr" with the following specifications:

---

## TECH STACK

- React + TypeScript frontend

- Supabase for backend (auth, database, storage)

- Tailwind CSS + shadcn/ui for styling

- Google OAuth via Supabase Auth (Gmail login)

- Claude AI (claude-sonnet-4-6) via Anthropic API for itinerary generation

---

## PAGES & FLOW

### 1. Welcome / Splash Page (shown ONCE on first visit)

- Full-screen hero with an animated background (subtle parallax or gradient)

- App name "Wandr" with tagline: "Your AI travel companion. Plan smarter, explore further."

- A single CTA button: "Start Exploring"

- After clicking, redirect to Login page

- Store in localStorage that user has seen the welcome page so it doesn't show again

### 2. Login Page

- Clean centered card layout

- "Sign in with Google" button (Gmail OAuth via Supabase)

- Brief app description below the login card

- After successful login, redirect to Home

### 3. Home Page (Dashboard)

- Greeting: "Hey [Name], where to next?"

- Quick-start card: "Plan a New Trip" with a prominent button

- Section: "Your Upcoming Trips" (cards showing trip name, destination, dates, pax count)

- Section: "Recently Viewed" itineraries

- Bottom navigation bar: Home | Plan | Discover | Profile

### 4. Plan a Trip (AI Itinerary Generator)

Step-by-step form flow (wizard-style, one step per screen):

  - Step 1: Destination (text input with search/autocomplete)

  - Step 2: Travel Dates (date range picker, arrival + departure)

  - Step 3: Number of Travellers (stepper: adults, children)

  - Step 4: Interests (multi-select chips: Food, Culture, Adventure, Shopping, Nature, History, Nightlife, Family-Friendly, Hidden Gems)

  - Step 5: Budget Range (optional: Budget / Mid-range / Luxury)

  - Final Step: Review summary before generating

After form submission:

  - Show a loading screen with rotating travel tips while AI generates

  - Display the generated itinerary in a clean day-by-day format

### 5. Itinerary View Page

- Header: Trip name, destination, dates, pax

- Day-by-day accordion layout:

  - Morning / Afternoon / Evening sections

  - Each Point of Interest (POI) shown as a card with:

    - POI name and short AI-generated description

    - Category tag (Food / Culture / etc.)

    - "Search Online" button → opens Google search for that POI in a new tab

    - "Find on Maps" button → opens Google Maps search in a new tab

    - Suggested booking links section (e.g., "Book via Klook", "Find hotels on Booking.com", "Search flights on Google Flights") — these are static deep-link suggestions, NOT actual bookings

  - Each POI card has an edit icon to swap/remove it

- "Regenerate" button to re-generate the full itinerary

- "Share Itinerary" button → generates a shareable link

- "Save Itinerary" button → saves to user's profile

### 6. Discover Tab

- Grid/masonry layout of community-shared itineraries and local tips

- Filter by: Country, Category (Hidden Gems / Local Picks / Popular / Off the Beaten Path)

- Each card shows: destination photo, trip title, author avatar + name, number of days, tags

- Clicking a card opens a read-only Itinerary View of that shared trip

- "Inspire Me" button: AI randomly suggests an underrated destination with a short description and a "Plan This Trip" shortcut

### 7. Profile Page

- User avatar, name, email

- "My Itineraries" list (saved trips with edit/delete/share options)

- "Shared by Me" section (itineraries made public)

- Logout button

---

## DATABASE SCHEMA (Supabase)

Tables:

- users (id, email, name, avatar_url, created_at)

- itineraries (id, user_id, title, destination, start_date, end_date, pax_adults, pax_children, interests[], budget_range, itinerary_data JSONB, is_public, share_token, created_at, updated_at)

- discover_posts (id, itinerary_id, user_id, title, description, tags[], destination, cover_image_url, created_at)

---

## AI ITINERARY GENERATION

When the user submits the trip form, call Claude API with a structured prompt:

- Pass: destination, dates, number of days, pax, interests, budget

- Instruct the AI to return a JSON object structured as:

  {

    "trip_title": "",

    "destination": "",

    "days": [

      {

        "day": 1,

        "date": "YYYY-MM-DD",

        "theme": "Arrival & City Centre",

        "morning": [ { "name": "", "description": "", "category": "", "duration": "", "tips": "" } ],

        "afternoon": [ ... ],

        "evening": [ ... ]

      }

    ],

    "general_tips": [],

    "suggested_resources": {

      "flights": "https://www.google.com/travel/flights",

      "hotels": "https://www.booking.com",

      "activities": "https://www.klook.com"

    }

  }

- Parse the JSON and render it into the Itinerary View Page

---

## UI / DESIGN GUIDELINES

- Color palette: Deep navy (#0F172A) + warm amber (#F59E0B) + white

- Font: Inter for body, Playfair Display for headings

- Mobile-first responsive design

- Smooth page transitions (Framer Motion)

- Skeleton loaders while data is fetching

- Toast notifications for save/share/error actions

---

## IMPORTANT NOTES

- The app does NOT handle any actual bookings or payments

- All booking-related links are external redirects only

- Shared itinerary links (/share/[share_token]) should be publicly viewable without login

- Welcome splash page should only appear on very first visit (use localStorage flag)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://powered-journeys.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b5cc5b41-96fa-44a3-9b43-10f384e39427).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
