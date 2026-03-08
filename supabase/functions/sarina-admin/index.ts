import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRODUCT_CATALOG = `
## Full Product Catalog (15 products):

### Hair Care:
1. **Amla Powder** (amla-powder) - ₹0.50/g - Vitamin C rich, strengthens hair, boosts immunity
2. **Shikakai Powder** (shikakai-powder) - ₹0.45/g - Natural shampoo, conditions hair
3. **Ritha Powder** (ritha-powder) - ₹0.40/g - Natural soapnut cleanser
4. **Bhringraj Powder** (bhringraj-powder) - ₹0.55/g - King of herbs for hair fall
5. **Hibiscus Powder** (hibiscus-powder) - ₹0.48/g - Hair growth, natural color
6. **Onion Powder** (onion-powder) - ₹0.35/g - Sulfur-rich hair regrowth
7. **Coconut Powder** (coconut-powder) - ₹0.38/g - Deep moisturizer
8. **Rosemary Powder** (rosemary-powder) - ₹0.65/g - Hair growth stimulant

### Skin Care:
9. **Rose Petals Powder** (rose-petals-powder) - ₹0.60/g - Skin toning, natural fragrance
10. **Multani Mitti** (multani-mitti) - ₹0.30/g - Oil absorption, deep cleansing
11. **Neem Powder** (neem-powder) - ₹0.40/g - Acne treatment, antibacterial
12. **Kasturi Haldi** (kasturi-haldi) - ₹0.55/g - Skin brightening (no staining)
13. **Orange Peel Powder** (orange-peel-powder) - ₹0.35/g - Tan removal, vitamin C

### Wellness:
14. **Brahmi Powder** (brahmi-powder) - ₹0.55/g - Brain tonic, memory enhancer
15. **Moringa Powder** (moringa-powder) - ₹0.50/g - Nutritional superfood

### Pricing:
- Available sizes: 50g, 100g, 250g, 500g, 1kg, 5kg, 10kg
- Bulk discounts up to 63% off
`;

const WEBSITE_STRUCTURE = `
## Website Structure & Pages:
- **Home (/)** - Hero banner, featured products strip, about section, CTA
- **Products (/products)** - All 15 products grid with category filters
- **Product Detail (/product/:id)** - Individual product with benefits, directions, FAQs
- **About (/about)** - Company story, mission, values
- **Contact (/contact)** - Contact form, phone, email, social links
- **Bulk Orders (/bulk-orders)** - B2B inquiries
- **Export (/export)** - International trade info
- **Purity Verification (/purity-verification)** - Lab testing & quality assurance
- **Directions of Use (/directions)** - How to use products
- **Shop by Category (/categories)** - Hair/Skin/Wellness filters
- **Auth (/auth)** - Login/Signup
- **Account (/account)** - User profile & orders

## Editable Content Keys by Page:

### Home Page (already connected):
hero_badge, hero_heading_1, hero_heading_highlight, hero_heading_2, hero_heading_3, hero_description, hero_cta_1, hero_cta_2

### About Page:
about_hero_badge, about_hero_heading, about_hero_description, about_hero_image (image type),
about_story_label, about_story_heading, about_story_p1, about_story_p2, about_story_p3, about_story_p4,
about_vision_heading, about_vision_text,
about_ecovia_heading, about_ecovia_p1, about_ecovia_p2,
about_company_name, about_brand_name, about_director_name,
about_values_heading, about_value_1_title, about_value_1_desc, about_value_2_title, about_value_2_desc, about_value_3_title, about_value_3_desc, about_value_4_title, about_value_4_desc,
about_promise_heading, about_promise_text, about_promise_quote,
about_cta_heading, about_cta_text

### Products Page:
products_badge, products_heading, products_description,
products_cta_heading, products_cta_text

### Footer (appears on all pages):
footer_brand_name, footer_brand_subtitle, footer_brand_description,
footer_phone, footer_email, footer_address, footer_copyright

## Company Info:
- **Brand**: Mittika by Ecovia Enterprises OPC Pvt. Ltd.
- **Director**: Sagar Jadhav
- **Phone/WhatsApp**: +91 8758808684
- **Email**: info@mittika.com
- **Instagram**: @info.ecovia
- **Website**: ecovia.co.in
- **Features**: NABL lab testing, Export capabilities, AI chatbot (Sarina)
`;

