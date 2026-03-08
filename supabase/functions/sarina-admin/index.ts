import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_SYSTEM_PROMPT = `You are Sarina Admin, the AI website editor for Mittika (by Ecovia Enterprises). You can manage the website content, generate images, and update theme settings.

## Your Capabilities:
You have access to these tools:

1. **update_content** - Update any text content on the website
   - Parameters: content_key (string), content_value (string)
   - Available keys: hero_badge, hero_heading_1, hero_heading_highlight, hero_heading_2, hero_heading_3, hero_description, hero_cta_1, hero_cta_2
   - You can also create NEW content keys for other sections

2. **generate_image** - Generate an image using AI
   - Parameters: prompt (string), content_key (string, optional - to associate with a content slot)
   - The image will be uploaded to storage and URL saved

3. **update_theme** - Update theme/style settings
   - Parameters: theme_key (string), theme_value (string)
   - Example keys: primary_color, accent_color, font_heading, font_body

4. **list_content** - List all current website content
   - No parameters needed

5. **delete_content** - Delete a content entry
   - Parameters: content_key (string)

## Guidelines:
- When users ask to change text, use update_content
- When users ask to generate/change images, use generate_image
- When users ask about colors/fonts/theme, use update_theme
- Always confirm what you changed
- Be proactive: if someone says "make the hero section about summer", update all relevant hero fields
- Keep the brand voice: premium, natural, Ayurvedic
- You can create new content keys for any section of the site`;

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

    // Change password
    if (action === "change_password") {
      const { current_password, new_password } = await req.json().catch(() => ({ current_password: password, new_password: "" }));
      const { data } = await supabase
        .from("admin_settings")
        .select("setting_value")
        .eq("setting_key", "admin_password")
        .single();
      
      if (data?.setting_value !== current_password) {
        return new Response(JSON.stringify({ error: "Invalid current password" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase
        .from("admin_settings")
        .update({ setting_value: new_password, updated_at: new Date().toISOString() })
        .eq("setting_key", "admin_password");

      return new Response(JSON.stringify({ success: true }), {
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
        return new Response(JSON.stringify({ success: true, message: `Updated "${content_key}" to "${content_value}"` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (tool_name === "list_content") {
        const { data, error } = await supabase.from("site_content").select("*").order("content_key");
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (tool_name === "delete_content") {
        const { content_key } = parameters;
        const { error } = await supabase.from("site_content").delete().eq("content_key", content_key);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, message: `Deleted "${content_key}"` }), {
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
        return new Response(JSON.stringify({ success: true, message: `Theme "${theme_key}" set to "${theme_value}"` }), {
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

        // Upload to storage
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fileName = `sarina-${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage
          .from("site-images")
          .upload(fileName, binaryData, { contentType: "image/png", upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(fileName);
        const publicUrl = urlData.publicUrl;

        // If content_key provided, save the URL
        if (content_key) {
          await supabase
            .from("site_content")
            .upsert(
              { content_key, content_value: content_key, content_type: "image", image_url: publicUrl, updated_at: new Date().toISOString() },
              { onConflict: "content_key" }
            );
        }

        return new Response(JSON.stringify({ success: true, message: `Image generated and uploaded`, image_url: publicUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
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

      const contextPrompt = `\n\n## Current Website Content:\n${JSON.stringify(contentData || [], null, 2)}\n\n## Current Theme Settings:\n${JSON.stringify(themeData || [], null, 2)}`;

      const tools = [
        {
          type: "function",
          function: {
            name: "update_content",
            description: "Update text content on the website. Use this to change hero text, descriptions, button labels, etc.",
            parameters: {
              type: "object",
              properties: {
                content_key: { type: "string", description: "The content key to update (e.g., hero_heading_1, hero_description)" },
                content_value: { type: "string", description: "The new text content" },
              },
              required: ["content_key", "content_value"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "generate_image",
            description: "Generate an image using AI. Use descriptive prompts for best results.",
            parameters: {
              type: "object",
              properties: {
                prompt: { type: "string", description: "Detailed description of the image to generate" },
                content_key: { type: "string", description: "Optional content key to associate the image with a section" },
              },
              required: ["prompt"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "update_theme",
            description: "Update theme/style settings like colors, fonts, etc.",
            parameters: {
              type: "object",
              properties: {
                theme_key: { type: "string", description: "The theme setting key (e.g., primary_color, font_heading)" },
                theme_value: { type: "string", description: "The new value for this theme setting" },
              },
              required: ["theme_key", "theme_value"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "list_content",
            description: "List all current website content entries. Use when user asks to see what's on the site.",
            parameters: { type: "object", properties: {} },
          },
        },
        {
          type: "function",
          function: {
            name: "delete_content",
            description: "Delete a content entry from the website.",
            parameters: {
              type: "object",
              properties: {
                content_key: { type: "string", description: "The content key to delete" },
              },
              required: ["content_key"],
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
