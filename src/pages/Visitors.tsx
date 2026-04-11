import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, TrendingUp, Building2, BarChart3, Globe2, Share2, Lock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_PASSWORD = '7524';

const stateData = [
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'], highlight: 'Headquarters & Primary Market', icon: Building2, visitors: '35%' },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'], highlight: 'Key Distribution Hub', icon: TrendingUp, visitors: '18%' },
  { state: 'Rajasthan', cities: ['Jaipur', 'Udaipur', 'Jodhpur', 'Ajmer'], highlight: 'Growing Market', icon: TrendingUp, visitors: '12%' },
  { state: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli'], highlight: 'South India Hub', icon: MapPin, visitors: '10%' },
  { state: 'Delhi NCR', cities: ['New Delhi', 'Gurgaon', 'Noida', 'Faridabad'], highlight: 'North India Hub', icon: Building2, visitors: '8%' },
  { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai'], highlight: 'Emerging Market', icon: TrendingUp, visitors: '5%' },
  { state: 'Uttar Pradesh', cities: ['Lucknow', 'Varanasi', 'Kanpur'], highlight: 'Expanding Reach', icon: MapPin, visitors: '4%' },
  { state: 'Kerala', cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode'], highlight: 'Ayurveda Hub', icon: MapPin, visitors: '4%' },
  { state: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Jabalpur'], highlight: 'Central India', icon: MapPin, visitors: '2%' },
  { state: 'West Bengal', cities: ['Kolkata', 'Siliguri', 'Durgapur'], highlight: 'East India', icon: MapPin, visitors: '2%' },
];

interface PageStat {
  page_path: string;
  count: number;
}

interface SourceStat {
  referrer_source: string;
  count: number;
}

const sourceLabels: Record<string, string> = {
  direct: 'Direct',
  google: 'Google',
  instagram: 'Instagram',
  facebook: 'Facebook',
  whatsapp: 'WhatsApp',
  threads: 'Threads',
  linkedin: 'LinkedIn',
  twitter: 'Twitter/X',
  youtube: 'YouTube',
  bing: 'Bing',
  other: 'Other',
};

const sourceColors: Record<string, string> = {
  direct: 'bg-primary/20 text-primary',
  google: 'bg-blue-100 text-blue-700',
  instagram: 'bg-pink-100 text-pink-700',
  facebook: 'bg-blue-100 text-blue-800',
  whatsapp: 'bg-green-100 text-green-700',
  threads: 'bg-gray-100 text-gray-700',
  linkedin: 'bg-sky-100 text-sky-700',
  twitter: 'bg-slate-100 text-slate-700',
  youtube: 'bg-red-100 text-red-700',
  bing: 'bg-teal-100 text-teal-700',
  other: 'bg-muted text-muted-foreground',
};

const Visitors = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [pageStats, setPageStats] = useState<PageStat[]>([]);
  const [sourceStats, setSourceStats] = useState<SourceStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { count } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true });
        setTotalViews(count || 0);

        const { data: allViews } = await supabase
          .from('page_views')
          .select('page_path, referrer_source');

        if (allViews) {
          const pageMap: Record<string, number> = {};
          const srcMap: Record<string, number> = {};
          allViews.forEach((v: any) => {
            pageMap[v.page_path] = (pageMap[v.page_path] || 0) + 1;
            const src = v.referrer_source || 'direct';
            srcMap[src] = (srcMap[src] || 0) + 1;
          });

          setPageStats(
            Object.entries(pageMap)
              .map(([page_path, count]) => ({ page_path, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
          );
          setSourceStats(
            Object.entries(srcMap)
              .map(([referrer_source, count]) => ({ referrer_source, count }))
              .sort((a, b) => b.count - a.count)
          );
        }
      } catch (e) {
        console.error('Analytics fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleAdminLogin = () => {
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordDialog(false);
      setPasswordInput('');
    } else {
      alert('Incorrect password');
    }
  };

  const pageNameMap: Record<string, string> = {
    '/': 'Home',
    '/products': 'Products',
    '/about': 'About Us',
    '/contact': 'Contact',
    '/bulk-orders': 'Bulk Orders',
    '/export': 'Export',
    '/shop-by-category': 'Shop by Category',
    '/purity': 'Purity Verification',
    '/directions': 'Directions of Use',
    '/visitors': 'Visitors',
    '/auth': 'Sign In',
    '/account': 'Account',
  };

  return (
    <Layout>
      <Helmet>
        <title>Visitors & Distribution | Mittika by Ecovia</title>
        <meta name="description" content="Explore Mittika's presence across India. State-wise distribution and visitor insights for our natural herbal products." />
      </Helmet>

      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          >
            <Users size={16} />
            Our Reach Across India
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            Visitors & Distribution
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            See how many people trust Mittika's natural Ayurvedic products across India.
          </motion.p>
        </div>
      </section>

      {/* Public: Total Visitor Count */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-5xl sm:text-6xl font-bold mb-2">
              {loading ? '...' : totalViews.toLocaleString()}
            </p>
            <p className="text-lg text-primary-foreground/80">Total Visitors</p>
          </motion.div>

          {!isAdmin && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowPasswordDialog(true)}
              className="mt-6 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Lock size={16} />
              Admin Access
            </motion.button>
          )}
        </div>
      </section>

      {/* Admin Password Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Admin Login</h3>
            <p className="text-sm text-muted-foreground mb-4">Enter admin password to view detailed analytics.</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowPasswordDialog(false); setPasswordInput(''); }}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin-only: Detailed Analytics */}
      {isAdmin && (
        <>
          {/* Stats Bar */}
          <section className="py-6 bg-secondary/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { label: 'Total Page Views', value: loading ? '...' : totalViews.toLocaleString() },
                  { label: 'States Covered', value: '28+' },
                  { label: 'Cities Reached', value: '150+' },
                  { label: 'Pages Tracked', value: loading ? '...' : pageStats.length.toString() },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Analytics Grid */}
          <section className="py-16 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {/* Page-wise Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BarChart3 size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-foreground text-lg">Page-wise Views</h3>
                      <p className="text-xs text-muted-foreground">Top visited pages</p>
                    </div>
                  </div>
                  {loading ? (
                    <p className="text-muted-foreground text-sm">Loading analytics...</p>
                  ) : pageStats.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No data yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {pageStats.map((p) => {
                        const maxCount = pageStats[0]?.count || 1;
                        const pct = Math.round((p.count / maxCount) * 100);
                        const name = pageNameMap[p.page_path] || p.page_path;
                        return (
                          <div key={p.page_path}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-foreground font-medium truncate mr-2">{name}</span>
                              <span className="text-muted-foreground flex-shrink-0">{p.count}</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>

                {/* Social Media Sources */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Share2 size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-foreground text-lg">Traffic Sources</h3>
                      <p className="text-xs text-muted-foreground">Social media & referral breakdown</p>
                    </div>
                  </div>
                  {loading ? (
                    <p className="text-muted-foreground text-sm">Loading...</p>
                  ) : sourceStats.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No data yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {sourceStats.map((s) => {
                        const total = sourceStats.reduce((sum, x) => sum + x.count, 0);
                        const pct = Math.round((s.count / total) * 100);
                        const label = sourceLabels[s.referrer_source] || s.referrer_source;
                        const color = sourceColors[s.referrer_source] || sourceColors.other;
                        return (
                          <div key={s.referrer_source} className="flex items-center gap-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${color} min-w-[80px] text-center`}>
                              {label}
                            </span>
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">{pct}%</span>
                            <span className="text-xs text-muted-foreground w-8 text-right">({s.count})</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* State-wise Grid */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                  <Globe2 size={16} />
                  Distribution Network
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-2">State-wise Presence</h2>
                <p className="text-muted-foreground">Our distribution network across major Indian states</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stateData.map((item, index) => (
                  <motion.div
                    key={item.state}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <item.icon size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-serif font-semibold text-foreground text-lg">{item.state}</h3>
                          <span className="text-xs text-primary font-medium">{item.highlight}</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-primary">{item.visitors}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.cities.map((city) => (
                        <span key={city} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                          {city}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Expansion Note - visible to all */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're continuously expanding our reach. If you're from a region not listed above and interested in 
            Mittika products, <a href="/contact" className="text-primary font-medium hover:underline">contact us</a> — 
            we deliver across India and are also open to distribution partnerships.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Visitors;
