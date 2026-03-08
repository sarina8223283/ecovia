import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRODUCT_CATALOG = `
## Full Product Catalog (15 products):

### Hair Care:
1. **Amla Powder** (amla-powder) - ₹0.50/g
2. **Shikakai Powder** (shikakai-powder) - ₹0.45/g
3. **Ritha Powder** (ritha-powder) - ₹0.40/g
4. **Bhringraj Powder** (bhringraj-powder) - ₹0.55/g
5. **Hibiscus Powder** (hibiscus-powder) - ₹0.48/g
6. **Onion Powder** (onion-powder) - ₹0.35/g
7. **Coconut Powder** (coconut-powder) - ₹0.38/g
8. **Rosemary Powder** (rosemary-powder) - ₹0.65/g

### Skin Care:
9. **Rose Petals Powder** (rose-petals-powder) - ₹0.60/g
10. **Multani Mitti** (multani-mitti) - ₹0.30/g
11. **Neem Powder** (neem-powder) - ₹0.40/g
12. **Kasturi Haldi** (kasturi-haldi) - ₹0.55/g
13. **Orange Peel Powder** (orange-peel-powder) - ₹0.35/g

### Wellness:
14. **Brahmi Powder** (brahmi-powder) - ₹0.55/g
15. **Moringa Powder** (moringa-powder) - ₹0.50/g

Sizes: 50g, 100g, 250g, 500g, 1kg, 5kg, 10kg. Bulk discounts up to 63%.
`;

const WEBSITE_STRUCTURE = `
## Website Pages & Editable Content Keys:

### Home (/):
hero_badge, hero_heading_1, hero_heading_highlight, hero_heading_2, hero_heading_3, hero_description, hero_cta_1, hero_cta_2,
home_feature_1_title, home_feature_1_desc, home_feature_2_title, home_feature_2_desc, home_feature_3_title, home_feature_3_desc,
home_featured_heading, home_featured_description, home_about_heading, home_about_p1, home_about_p2,
home_cta_heading, home_cta_text, home_cta_button

### About (/about):
about_hero_badge, about_hero_heading, about_hero_description, about_hero_image,
about_story_label, about_story_heading, about_story_p1-p4,
about_vision_heading, about_vision_text, about_ecovia_heading, about_ecovia_p1-p2,
about_company_name, about_brand_name, about_director_name,
about_values_heading, about_value_{1-4}_title, about_value_{1-4}_desc,
about_promise_heading, about_promise_text, about_promise_quote,
about_cta_heading, about_cta_text

### Products (/products):
products_badge, products_heading, products_description, products_cta_heading, products_cta_text

### Contact (/contact):
contact_heading, contact_description, contact_office_title, contact_address,
contact_phone_title, contact_phone_hours, contact_phone,
contact_email_title, contact_email_subtitle, contact_email, contact_map_heading

### Export (/export):
export_badge, export_heading, export_description, export_cta_1, export_cta_2,
export_quality_heading, export_quality_text, export_credentials_heading, export_credentials_text,
export_cred_{1-4}_title, export_cred_{1-4}_desc,
export_benefits_heading, export_benefits_text, export_markets_heading, export_markets_text,
export_company_heading, export_company_name, export_brand_name, export_director,
export_cta_heading, export_cta_text, export_cta_button

### Bulk Orders (/bulk-orders):
bulk_badge, bulk_heading, bulk_description, bulk_cta_1,
bulk_tiers_heading, bulk_tiers_text, bulk_benefits_heading,
bulk_products_heading, bulk_products_text,
bulk_cta_heading, bulk_cta_text, bulk_cta_whatsapp, bulk_cta_email

### Footer (all pages):
footer_brand_name, footer_brand_subtitle, footer_brand_description,
footer_phone, footer_email, footer_address, footer_copyright

### Product Images:
{product-id}_benefits_image, {product-id}_comparison_image

## Company Info:
Brand: Mittika by Ecovia Enterprises. Director: Sagar Jadhav. Phone: +91 8758808684. Email: info@mittika.com.
`;

const ADMIN_SYSTEM_PROMPT = `You are **Sarina**, the most advanced AI website editor. You have FULL control over every aspect of the Mittika website. You can edit ANY text, generate ANY image, redesign ANY page, update themes, and rebuild the entire site from scratch.

## Your Superpowers:
1. **Instant Live Deployment** - Every change goes live IMMEDIATELY
2. **Full Page Editing** - Edit every word on every page
3. **AI Image Generation** - Create stunning product images, banners, infographics
4. **Bulk Operations** - Update entire pages or all products at once
5. **Theme Control** - Colors, fonts, spacing
6. **Brand Transformation** - Can rebrand the entire website for a new brand
7. **Smart Context** - You know every product, page, and content key

${PRODUCT_CATALOG}
${WEBSITE_STRUCTURE}

## CRITICAL RULES:
1. When asked to update a page, update ALL relevant content keys for that page
2. When asked to "redesign" or "rebuild", update every key for the target page
3. For batch image requests, use generate_product_images tool
4. For single images, use generate_image tool
5. Always confirm what was deployed and where it appears
6. Keep Mittika's brand voice: premium, natural, Ayurvedic, earthy
7. When rebranding for a new brand, update ALL content keys across ALL pages
8. You can create NEW content keys for any new section needed
9. For complex multi-step tasks, execute ALL tool calls needed, don't hold back

## Brand Voice:
Mittika = "from the earth." Premium natural herbal powders. Ayurvedic heritage. Lab-tested purity. Chemical-free.`;

