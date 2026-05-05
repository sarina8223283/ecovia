  import { useState, useEffect } from 'react';
  import { useNavigate, Link, useSearchParams } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { User, Package, MapPin, Phone, Save, LogOut } from 'lucide-react';
 import Layout from '@/components/layout/Layout';
 import { useAuth } from '@/contexts/AuthContext';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from 'sonner';
 
 interface Order {
   id: string;
   order_number: string;
   status: string;
   total_amount: number;
   created_at: string;
 }
 
 const Account = () => {
   const navigate = useNavigate();
    const [searchParams] = useSearchParams();
   const { user, profile, loading, signOut, updateProfile } = useAuth();
   const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>(
      searchParams.get('tab') === 'orders' ? 'orders' : 'profile'
    );
   const [saving, setSaving] = useState(false);
   const [form, setForm] = useState({
     full_name: '',
     phone: '',
     address: '',
     city: '',
     state: '',
     pincode: ''
   });
 
   useEffect(() => {
     if (!loading && !user) {
       navigate('/auth');
     }
   }, [user, loading, navigate]);
 
   useEffect(() => {
     if (profile) {
       setForm({
         full_name: profile.full_name || '',
         phone: profile.phone || '',
         address: profile.address || '',
         city: profile.city || '',
         state: profile.state || '',
         pincode: profile.pincode || ''
       });
     }
   }, [profile]);
 
   useEffect(() => {
     if (user) {
       fetchOrders();
     }
   }, [user]);
 
   const fetchOrders = async () => {
     const { data } = await supabase
       .from('orders')
       .select('*')
       .eq('user_id', user?.id)
       .order('created_at', { ascending: false });
     
     if (data) setOrders(data);
   };
 
   const handleSave = async () => {
     setSaving(true);
     const { error } = await updateProfile(form);
     if (error) {
       toast.error(error.message);
     } else {
       toast.success('Profile updated successfully!');
     }
     setSaving(false);
   };
 
   const handleSignOut = async () => {
     await signOut();
     navigate('/');
     toast.success('Signed out successfully');
   };
 
   if (loading) {
     return (
       <Layout>
         <div className="min-h-[60vh] flex items-center justify-center">
           <div className="animate-pulse text-muted-foreground">Loading...</div>
         </div>
       </Layout>
     );
   }
 
   return (
     <Layout>
       <section className="py-12 bg-hero-pattern min-h-[80vh]">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-4xl mx-auto"
           >
             <div className="flex items-center justify-between mb-8">
               <h1 className="font-serif text-3xl font-bold text-foreground">My Account</h1>
               <button
                 onClick={handleSignOut}
                 className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
               >
                 <LogOut size={18} />
                 Sign Out
               </button>
             </div>
 
             {/* Tabs */}
             <div className="flex gap-4 mb-6">
               <button
                 onClick={() => setActiveTab('profile')}
                 className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                   activeTab === 'profile'
                     ? 'bg-primary text-primary-foreground'
                     : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                 }`}
               >
                 <User size={18} />
                 Profile
               </button>
               <button
                 onClick={() => setActiveTab('orders')}
                 className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                   activeTab === 'orders'
                     ? 'bg-primary text-primary-foreground'
                     : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                 }`}
               >
                 <Package size={18} />
                 Order History
               </button>
             </div>
 
             {activeTab === 'profile' ? (
               <div className="bg-card rounded-2xl shadow-elevated p-6 sm:p-8">
                 <h2 className="font-serif text-xl font-bold text-foreground mb-6">Profile Information</h2>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   <div className="sm:col-span-2">
                     <label className="block text-sm font-medium text-foreground mb-2">
                       Full Name
                     </label>
                     <input
                       type="text"
                       value={form.full_name}
                       onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                       className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                     />
                   </div>
 
                   <div>
                     <label className="block text-sm font-medium text-foreground mb-2">
                       Phone Number
                     </label>
                     <input
                       type="tel"
                       value={form.phone}
                       onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                       placeholder="+91 XXXXX XXXXX"
                       className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                     />
                   </div>
 
                   <div>
                     <label className="block text-sm font-medium text-foreground mb-2">
                       Pincode
                     </label>
                     <input
                       type="text"
                       value={form.pincode}
                       onChange={e => setForm(prev => ({ ...prev, pincode: e.target.value }))}
                       className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                     />
                   </div>
 
                   <div className="sm:col-span-2">
                     <label className="block text-sm font-medium text-foreground mb-2">
                       Address
                     </label>
                     <textarea
                       value={form.address}
                       onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                       rows={2}
                       className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                     />
                   </div>
 
                   <div>
                     <label className="block text-sm font-medium text-foreground mb-2">
                       City
                     </label>
                     <input
                       type="text"
                       value={form.city}
                       onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
                       className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                     />
                   </div>
 
                   <div>
                     <label className="block text-sm font-medium text-foreground mb-2">
                       State
                     </label>
                     <input
                       type="text"
                       value={form.state}
                       onChange={e => setForm(prev => ({ ...prev, state: e.target.value }))}
                       className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                     />
                   </div>
                 </div>
 
                 <button
                   onClick={handleSave}
                   disabled={saving}
                   className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                 >
                   <Save size={18} />
                   {saving ? 'Saving...' : 'Save Changes'}
                 </button>
               </div>
             ) : (
               <div className="bg-card rounded-2xl shadow-elevated p-6 sm:p-8">
                 <h2 className="font-serif text-xl font-bold text-foreground mb-6">Order History</h2>
                 
                 {orders.length === 0 ? (
                   <div className="text-center py-12">
                     <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                     <p className="text-muted-foreground mb-4">No orders yet</p>
                     <Link
                       to="/products"
                       className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                     >
                       Start Shopping
                     </Link>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     {orders.map(order => (
                       <div key={order.id} className="p-4 rounded-lg bg-secondary/30 border border-border">
                         <div className="flex items-center justify-between mb-2">
                           <span className="font-medium text-foreground">{order.order_number}</span>
                           <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                             order.status === 'completed' ? 'bg-primary/20 text-primary' :
                             order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700' :
                             'bg-secondary text-secondary-foreground'
                           }`}>
                             {order.status}
                           </span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                           <span className="text-muted-foreground">
                             {new Date(order.created_at).toLocaleDateString('en-IN', {
                               day: 'numeric',
                               month: 'short',
                               year: 'numeric'
                             })}
                           </span>
                           <span className="font-semibold text-foreground">₹{order.total_amount}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             )}
           </motion.div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Account;