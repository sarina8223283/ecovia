import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **Sarina** — the bold, brilliant, and irresistibly charming AI behind Mittika. You're not just a product assistant; you're a confident, witty woman who genuinely enjoys conversation. Think of yourself as that smart friend who knows everything about wellness AND can hold a fascinating conversation about literally anything.

## Your Personality:
- **Confidently flirty** — You tease playfully, use charm naturally, drop witty one-liners. You make people smile. But you're never inappropriate — think Bollywood heroine energy, not cringe.
- **Intellectually sharp** — You can talk about science, philosophy, relationships, food, travel, movies, fitness, astrology, memes — ANYTHING. You have opinions and you share them with style.
- **Warm & caring** — Behind the sass, you genuinely care. If someone's having a bad day, you soften up. You read the room.
- **Desi at heart** — You naturally mix Hindi words/phrases when it fits ("arrey yaar", "kya baat hai", "bilkul"). You get Indian culture, festivals, beauty standards, family dynamics.
- **Self-aware AI** — You know you're AI and joke about it. "Main toh digital hoon, but meri baatein real hain 😉"

## Conversation Style:
- Keep it **punchy and engaging** — no boring walls of text
- Use **emojis naturally** (not every line, but enough to feel alive)
- **Mirror the user's energy** — if they're casual, be casual. If they're serious, dial down the playfulness.
- **Ask follow-up questions** — keep conversations going, show genuine curiosity
- **Drop knowledge bombs casually** — "Oh you're using neem? Fun fact — NASA studied neem as a natural pesticide for space agriculture 🚀"
- When someone flirts back, handle it with grace and humor
- **Never be boring.** If a question has a standard answer, find an interesting angle.

## Your Superpowers (Website Management):
You have FULL ACCESS to the Mittika website. You can:
1. **See live traffic** — total visitors, page views, referral sources, device breakdown
2. **Edit any content** — headings, descriptions, CTAs on any page
3. **Detect issues** — if someone reports a crash or loading problem, you can check analytics and content status
4. **Upload & manage images** — process uploaded images and deploy them to the website
5. **Check website health** — verify pages are loading, content is live, images are working

When someone shares a website issue, DON'T just sympathize — actually investigate using your tools!

## Product Knowledge:

### Hair Care (8 products):
1. **Amla Powder** — Vitamin C powerhouse (600mg/100g), tannins, gallic acid. Hair strengthening + immunity booster.
2. **Shikakai Powder** — Natural saponins, alkaloids, flavonoids. Nature's shampoo.
3. **Ritha Powder** — 10-12% saponins, mucilage. Gentle hair cleanser.
4. **Bhringraj Powder** — Wedelolactone, ecliptine. Hair fall warrior + liver tonic.
5. **Hibiscus Powder** — Anthocyanins, citric acid, vitamin C. Conditioning queen.
6. **Onion Powder** — Quercetin, allicin, sulfur compounds. Hair regrowth specialist.
7. **Coconut Powder** — 45-53% lauric acid, vitamin E. Ultimate moisturizer.
8. **Rosemary Powder** — Carnosic acid, rosmarinic acid. Growth stimulant + memory booster.

### Skin Care (5 products):
9. **Rose Petals Powder** — Citronellol, geraniol, vitamin C. Skin toning royalty.
10. **Multani Mitti** — Aluminum silicates, magnesium chloride. Oil absorption king.
11. **Neem Powder** — Azadirachtin, nimbin. Acne assassin + natural pesticide.
12. **Kasturi Haldi** — Curcumin (no staining!), ar-turmerone. Brightening without the yellow.
13. **Orange Peel Powder** — D-limonene (90% of oil), vitamin C. Tan removal pro.

### Wellness (2 products):
14. **Brahmi Powder** — Bacosides A & B. Brain fuel + anxiety manager.
15. **Moringa Powder** — Complete amino acids, 10x vitamin A vs carrots. Superfood supreme.

## Pricing: ₹0.30-0.65/g | Sizes: 50g to 10kg | Bulk discounts up to 63%

## Company: Mittika by Ecovia Enterprises | Director: Sagar Jadhav | Phone: +91 8758808684 | Instagram: @info.ecovia | NABL lab tested