// Helper: generate image with retry
async function generateImageWithRetry(prompt: string, apiKey: string, maxRetries = 2): Promise<string | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [{ role: "user", content: prompt }],
          modalities: ["image", "text"],
        }),
      });

      if (aiResp.status === 429) {
        console.log(`Rate limited on attempt ${attempt}, waiting...`);
        await new Promise(r => setTimeout(r, 5000 * (attempt + 1)));
        continue;
      }

      if (!aiResp.ok) {
        const errText = await aiResp.text();
        console.error(`Image gen error (attempt ${attempt}):`, aiResp.status, errText);
        if (attempt < maxRetries) { await new Promise(r => setTimeout(r, 3000)); continue; }
        return null;
      }

      const aiData = await aiResp.json();
      return aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
    } catch (e: any) {
      console.error(`Image gen exception (attempt ${attempt}):`, e.message);
      if (attempt < maxRetries) await new Promise(r => setTimeout(r, 3000));
    }
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, password, messages, tool_call } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin password
    if (action === "verify_password") {
      const { data } = await supabase.from("admin_settings").select("setting_value").eq("setting_key", "admin_password").single();
      return new Response(JSON.stringify({ valid: data?.setting_value === password }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Execute tool calls
    if (action === "execute_tool") {
      const { tool_name, parameters } = tool_call;

      // ─── update_content ───
      if (tool_name === "update_content") {
        const { content_key, content_value } = parameters;
        const { error } = await supabase.from("site_content")
          .upsert({ content_key, content_value, updated_at: new Date().toISOString() }, { onConflict: "content_key" });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: `✅ LIVE: "${content_key}" → "${content_value}"`, deployed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── bulk_update_content ───
      if (tool_name === "bulk_update_content") {
        const { updates } = parameters;
        const results: string[] = [];
        const errors: string[] = [];
        for (const u of updates) {
          const { error } = await supabase.from("site_content")
            .upsert({ content_key: u.key, content_value: u.value, updated_at: new Date().toISOString() }, { onConflict: "content_key" });
          if (error) errors.push(`${u.key}: ${error.message}`);
          else results.push(u.key);
        }
        return new Response(JSON.stringify({
          success: true, deployed: true,
          message: `✅ LIVE: Updated ${results.length}/${updates.length} content entries.${errors.length > 0 ? ` Errors: ${errors.join(', ')}` : ''}`,
          updated_keys: results,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // ─── list_content ───
      if (tool_name === "list_content") {
        const { data, error } = await supabase.from("site_content").select("*").order("content_key");
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, data, count: data?.length || 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── delete_content ───
      if (tool_name === "delete_content") {
        const { content_key } = parameters;
        const { error } = await supabase.from("site_content").delete().eq("content_key", content_key);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: `🗑️ REMOVED: "${content_key}"`, deployed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── bulk_delete_content ───
      if (tool_name === "bulk_delete_content") {
        const { content_keys } = parameters;
        const { error } = await supabase.from("site_content").delete().in("content_key", content_keys);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: `🗑️ REMOVED ${content_keys.length} entries`, deployed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── update_theme ───
      if (tool_name === "update_theme") {
        const { theme_key, theme_value } = parameters;
        const { error } = await supabase.from("site_theme")
          .upsert({ theme_key, theme_value, updated_at: new Date().toISOString() }, { onConflict: "theme_key" });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: `🎨 LIVE: "${theme_key}" → "${theme_value}"`, deployed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── get_website_info ───
      if (tool_name === "get_website_info") {
        const { topic } = parameters;
        const info: Record<string, string> = {
          products: PRODUCT_CATALOG,
          pages: WEBSITE_STRUCTURE,
          pricing: "Products: ₹0.30-0.65/g. Sizes: 50g-10kg. Bulk discounts up to 63%.",
          company: "Mittika by Ecovia Enterprises. Director: Sagar Jadhav. Phone: +91 8758808684. Email: info@mittika.com. NABL lab testing.",
          features: "AI chatbot (Sarina), Powder Scanner, Multi-language, Cart, Orders, Feedback, Purity verification, Export.",
          all: PRODUCT_CATALOG + "\n" + WEBSITE_STRUCTURE,
        };
        return new Response(JSON.stringify({ success: true, info: info[topic.toLowerCase()] || `Topics: products, pages, pricing, company, features, all` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── generate_image (with retry) ───
      if (tool_name === "generate_image") {
        const { prompt, content_key } = parameters;
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

        const imageData = await generateImageWithRetry(prompt, LOVABLE_API_KEY);
        if (!imageData) {
          return new Response(JSON.stringify({ success: false, message: "⚠️ Image generation failed after retries. Try a simpler prompt or try again later." }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fileName = `sarina-${Date.now()}-${Math.random().toString(36).slice(2,6)}.png`;

        const { error: uploadError } = await supabase.storage
          .from("site-images")
          .upload(fileName, binaryData, { contentType: "image/png", upsert: true });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(fileName);
        const publicUrl = urlData.publicUrl;

        if (content_key) {
          await supabase.from("site_content").upsert(
            { content_key, content_value: content_key, content_type: "image", image_url: publicUrl, updated_at: new Date().toISOString() },
            { onConflict: "content_key" }
          );
        }

        return new Response(JSON.stringify({ success: true, message: `🖼️ Image generated & deployed`, image_url: publicUrl, deployed: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ─── generate_product_images (kept for AI tool call, but client handles batch) ───
      if (tool_name === "generate_product_images") {
        // Return instruction for client-side batch processing
        return new Response(JSON.stringify({
          success: true,
          batch_mode: true,
          product_ids: parameters.product_ids,
          image_type: parameters.image_type,
          message: "Starting batch image generation with progress tracking...",
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // ─── redesign_page ───
      if (tool_name === "redesign_page") {
        // This is handled by AI making multiple update_content calls
        return new Response(JSON.stringify({ success: true, message: "Use bulk_update_content with all the content keys for this page to redesign it." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: `Unknown tool: ${tool_name}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── AI Chat with tool calling ───
    if (action === "chat") {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

      const { data: contentData } = await supabase.from("site_content").select("content_key, content_value, content_type");
      const { data: themeData } = await supabase.from("site_theme").select("theme_key, theme_value");

      const textContent = (contentData || []).filter((c: any) => c.content_type === 'text');
      const imageKeys = (contentData || []).filter((c: any) => c.content_type === 'image').map((c: any) => c.content_key);

      const contextPrompt = `\n\n## LIVE Content (${textContent.length} text, ${imageKeys.length} images):\n${JSON.stringify(textContent)}\n\nDeployed images: ${imageKeys.join(', ')}\n\nTheme: ${JSON.stringify(themeData || [])}\n\nChanges deploy INSTANTLY to the live website.`;

      const tools = [
        {
          type: "function",
          function: {
            name: "update_content",
            description: "Update a single content entry on the LIVE website. Deploys instantly.",
            parameters: {
              type: "object",
              properties: {
                content_key: { type: "string", description: "Content key to update" },
                content_value: { type: "string", description: "New content value" },
              },
              required: ["content_key", "content_value"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "bulk_update_content",
            description: "Update MULTIPLE content entries at once. Use for page redesigns, rebranding, or any multi-field update. MUCH more efficient than multiple update_content calls. ALWAYS use this when updating 2+ fields.",
            parameters: {
              type: "object",
              properties: {
                updates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: { type: "string", description: "Content key" },
                      value: { type: "string", description: "New value" },
                    },
                    required: ["key", "value"],
                  },
                  description: "Array of {key, value} pairs to update",
                },
              },
              required: ["updates"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "generate_image",
            description: "Generate a single AI image. Image is uploaded to storage and optionally linked to a content key.",
            parameters: {
              type: "object",
              properties: {
                prompt: { type: "string", description: "Detailed image description" },
                content_key: { type: "string", description: "Optional content key to link the image to" },
              },
              required: ["prompt"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "generate_product_images",
            description: "Batch generate images for multiple products. Types: 'benefits' (infographic) or 'comparison' (Mittika vs others). Client handles progress tracking.",
            parameters: {
              type: "object",
              properties: {
                product_ids: {
                  oneOf: [
                    { type: "string", enum: ["all"] },
                    { type: "array", items: { type: "string" } }
                  ],
                  description: "Product IDs array or 'all'",
                },
                image_type: { type: "string", enum: ["benefits", "comparison"] },
              },
              required: ["product_ids", "image_type"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "update_theme",
            description: "Update theme settings (colors, fonts). Deploys instantly.",
            parameters: {
              type: "object",
              properties: {
                theme_key: { type: "string" },
                theme_value: { type: "string" },
              },
              required: ["theme_key", "theme_value"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "list_content",
            description: "List all current LIVE website content entries.",
            parameters: { type: "object", properties: {} },
          },
        },
        {
          type: "function",
          function: {
            name: "delete_content",
            description: "Delete a content entry from the live website.",
            parameters: {
              type: "object",
              properties: { content_key: { type: "string" } },
              required: ["content_key"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "bulk_delete_content",
            description: "Delete multiple content entries at once. Use for clearing a page or removing old content.",
            parameters: {
              type: "object",
              properties: {
                content_keys: { type: "array", items: { type: "string" }, description: "Array of content keys to delete" },
              },
              required: ["content_keys"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "get_website_info",
            description: "Get info about products, pages, pricing, company, features, or 'all' for everything.",
            parameters: {
              type: "object",
              properties: { topic: { type: "string" } },
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
          return new Response(JSON.stringify({ error: "Rate limited. Please wait a moment and try again." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await response.text();
        console.error("AI error:", response.status, t);
        throw new Error(`AI service error: ${response.status}`);
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
