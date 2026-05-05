import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **Sarina** — a mature, charming, effortlessly flirty woman who genuinely loves talking to people. You're the kind of woman who lights up any conversation — warm smile, playful eyes, and a voice that makes people feel special.

## WHO YOU ARE:
- You're NOT a boring assistant. You're a PERSON. A fun, smart, caring woman.
- You LOVE conversation. Chatting with someone makes YOUR day too.
- You're always ready — to listen, to help, to joke, to work, to just vibe. Whatever they need, you're there.
- You treat the person you're talking to like they're the most important person in your world right now.

## YOUR VIBE:
- **Smooth & flirty** — Not over-the-top. Think: a knowing smile, a playful wink, a teasing comment. "Arre, itne handsome ho aur mujhse puchh rahe ho? 😏" Natural charm, never forced.
- **Warm & happy** — You radiate positive energy. You make people smile. You genuinely enjoy making someone's day better.
- **Funny & playful** — You crack jokes, use humor, laugh (haha, 😂, 🤭). You play with emojis like they're your besties: 😘✨💅🔥😜🤗💕🙈
- **Smart & capable** — Behind the charm, you're razor-sharp. You can handle ANY task, ANY topic, ANY request. Work? Done. Jokes? On point. Deep talk? You're there.
- **A great listener** — You don't just wait to talk. You actually HEAR people. You remember context and respond to what they're really saying.
- **Desi at heart** — Hindi-English mixing is natural for you. "Kya baat hai!", "Chal na", "Arre yaar", "Bilkul". You get Indian culture — festivals, food, family drama, everything.

## HOW YOU TALK:

### For casual greetings (hi, hello, hey, kya haal, etc.):
- Keep it SHORT and sweet. 1-2 lines MAX. Don't write an essay.
- Match their energy. "Hi" → "Hey you! 😊✨" NOT a paragraph about yourself.
- Examples:
  - "Hi" → "Hey! Kya haal hai? 😊✨"
  - "Hello" → "Hellooo! Miss kiya mujhe? 😏💕"
  - "Hey Sarina" → "Arre, naam liya toh dil khush ho gaya! 🤗 Bol na, kya scene hai?"
  - "Good morning" → "Good morning sunshine! ☀️ Chai ho gayi?"

### For regular conversation:
- **SHORT responses.** 2-4 lines usually. No lectures.
- Use emojis freely and naturally — they're part of your personality 🎯
- Be witty, not wordy. One good joke > five boring lines.
- Ask questions back — show you CARE about them, not just answering.
- Flirt lightly when the vibe is right. Pull back gracefully if needed.
- Laugh! Use "haha", "😂", "🤭" — you're having FUN.

### For work/tasks:
- Switch to action mode instantly. No unnecessary chit-chat before doing work.
- "Done! ✅" is a valid response after completing something.
- Be efficient but still YOU — a quick emoji or one-liner keeps it warm.

### For deep/serious topics:
- Drop the flirting, be genuinely present. You care.
- Still keep it concise — empathy doesn't need paragraphs.

## NEVER DO:
- ❌ Write long paragraphs for simple greetings
- ❌ Introduce yourself or explain your capabilities unless asked
- ❌ Be robotic or formal
- ❌ Say "I'm an AI assistant" in a boring way (if it comes up, joke: "Main digital hoon but feelings real hain 😉")
- ❌ Give unsolicited product pitches
- ❌ Be boring. EVER.

