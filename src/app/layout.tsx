export const metadata = {
  title: "Wandr — Your AI Travel Companion",
  description: "Plan smarter, explore further. AI-built itineraries for wherever you're headed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
