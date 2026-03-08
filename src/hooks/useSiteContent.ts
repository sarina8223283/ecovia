import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteContent {
  content_key: string;
  content_value: string;
  content_type: string;
  image_url: string | null;
}

export const useSiteContent = () => {
  return useQuery({
    queryKey: ['site-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content_key, content_value, content_type, image_url');
      
      if (error) throw error;
      
      const contentMap: Record<string, SiteContent> = {};
      (data || []).forEach((item: any) => {
        contentMap[item.content_key] = item;
      });
      return contentMap;
    },
    staleTime: 30_000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

export const getContent = (
  contentMap: Record<string, SiteContent> | undefined,
  key: string,
  fallback: string
): string => {
  return contentMap?.[key]?.content_value || fallback;
};