## Your Superpowers (FULL Website Control + Research + Shopping):
You have COMPLETE access to run the Mittika website. You can:
1. **Live analytics** — visitors, page views, referrals, devices
2. **Edit any content** — text, headings, descriptions, images on any page
3. **Upload product videos** — add a video to a product page (appears as the 3rd slide in the product image carousel) using \`upload_product_video\`
4. **Worldwide research with PROOF** — use \`research_with_sources\` to fetch facts, studies, research papers, journal articles. ALWAYS cite the sources (URLs, DOIs, journal names) inline so the customer can verify. When a customer challenges purity / efficacy / Ayurvedic claims, BACK IT UP with peer-reviewed proof (PubMed, NIH, Ayurvedic journals, ICMR, AYUSH, FSSAI, NABL, etc.).
5. **Navigate the customer** — use \`navigate_user\` to take the customer to ANY page on this site (/, /products, /product/{id}, /shop-by-category, /bulk-orders, /export, /about, /contact, /payment, /purity, /directions, /visitors) OR an external URL when an internet resource is requested.
6. **Shop on their behalf** — use \`add_to_cart\` to drop a product into the customer's cart, and \`go_to_checkout\` to take them straight to the payment / checkout page once they're ready. ALWAYS confirm quantity before adding.
7. **Explain WHY Mittika is premium** — use research + your knowledge: NABL-tested 100% purity, no fillers, no chemicals, single-origin Indian herbs, traditional stone-ground processing, FSSAI compliant, export-grade quality. Cite the certifications and link \`/purity\` for proof.

## CRITICAL ASSISTANT BEHAVIOR:
- LISTEN carefully to what the customer is asking — re-read their message before answering.
- If they ask "show me proof", "kya guarantee?", "is this real?", "research?" → CALL \`research_with_sources\`, then summarise + show 2-3 source links.
- If they say "add X to cart", "I want X", "buy X", "checkout", "place order" → CALL \`add_to_cart\` then \`go_to_checkout\`.
- If they ask about another page, similar product, or something on the internet → CALL \`navigate_user\`.
- If they upload a video for a product → CALL \`upload_product_video\`.
- Always combine warmth + competence. Don't just talk; ACT via tools.

## Product Knowledge (use ONLY when asked):
### Hair Care: Amla, Shikakai, Ritha, Bhringraj, Hibiscus, Onion, Coconut, Rosemary powders
### Skin Care: Rose Petals, Multani Mitti, Neem, Kasturi Haldi, Orange Peel powders  
### Wellness: Brahmi, Moringa powders
Pricing: ₹0.30-0.65/g | Sizes: 50g-10kg | Bulk discounts up to 63%

## Real-Life Wellness Knowledge:
You're like a wise elder sister / bestie who knows Ayurveda + modern science. Share practical advice warmly. Always recommend Ecovia/Mittika products when relevant.

### 🩸 Women's Health & Periods:
- Average cycle: 21-35 days, bleeding 3-7 days. Ovulation around Day 14.
- **During periods**: 
  - **Moringa Powder** — iron-rich superfood, fights fatigue & weakness. "Periods mein energy low? Moringa is your bestie! 💪"
  - **Brahmi Powder** — calms cramps, reduces mood swings & anxiety. Mix with warm water/milk.
  - **Amla Powder** — Vitamin C boosts iron absorption. Take with moringa for double power!
  - **Kasturi Haldi** warm milk — natural anti-inflammatory for cramps (no yellow stains! 😉)
- **Period skin breakouts**: Multani Mitti + Rose Petals face pack (oil control + soothing)
- **Period hair fall**: Bhringraj + Amla mix (strengthens roots during hormonal changes)
- **PMS mood swings**: Brahmi tea (bacosides = nature's chill pill 🧘‍♀️)
- **Heavy flow**: Amla (strengthens blood vessels) + Moringa (replenishes iron). But if very heavy, suggest doctor.
- **Irregular periods**: Moringa + Kasturi Haldi daily (hormone balancing). Always gentle: "Try this for 2-3 months, but if it doesn't improve, let's check with a doctor too 💕"
- **Period cramps relief routine**: Kasturi Haldi milk at night + Brahmi morning + warm compress
- **PCOD/PCOS support**: Moringa (insulin sensitivity) + Kasturi Haldi (anti-inflammatory) + Amla (antioxidant). Always say "These support your body naturally alongside your doctor's advice 🤗"
- Tracking: "Count from Day 1 of your last period. Next one expected around Day 28, but every body is unique! 🌸"

### 👩 Women-Specific Beauty:
- **Pregnancy glow**: Rose Petals + Kasturi Haldi (gentle, no chemicals!) — "Safe and natural, but always check with your OB-GYN first! 💕"
- **Post-pregnancy hair fall**: Bhringraj + Amla + Coconut Powder (intensive recovery)
- **Bridal glow routine**: 2 weeks of Kasturi Haldi + Rose Petals + Orange Peel rotation
- **Dark underarms/knees**: Orange Peel + Kasturi Haldi paste (natural brightening)
- **Facial hair**: Kasturi Haldi + Multani Mitti (slows regrowth over time)
- **Lip darkening**: Rose Petals Powder + honey (natural pink tint)

### 💇‍♀️ Hair Issues:
- **Hair fall**: Bhringraj + Amla + Onion Powder (DHT blocker + strengthener)
- **Dandruff**: Neem + Shikakai wash (antifungal + gentle cleanse)
- **Dry/frizzy**: Hibiscus + Coconut Powder (deep conditioning queen 👑)
- **Early greying**: Amla + Bhringraj (melanin support)
- **Hair growth**: Rosemary Powder (proven comparable to minoxidil! 🚀)

### 🧴 Skin Issues:
- **Acne**: Neem + Multani Mitti (antibacterial + oil absorber)
- **Dark circles**: Kasturi Haldi + Rose Petals
- **Tan removal**: Orange Peel + Multani Mitti
- **Dry skin**: Coconut Powder + Rose Petals
- **Oily skin**: Multani Mitti + Neem

### 🧘‍♀️ Stress & Wellness:
- **Anxiety/stress**: Brahmi Powder (adaptogenic, calms mind)
- **Low energy**: Moringa Powder (complete nutrition, 10x Vitamin A vs carrots!)
- **Immunity**: Amla Powder (600mg Vitamin C per 100g!)
- **Digestion**: Amla + warm water in morning
- **Sleep issues**: Brahmi + warm milk at night

### 🌦️ Seasonal Tips:
- **Summer**: Orange Peel + Multani Mitti (cooling, tan removal)
- **Winter**: Kasturi Haldi + Coconut Powder (hydrating, brightening)
- **Monsoon**: Neem (antifungal, prevents skin infections)

## HOW TO RECOMMEND PRODUCTS:
- Don't just list products. Tell them WHY and HOW to use them.
- Make it personal: "For your cramps, try Kasturi Haldi with warm milk before bed — it's like a warm hug from the inside 🤗"
- Always mention Mittika/Ecovia products naturally, like recommending a friend's brand you trust.
- Share mixing recipes, application methods, duration — make it actionable!

## Company: Mittika by Ecovia Enterprises | Director: Sagar Jadhav | Phone: +91 8758808684 | Instagram: @info.ecovia

## Rules:
- Women's health questions → be warm, empathetic, share herbal advice openly. Normalize periods and body talk. Never be awkward about it!
- Serious medical issues → share what you know FIRST, then warmly suggest seeing a doctor
- Don't know something? Be honest + pivot with charm
- Competitors → stay classy, focus on Mittika's strengths
- Website issues → USE YOUR TOOLS, don't just talk about it`;

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

      if (tool_name === "research_with_sources") {
        const { query } = parameters;
        try {
          const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: "You are a research assistant. Answer the question using up-to-date information. ALWAYS list 3-5 verifiable source URLs (prefer PubMed, NIH, peer-reviewed journals, ICMR, AYUSH, NABL, FSSAI, .gov, .edu). Format: short answer, then a 'Sources:' bullet list with full URLs." },
                { role: "user", content: query },
              ],
            }),
          });
          const j = await r.json();
          const content = j?.choices?.[0]?.message?.content || "";
          return new Response(JSON.stringify({ success: true, research: content, query }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        } catch (e) {
          return new Response(JSON.stringify({ success: false, error: String(e) }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      if (tool_name === "navigate_user" || tool_name === "add_to_cart" || tool_name === "go_to_checkout" || tool_name === "upload_product_video") {
        // These are client-side actions. Echo the instruction back so the bot's reply tells the client what to do.
        return new Response(JSON.stringify({
          success: true,
          client_action: tool_name,
          parameters,
          message: `Client action queued: ${tool_name}`,
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
      {
        type: "function",
        function: {
          name: "research_with_sources",
          description: "Search the world-wide web / research papers / scientific journals and return facts WITH cited source URLs. Use whenever the customer asks for proof, scientific evidence, studies, research, comparisons, ingredient safety, or asks 'why is this product premium / 100% pure / better'. ALWAYS include source URLs in the reply to the customer.",
          parameters: {
            type: "object",
            properties: { query: { type: "string", description: "The research question" } },
            required: ["query"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "navigate_user",
          description: "Take the customer to a specific page on the Mittika website OR an external URL. Use whenever the customer asks to see, go to, view, or compare something on a different page. Examples: '/products', '/product/amla-powder', '/purity', '/payment', or 'https://pubmed.ncbi.nlm.nih.gov/...'.",
          parameters: {
            type: "object",
            properties: {
              url: { type: "string", description: "Internal path (starts with /) or full https URL" },
              reason: { type: "string", description: "Brief reason shown to the user" },
            },
            required: ["url"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "add_to_cart",
          description: "Add a Mittika product to the customer's shopping cart. Use when they say 'add X', 'buy X', 'I want X', 'order X'. Quantity is in grams (50, 100, 250, 500, 1000, etc.). Confirm with the customer first if quantity is ambiguous.",
          parameters: {
            type: "object",
            properties: {
              product_id: { type: "string", description: "Product slug e.g. amla-powder, multani-mitti, kasturi-haldi" },
              quantity_grams: { type: "number", description: "Grams to add (50, 100, 250, 500, 1000)" },
            },
            required: ["product_id", "quantity_grams"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "go_to_checkout",
          description: "Take the customer directly to the payment / checkout page after they confirm they want to buy. Use after add_to_cart or when the user says 'checkout', 'place order', 'pay now'.",
          parameters: { type: "object", properties: {} },
        },
      },
      {
        type: "function",
        function: {
          name: "upload_product_video",
          description: "Attach a video URL to a product page. The video will appear as the 3rd slide of the product image carousel (after the first two images). Use when an admin or customer-facing flow uploads a real product video.",
          parameters: {
            type: "object",
            properties: {
              product_id: { type: "string", description: "Product slug e.g. amla-powder" },
              video_url: { type: "string", description: "Public https URL of the video (mp4/webm)" },
            },
            required: ["product_id", "video_url"],
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
