DELETE FROM site_content WHERE content_key = 'orange-peel-powder_hero_image';
DELETE FROM site_content WHERE content_key = 'orange-peel-powder_banner_image';
UPDATE site_content SET content_type = 'image', image_url = content_value WHERE content_key = 'orange-peel-powder_mid_page_banner' AND content_value LIKE 'https://%';