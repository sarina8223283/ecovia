import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface SiteContent {
  content_key: string;
  content_value: string;
  content_type: string;
  image_url: string | null;
}

export const useSiteContent = () => {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes for instant updates
  useEffect(() => {
    const channel = supabase
      .channel('site-content-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_content' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['site-content'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
    staleTime: 5_000, // 5 seconds for faster updates
    refetchOnWindowFocus: true,
  });
};

export const getContent = (
  contentMap: Record<string, SiteContent> | undefined,
  key: string,
  fallback: string
): string => {
  return contentMap && key in contentMap ? (contentMap[key]?.content_value ?? '') : fallback;
};
