import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LayoutDashboard, Users, FileText, Settings, Eye, BarChart3, Shield, Sparkles, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';

const ADMIN_PASSWORD = '7524';

// ─── Password Gate ───
const PasswordGate = ({ onAuth }: { onAuth: () => void }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() === ADMIN_PASSWORD) {
      onAuth();
      toast({ title: '🔓 Access granted', description: 'Welcome to Admin Dashboard' });
    } else {
      setError(true);
      toast({ title: '❌ Incorrect password', description: 'Please try again', variant: 'destructive' });
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-2">Enter your first car password to continue</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">What is your first car password?</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={10}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-destructive ring-2 ring-destructive/30' : 'border-border'} bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors`}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!answer.trim()}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Unlock Dashboard
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

// ─── Stats Card ───
const StatCard = ({ icon: Icon, label, value, subtext, color }: { icon: any; label: string; value: string | number; subtext?: string; color: string }) => (
  <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

// ─── Quick Action Card ───
const QuickAction = ({ icon: Icon, title, description, to, external }: { icon: any; title: string; description: string; to: string; external?: boolean }) => (
  <Link
    to={to}
    target={external ? '_blank' : undefined}
    className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group block"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground flex items-center gap-1.5">
          {title}
          {external && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  </Link>
);

// ─── Main Dashboard ───
const DashboardContent = () => {
  const { data: pageViews, isLoading: loadingViews } = useQuery({
    queryKey: ['admin-dashboard-views'],
    queryFn: async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getTime() - 7 * 86400000).toISOString();

      const [{ count: totalCount }, { count: todayCount }, { count: weekCount }] = await Promise.all([
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
      ]);
      return { total: totalCount || 0, today: todayCount || 0, week: weekCount || 0 };
    },
  });

  const { data: contentCount } = useQuery({
    queryKey: ['admin-dashboard-content'],
    queryFn: async () => {
      const { count } = await supabase.from('site_content').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: feedbackCount } = useQuery({
    queryKey: ['admin-dashboard-feedback'],
    queryFn: async () => {
      const { count } = await supabase.from('product_feedback').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: orderCount } = useQuery({
    queryKey: ['admin-dashboard-orders'],
    queryFn: async () => {
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: recentViews } = useQuery({
    queryKey: ['admin-dashboard-recent-pages'],
    queryFn: async () => {
      const { data } = await supabase.from('page_views').select('page_path, created_at, referrer_source, user_agent')
        .order('created_at', { ascending: false }).limit(10);
      return data || [];
    },
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your website, content & analytics</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Visitors" value={loadingViews ? '...' : pageViews?.total || 0} subtext="All time page views" color="bg-primary/10 text-primary" />
          <StatCard icon={BarChart3} label="Today" value={loadingViews ? '...' : pageViews?.today || 0} subtext="Visitors today" color="bg-accent/20 text-accent-foreground" />
          <StatCard icon={FileText} label="Content Entries" value={contentCount ?? '...'} subtext="Live on website" color="bg-secondary text-secondary-foreground" />
          <StatCard icon={Users} label="Feedback" value={feedbackCount ?? '...'} subtext="Product reviews" color="bg-primary/10 text-primary" />
        </div>

        {/* Quick Actions */}
        <h2 className="font-serif text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <QuickAction icon={Sparkles} title="Sarina AI Editor" description="Edit website content, generate images, manage everything with AI" to="/sarina-admin" />
          <QuickAction icon={Users} title="Visitor Analytics" description="View detailed visitor statistics and traffic sources" to="/visitors" />
          <QuickAction icon={FileText} title="Products" description="Browse and manage your product catalog" to="/products" />
          <QuickAction icon={Shield} title="Purity Verification" description="Manage powder purity testing information" to="/purity" />
          <QuickAction icon={Settings} title="Bulk Orders" description="View and manage bulk order inquiries" to="/bulk-orders" />
          <QuickAction icon={Eye} title="View Live Website" description="Open the live website in a new tab" to="/" external />
        </div>

        {/* Recent Activity */}
        <h2 className="font-serif text-lg font-bold text-foreground mb-4">Recent Visitors</h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Page</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Device</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentViews?.map((view, i) => {
                  const isMobile = view.user_agent && /mobile|android|iphone/i.test(view.user_agent);
                  const timeAgo = getTimeAgo(view.created_at);
                  return (
                    <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{view.page_path}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{view.referrer_source || 'direct'}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{isMobile ? '📱 Mobile' : '💻 Desktop'}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo}</td>
                    </tr>
                  );
                })}
                {(!recentViews || recentViews.length === 0) && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No recent visitors</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <PasswordGate onAuth={() => setIsAuthenticated(true)} />;
  }

  return <DashboardContent />;
};

export default AdminDashboard;
