 import { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
 import Layout from '@/components/layout/Layout';
 import { useAuth } from '@/contexts/AuthContext';
 import { toast } from 'sonner';
 
 const Auth = () => {
   const navigate = useNavigate();
   const { signIn, signUp, user } = useAuth();
   const [isLogin, setIsLogin] = useState(true);
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [form, setForm] = useState({
     email: '',
     password: '',
     fullName: ''
   });
 
   // Redirect if already logged in
   if (user) {
     navigate('/account');
     return null;
   }
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
 
     try {
       if (isLogin) {
         const { error } = await signIn(form.email, form.password);
         if (error) {
           toast.error(error.message);
         } else {
           toast.success('Welcome back!');
           navigate('/');
         }
       } else {
         if (!form.fullName.trim()) {
           toast.error('Please enter your full name');
           setLoading(false);
           return;
         }
         const { error } = await signUp(form.email, form.password, form.fullName);
         if (error) {
           toast.error(error.message);
         } else {
           toast.success('Account created! Please check your email to verify.');
         }
       }
     } catch (err) {
       toast.error('Something went wrong. Please try again.');
     }
 
     setLoading(false);
   };
 
   return (
     <Layout>
       <section className="min-h-[80vh] flex items-center justify-center py-12 bg-hero-pattern">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-md mx-auto"
           >
             <div className="bg-card rounded-2xl shadow-elevated p-8">
               <div className="text-center mb-8">
                 <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                   {isLogin ? 'Welcome Back' : 'Create Account'}
                 </h1>
                 <p className="text-muted-foreground">
                   {isLogin 
                     ? 'Sign in to access your order history' 
                     : 'Join Mittika for a natural wellness journey'}
                 </p>
               </div>
 
               <form onSubmit={handleSubmit} className="space-y-5">
                 {!isLogin && (
                   <div>
                     <label className="block text-sm font-medium text-foreground mb-2">
                       Full Name
                     </label>
                     <div className="relative">
                       <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                       <input
                         type="text"
                         value={form.fullName}
                         onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                         placeholder="Enter your full name"
                         className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                         required={!isLogin}
                       />
                     </div>
                   </div>
                 )}
 
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">
                     Email Address
                   </label>
                   <div className="relative">
                     <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                     <input
                       type="email"
                       value={form.email}
                       onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                       placeholder="Enter your email"
                       className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                       required
                     />
                   </div>
                 </div>
 
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">
                     Password
                   </label>
                   <div className="relative">
                     <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                     <input
                       type={showPassword ? 'text' : 'password'}
                       value={form.password}
                       onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                       placeholder="Enter your password"
                       className="w-full pl-10 pr-12 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                       required
                       minLength={6}
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                     >
                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                   </div>
                 </div>
 
                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                 >
                   {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                   <ArrowRight size={18} />
                 </button>
               </form>
 
               <div className="mt-6 text-center">
                 <button
                   onClick={() => setIsLogin(!isLogin)}
                   className="text-sm text-muted-foreground hover:text-foreground"
                 >
                   {isLogin ? "Don't have an account? " : 'Already have an account? '}
                   <span className="text-primary font-medium">
                     {isLogin ? 'Sign Up' : 'Sign In'}
                   </span>
                 </button>
               </div>
             </div>
           </motion.div>
         </div>
       </section>
     </Layout>
   );
 };
 
 export default Auth;