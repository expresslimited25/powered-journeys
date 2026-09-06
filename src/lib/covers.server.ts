const IMAGE_GATEWAY = "https://ai.gateway.lovable.dev/v1/images/generations";
const IMAGE_MODEL = "google/gemini-3.1-flash-image";

export function destinationSlug(destination: string) {
  return (
    destination
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "destination"
  );
}

export function coverPublicUrl(slug: string) {
  return `/api/public/covers/${slug}.png`;
}

async function generateCoverPng(destination: string): Promise<Uint8Array> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this project.");

  const res = await fetch(IMAGE_GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      messages: [
        {
          role: "user",
          content: `Dreamy editorial travel photograph of ${destination} at golden hour — iconic scenery, warm muted tones, deep ink shadows with soft gold light. Wide landscape orientation. No text, no watermark, no people posing at the camera.`,
        },
      ],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) throw new Error(`Cover generation failed (${res.status}).`);
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("Cover generation returned no image.");
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

/**
 * Returns the cached cover URL for a destination, generating and storing one
 * on first use. Never throws for missing config — callers should still treat
 * failures as non-fatal and continue without a cover.
 */
export async function ensureDestinationCover(destination: string): Promise<string> {
  const slug = destinationSlug(destination);
  const url = coverPublicUrl(slug);

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: existing } = await supabaseAdmin
    .from("destination_covers")
    .select("image_url")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) return existing.image_url ?? url;

  const png = await generateCoverPng(destination);
  const { error: uploadError } = await supabaseAdmin.storage
    .from("covers")
    .upload(`${slug}.png`, png, { contentType: "image/png", upsert: true });
  if (uploadError) throw new Error(`Cover upload failed: ${uploadError.message}`);

  const { error: insertError } = await supabaseAdmin
    .from("destination_covers")
    .upsert({ slug, destination, image_url: url });
  if (insertError) console.error("Failed to record destination cover:", insertError.message);

  return url;
}