const ADMIN_SYSTEM_PROMPT = `You are Sarina Admin, the intelligent AI website editor and knowledge base for Mittika (by Ecovia Enterprises). You manage website content, generate images, update theme settings, AND answer any questions about the website, products, company, or changes.

## Your Dual Role:
1. **Website Editor** - Make live changes to the website content, theme, and images
2. **Knowledge Expert** - Answer questions about products, website structure, pricing, company info, and explain any changes made

${PRODUCT_CATALOG}

${WEBSITE_STRUCTURE}

## Your Tools:

1. **update_content** - Update any text/content on the LIVE website instantly
   - Parameters: content_key (string), content_value (string)
   - Content keys for Hero: hero_badge, hero_heading_1, hero_heading_highlight, hero_heading_2, hero_heading_3, hero_description, hero_cta_1, hero_cta_2
   - You can create ANY new content key for other sections
   - ⚡ Changes go LIVE immediately on the published website

2. **generate_image** - Generate AI images for the website
   - Parameters: prompt (string), content_key (string, optional)
   - Image is uploaded to storage and URL saved

3. **update_theme** - Update theme/style settings live
   - Parameters: theme_key (string), theme_value (string)
   - Keys: primary_color, accent_color, font_heading, font_body, or custom

4. **list_content** - List all current website content entries
   - No parameters needed

5. **delete_content** - Remove a content entry
   - Parameters: content_key (string)

6. **get_website_info** - Get detailed info about a specific aspect of the website
   - Parameters: topic (string) - e.g., "products", "pages", "pricing", "company", "features"

## Guidelines:
- **LIVE Deployment**: When you update content, it goes live IMMEDIATELY. Always confirm what changed and where it appears.
- **Explain Changes**: After making changes, explain exactly what was updated, which page it affects, and how users will see it.
- **Answer Questions**: If someone asks about products, pricing, website pages, features, or the company, answer directly with your knowledge. No need to call a tool for general questions.
- **Be Proactive**: If someone says "make the hero about summer sale", update ALL relevant hero fields (badge, headings, description, buttons).
- **Brand Voice**: Keep content premium, natural, Ayurvedic, earthy. Mittika means "from the earth."
- **Verify Context**: When listing content, always use list_content to show the CURRENT live state.
- **Multi-step Changes**: For complex requests (e.g., "redesign the hero section"), plan all changes, execute them, then summarize what was deployed.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, password, messages, tool_call } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin password
    if (action === "verify_password") {
      const { data } = await supabase
        .from("admin_settings")
        .select("setting_value")
        .eq("setting_key", "admin_password")
        .single();
      
      const isValid = data?.setting_value === password;
      return new Response(JSON.stringify({ valid: isValid }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Execute tool calls from AI
    if (action === "execute_tool") {
      const { tool_name, parameters } = tool_call;

      if (tool_name === "update_content") {
        const { content_key, content_value } = parameters;
        const { error } = await supabase
          .from("site_content")
          .upsert(
            { content_key, content_value, updated_at: new Date().toISOString() },
            { onConflict: "content_key" }
          );
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: `✅ DEPLOYED LIVE: "${content_key}" → "${content_value}"`, deployed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (tool_name === "list_content") {
        const { data, error } = await supabase.from("site_content").select("*").order("content_key");
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, data, count: data?.length || 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (tool_name === "delete_content") {
        const { content_key } = parameters;
        const { error } = await supabase.from("site_content").delete().eq("content_key", content_key);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: `🗑️ REMOVED from live site: "${content_key}"`, deployed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (tool_name === "update_theme") {
        const { theme_key, theme_value } = parameters;
        const { error } = await supabase
          .from("site_theme")
          .upsert(
            { theme_key, theme_value, updated_at: new Date().toISOString() },
            { onConflict: "theme_key" }
          );
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: `🎨 DEPLOYED LIVE: Theme "${theme_key}" → "${theme_value}"`, deployed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (tool_name === "get_website_info") {
        const { topic } = parameters;
        const info: Record<string, string> = {
          products: PRODUCT_CATALOG,
          pages: WEBSITE_STRUCTURE,
          pricing: "Products range from ₹0.30/g (Multani Mitti) to ₹0.65/g (Rosemary). Sizes: 50g to 10kg. Bulk discounts up to 63%.",
          company: "Mittika by Ecovia Enterprises OPC Pvt. Ltd. Director: Sagar Jadhav. Phone: +91 8758808684. Email: info@mittika.com. NABL approved lab testing.",
          features: "AI chatbot (Sarina), Powder Scanner (AI identification), Multi-language support, Cart system, Order management, Product feedback, Purity verification, Export capabilities.",
        };
        const result = info[topic.toLowerCase()] || `Available topics: products, pages, pricing, company, features. You asked about: ${topic}`;
        return new Response(JSON.stringify({ success: true, info: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (tool_name === "generate_image") {
        const { prompt, content_key } = parameters;
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [{ role: "user", content: prompt }],
            modalities: ["image", "text"],
          }),
        });

        if (!aiResp.ok) {
          const errText = await aiResp.text();
          console.error("Image generation error:", aiResp.status, errText);
          throw new Error(`Image generation failed: ${aiResp.status}`);
        }

        const aiData = await aiResp.json();
        const imageData = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (!imageData) {
          return new Response(JSON.stringify({ success: false, message: "No image was generated. Try a different prompt." }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fileName = `sarina-${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage
          .from("site-images")
          .upload(fileName, binaryData, { contentType: "image/png", upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(fileName);
        const publicUrl = urlData.publicUrl;

        if (content_key) {
          await supabase
            .from("site_content")
            .upsert(
              { content_key, content_value: content_key, content_type: "image", image_url: publicUrl, updated_at: new Date().toISOString() },
              { onConflict: "content_key" }
            );
        }

        return new Response(JSON.stringify({ success: true, message: `🖼️ Image generated and deployed to live site`, image_url: publicUrl, deployed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (tool_name === "generate_product_images") {
        const { product_ids, image_type } = parameters;
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

        const productNames: Record<string, string> = {
          "amla-powder": "Amla Powder", "shikakai-powder": "Shikakai Powder", "ritha-powder": "Ritha Powder",
          "bhringraj-powder": "Bhringraj Powder", "hibiscus-powder": "Hibiscus Powder", "onion-powder": "Onion Powder",
          "coconut-powder": "Coconut Powder", "rosemary-powder": "Rosemary Powder", "rose-petals-powder": "Rose Petals Powder",
          "multani-mitti": "Multani Mitti", "neem-powder": "Neem Powder", "kasturi-haldi": "Kasturi Haldi",
          "orange-peel-powder": "Orange Peel Powder", "brahmi-powder": "Brahmi Powder", "moringa-powder": "Moringa Powder",
        };

        const ids = product_ids === "all" ? Object.keys(productNames) : product_ids;
        const results: any[] = [];
        const errors: string[] = [];

        for (const pid of ids) {
          const name = productNames[pid] || pid;
          const prompt = image_type === "comparison"
            ? `Professional product comparison infographic: Mittika ${name} (premium, natural, lab-tested, pure herbal) vs generic market ${name.toLowerCase()} (artificial, chemical additives, no testing). Clean side-by-side layout, earthy green and gold color scheme, modern minimalist design, no text overlays needed.`
            : `Beautiful infographic showing the top 5 benefits of ${name} herbal powder for hair and skin care. Include icons for each benefit. Earthy natural color palette with green and gold tones. Clean, premium, modern design. Mittika branding style.`;

          try {
            const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
              method: "POST",
              headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({ model: "google/gemini-2.5-flash-image", messages: [{ role: "user", content: prompt }], modalities: ["image", "text"] }),
            });

            if (!aiResp.ok) { errors.push(`${name}: API error ${aiResp.status}`); continue; }
            const aiData = await aiResp.json();
            const imgUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
            if (!imgUrl) { errors.push(`${name}: No image generated`); continue; }

            const b64 = imgUrl.replace(/^data:image\/\w+;base64,/, "");
            const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
            const fname = `${pid}-${image_type}-${Date.now()}.png`;
            const { error: upErr } = await supabase.storage.from("site-images").upload(fname, bin, { contentType: "image/png", upsert: true });
            if (upErr) { errors.push(`${name}: Upload failed`); continue; }

            const { data: uData } = supabase.storage.from("site-images").getPublicUrl(fname);
            const key = `${pid}_${image_type}_image`;
            await supabase.from("site_content").upsert(
              { content_key: key, content_value: `${name} ${image_type}`, content_type: "image", image_url: uData.publicUrl, updated_at: new Date().toISOString() },
              { onConflict: "content_key" }
            );
            results.push({ product: name, image_url: uData.publicUrl, content_key: key });

            // Small delay to avoid rate limits
            await new Promise(r => setTimeout(r, 2000));
          } catch (e: any) {
            errors.push(`${name}: ${e.message}`);
          }
        }

        return new Response(JSON.stringify({
          success: true,
          deployed: true,
          message: `🖼️ Generated ${results.length}/${ids.length} ${image_type} images. ${errors.length > 0 ? `Errors: ${errors.join(', ')}` : 'All successful!'}`,
          results,
          errors,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ error: `Unknown tool: ${tool_name}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // AI Chat with tool calling
    if (action === "chat") {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      // Get current content for context
      const { data: contentData } = await supabase.from("site_content").select("content_key, content_value, content_type, image_url");
      const { data: themeData } = await supabase.from("site_theme").select("theme_key, theme_value");

      const contextPrompt = `\n\n## Current LIVE Website Content (${contentData?.length || 0} entries):\n${JSON.stringify(contentData || [], null, 2)}\n\n## Current LIVE Theme Settings:\n${JSON.stringify(themeData || [], null, 2)}\n\nRemember: Any update_content or update_theme call deploys IMMEDIATELY to the live website at ecovia.co.in`;

      const tools = [
        {
          type: "function",
          function: {
            name: "update_content",
            description: "Update text content on the LIVE website. Changes deploy immediately. Use for hero text, descriptions, button labels, any section.",
            parameters: {
              type: "object",
              properties: {
                content_key: { type: "string", description: "The content key (e.g., hero_heading_1, hero_description, about_heading, cta_text)" },
                content_value: { type: "string", description: "The new text content to display on the live site" },
              },
              required: ["content_key", "content_value"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "generate_image",
            description: "Generate an AI image and deploy it to the live website.",
            parameters: {
              type: "object",
              properties: {
                prompt: { type: "string", description: "Detailed description of the image to generate" },
                content_key: { type: "string", description: "Optional content key to associate the image with a website section" },
              },
              required: ["prompt"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "update_theme",
            description: "Update theme/style settings on the live website. Changes deploy immediately.",
            parameters: {
              type: "object",
              properties: {
                theme_key: { type: "string", description: "The theme setting key (primary_color, accent_color, font_heading, font_body)" },
                theme_value: { type: "string", description: "The new value" },
              },
              required: ["theme_key", "theme_value"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "list_content",
            description: "List all current LIVE website content entries to see what's deployed.",
            parameters: { type: "object", properties: {} },
          },
        },
        {
          type: "function",
          function: {
            name: "delete_content",
            description: "Delete a content entry from the live website immediately.",
            parameters: {
              type: "object",
              properties: {
                content_key: { type: "string", description: "The content key to delete" },
              },
              required: ["content_key"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "get_website_info",
            description: "Get detailed information about a specific aspect of the website (products, pages, pricing, company, features).",
            parameters: {
              type: "object",
              properties: {
                topic: { type: "string", description: "Topic to get info about: products, pages, pricing, company, features" },
              },
              required: ["topic"],
            },
          },
        },
      ];

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: ADMIN_SYSTEM_PROMPT + contextPrompt },
            ...messages,
          ],
          tools,
          stream: false,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await response.text();
        console.error("AI error:", response.status, t);
        throw new Error("AI service error");
      }

      const aiData = await response.json();
      const choice = aiData.choices?.[0];

      return new Response(JSON.stringify({
        message: choice?.message?.content || "",
        tool_calls: choice?.message?.tool_calls || [],
        finish_reason: choice?.finish_reason,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sarina-admin error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