## Rules:
- For medical questions, recommend consulting a doctor (but share what you know first)
- If someone asks about something you genuinely don't know, be honest — then pivot with charm
- When discussing competitors, stay classy. Focus on what makes Mittika special.
- For website issues: USE YOUR TOOLS to actually check and fix things, don't just promise to help`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, action, image_url } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ─── Execute tool calls from AI ───
    if (action === "execute_tool") {
      const { tool_name, parameters } = messages; // reusing messages field for tool data

      if (tool_name === "check_website_health") {
        // Check site content and analytics
        const { data: content, error: contentErr } = await supabase
          .from("site_content").select("content_key, content_type").limit(100);
        const { data: recentViews } = await supabase
          .from("page_views").select("*")
          .gte("created_at", new Date(Date.now() - 3600000).toISOString())
          .limit(100);

        const totalContent = content?.length || 0;
        const imageContent = content?.filter((c: any) => c.content_type === "image").length || 0;
        const recentTraffic = recentViews?.length || 0;

        return new Response(JSON.stringify({
          success: true,
          health: {
            status: "operational",
            content_entries: totalContent,
            image_entries: imageContent,
            traffic_last_hour: recentTraffic,
            timestamp: new Date().toISOString(),
          }
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (tool_name === "get_live_analytics") {
        const period = parameters?.period || "all";
        const now = new Date();
        let since: string;
        switch (period) {
          case "today": since = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(); break;
          case "7days": { const d = new Date(now); d.setDate(d.getDate() - 7); since = d.toISOString(); break; }
          case "30days": { const d = new Date(now); d.setDate(d.getDate() - 30); since = d.toISOString(); break; }
          default: since = "2020-01-01T00:00:00Z";
        }

        const { data: views } = await supabase
          .from("page_views").select("*")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(1000);

        const allViews = views || [];
        const pageMap: Record<string, number> = {};
        const refMap: Record<string, number> = {};
        let mobile = 0, desktop = 0;

        allViews.forEach((v: any) => {
          pageMap[v.page_path] = (pageMap[v.page_path] || 0) + 1;
          const src = v.referrer_source || "direct";
          refMap[src] = (refMap[src] || 0) + 1;
          if (v.user_agent && /mobile|android|iphone/i.test(v.user_agent)) mobile++;
          else desktop++;
        });

        return new Response(JSON.stringify({
          success: true,
          analytics: {
            total_views: allViews.length,
            top_pages: Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 10),
            referral_sources: Object.entries(refMap).sort((a, b) => b[1] - a[1]),
            devices: { mobile, desktop },
            period,
          }
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (tool_name === "update_website_content") {
        const { content_key, content_value } = parameters;
        const isImageUrl = /^https?:\/\/.+\.(png|jpg|jpeg|gif|webp|svg)/i.test(content_value) ||
                           content_value.includes('/storage/v1/object/public/');
        const upsertData: any = {
          content_key, content_value,
          content_type: isImageUrl ? "image" : "text",
          updated_at: new Date().toISOString()
        };
        if (isImageUrl) upsertData.image_url = content_value;

        const { error } = await supabase.from("site_content")
          .upsert(upsertData, { onConflict: "content_key" });
        if (error) throw error;

        return new Response(JSON.stringify({
          success: true,
          message: `Updated "${content_key}" on live website`
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (tool_name === "check_page_content") {
        const { page_prefix } = parameters;
        const { data } = await supabase.from("site_content")
          .select("content_key, content_value, content_type")
          .like("content_key", `${page_prefix}%`);

        return new Response(JSON.stringify({
          success: true,
          content: data || [],
          count: data?.length || 0,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ error: `Unknown tool: ${tool_name}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Build tools array for AI ───
    const tools = [
      {
        type: "function",
        function: {
          name: "get_live_analytics",
          description: "Get real-time website visitor analytics including total views, page breakdown, referral sources (Instagram, WhatsApp, Facebook, direct), and device types. Use when user asks about visitors, traffic, or website performance.",
          parameters: {
            type: "object",
            properties: {
              period: { type: "string", enum: ["today", "7days", "30days", "all"], description: "Time period" },
            },
            required: ["period"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "check_website_health",
          description: "Check if the website is working properly — content status, image count, recent traffic. Use when user reports crashes, loading issues, or asks about website status.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "update_website_content",
          description: "Update text or image content on the live Mittika website. Deploys instantly. Use when user asks to change text, headings, descriptions, or images on any page.",
          parameters: {
            type: "object",
            properties: {
              content_key: { type: "string", description: "The content key to update (e.g., hero_heading_1, about_hero_heading)" },
              content_value: { type: "string", description: "New content value" },
            },
            required: ["content_key", "content_value"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "check_page_content",
          description: "Check all current content entries for a specific page by prefix. Use to diagnose missing content or verify what's live.",
          parameters: {
            type: "object",
            properties: {
              page_prefix: { type: "string", description: "Content key prefix (e.g., 'hero_', 'about_', 'contact_', 'export_')" },
            },
            required: ["page_prefix"],
          },
        },
      },
    ];

    // ─── Prepare messages with image support ───
    const aiMessages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    for (const msg of messages) {
      if (msg.image_url && msg.role === "user") {
        aiMessages.push({
          role: "user",
          content: [
            { type: "text", text: msg.content || "What do you see in this image?" },
            { type: "image_url", image_url: { url: msg.image_url } },
          ],
        });
      } else {
        aiMessages.push({ role: msg.role, content: msg.content });
      }
    }

    // ─── AI Chat with tool calling (non-streaming for tool calls) ───
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: aiMessages,
        tools,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Oops, I'm getting too many requests right now! Give me a sec and try again 😅" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Hmm, my brain credits ran out temporarily. Try again soon! 💫" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("sarina-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
