import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const detectReferrerSource = (referrer: string): string => {
  if (!referrer) return 'direct';
  const r = referrer.toLowerCase();
  if (r.includes('instagram.com') || r.includes('ig.me')) return 'instagram';
  if (r.includes('facebook.com') || r.includes('fb.me') || r.includes('fb.com')) return 'facebook';
  if (r.includes('whatsapp.com') || r.includes('wa.me')) return 'whatsapp';
  if (r.includes('threads.net')) return 'threads';
  if (r.includes('linkedin.com') || r.includes('lnkd.in')) return 'linkedin';
  if (r.includes('twitter.com') || r.includes('t.co') || r.includes('x.com')) return 'twitter';
  if (r.includes('google.com') || r.includes('google.co.in')) return 'google';
  if (r.includes('bing.com')) return 'bing';
  if (r.includes('youtube.com') || r.includes('youtu.be')) return 'youtube';
  return 'other';
};

const usePageAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Also check URL params for utm_source
    const params = new URLSearchParams(location.search);
    const utmSource = params.get('utm_source');
    const referrer = document.referrer;
    
    let source = utmSource || detectReferrerSource(referrer);

    supabase.from('page_views').insert({
      page_path: location.pathname,
      referrer: referrer || null,
      referrer_source: source,
      user_agent: navigator.userAgent,
    }).then(() => {});
  }, [location.pathname]);
};

export default usePageAnalytics;
