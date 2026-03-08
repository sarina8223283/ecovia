
-- Site content table for CMS-managed content
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text UNIQUE NOT NULL,
  content_value text NOT NULL DEFAULT '',
  content_type text NOT NULL DEFAULT 'text',
  image_url text,
  metadata jsonb DEFAULT '{}',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Site theme settings
CREATE TABLE public.site_theme (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_key text UNIQUE NOT NULL,
  theme_value text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Admin password table (hashed)
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_theme ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Public read for site_content and site_theme
CREATE POLICY "Anyone can read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Anyone can read site theme" ON public.site_theme FOR SELECT USING (true);

-- Only edge functions (service role) can write - no direct client writes
-- Admin settings: no public access at all (only via edge function service role)

-- Storage bucket for Sarina-uploaded images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- Allow public read on site-images bucket
CREATE POLICY "Public read site images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');

-- Seed default content
INSERT INTO public.site_content (content_key, content_value, content_type) VALUES
  ('hero_badge', '100% Pure & Natural', 'text'),
  ('hero_heading_1', 'Experience the', 'text'),
  ('hero_heading_highlight', 'Luxury', 'text'),
  ('hero_heading_2', 'of', 'text'),
  ('hero_heading_3', 'Earthly Purity', 'text'),
  ('hero_description', 'Mittika brings you authentic, chemical-free herbal powders rooted in ancient Ayurvedic traditions. Elevate your wellness journey naturally.', 'text'),
  ('hero_cta_1', 'Explore Products', 'text'),
  ('hero_cta_2', 'Our Story', 'text');

-- Seed default admin password (SHA-256 of 'sarina2024')
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
  ('admin_password', 'sarina2024');
