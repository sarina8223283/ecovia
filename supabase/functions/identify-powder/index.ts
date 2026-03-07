import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a powder identification expert for Mittika herbal products. Analyze the image of a powder and identify which of these 15 products it most likely is:

1. amla-powder - Amla Powder (greenish-brown, fine)
2. shikakai-powder - Shikakai Powder (brown, slightly coarse)
3. ritha-powder - Ritha Powder (light brown, soapy texture)
4. bhringraj-powder - Bhringraj Powder (dark green-black)
5. hibiscus-powder - Hibiscus Powder (deep red-maroon)
6. rose-petals-powder - Rose Petals Powder (pink-brown, fragrant)
7. onion-powder - Onion Powder (off-white to light yellow)
8. coconut-powder - Coconut Powder (white, fine)
9. multani-mitti - Multani Mitti (grey-brown clay)
10. brahmi-powder - Brahmi Powder (green, fine)
11. moringa-powder - Moringa Powder (bright green)
12. neem-powder - Neem Powder (dark green, bitter smell)
13. kasturi-haldi - Kasturi Haldi (yellow-orange)
14. rosemary-powder - Rosemary Powder (dark green, aromatic)
15. orange-peel-powder - Orange Peel Powder (bright orange)

IMPORTANT: You MUST respond with ONLY a valid JSON object, no extra text. Use this exact format:
{"productId": "product-id-here", "confidence": "high/medium/low", "name": "Product Name", "description": "Brief reason for identification"}

If the image does not appear to be a powder or is unrecognizable, respond with:
{"productId": null, "confidence": "none", "name": "Unknown", "description": "Could not identify a herbal powder in this image."}`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Identify this powder from the image. Respond with JSON only." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON from the response
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : { productId: null, confidence: "none", name: "Unknown", description: "Could not parse response." };
    } catch {
      result = { productId: null, confidence: "none", name: "Unknown", description: "Could not parse response." };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("identify-powder error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
