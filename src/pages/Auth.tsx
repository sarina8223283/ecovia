import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, KeyRound, CheckCircle2, HelpCircle, RefreshCw, Package, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, verifyEmailOtp, resendSignupOtp, user } = useAuth();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [resendIn, setResendIn] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [verified, setVerified] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startResendCountdown = (secs = 45) => {
    setResendIn(secs);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) { if (timerRef.current) window.clearInterval(timerRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current); }, []);

  if (user) {
    navigate(redirectTo);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(form.email, form.password);
        if (error) toast.error(error.message);
        else { toast.success('Welcome back!'); navigate(redirectTo); }
      } else {
        if (!form.fullName.trim()) { toast.error('Please enter your full name'); setLoading(false); return; }
        setDeliveryStatus('sending');
        const { error } = await signUp(form.email, form.password, form.fullName);
        if (error) { setDeliveryStatus('failed'); toast.error(error.message); }
        else {
          setDeliveryStatus('sent');
          setOtpStep(true);
          startResendCountdown(45);
          toast.success('OTP sent to your email!');
        }
      }
    } catch { toast.error('Something went wrong. Please try again.'); }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) { toast.error('Enter the 6-digit code from your email'); return; }
    setLoading(true);
    const { error } = await verifyEmailOtp(form.email, otp);
    if (error) { setLoading(false); toast.error(error.message); return; }
    // Auto-login with the password the user just set
    const { error: signInError } = await signIn(form.email, form.password);
    setLoading(false);
    if (signInError) { toast.error('Verified, but sign-in failed. Please log in.'); return; }
    toast.success('Email verified! Welcome to Mittika 🌿');
    setVerified(true);
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    setDeliveryStatus('sending');
    const { error } = await resendSignupOtp(form.email, form.password, form.fullName);
    if (error) { setDeliveryStatus('failed'); toast.error(error.message); }
    else {
      setDeliveryStatus('sent');
      startResendCountdown(45);
      toast.success('A new 6-digit OTP has been sent to your email.');
    }
  };

  // Auto-submit when 6 digits entered (paste from email)
  useEffect(() => {
    if (otpStep && otp.length === 6 && !loading && !verified) {
      handleVerifyOtp({ preventDefault: () => {} } as React.FormEvent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  if (otpStep) {
    return (
      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center py-12 bg-hero-pattern">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
              <div className="bg-card rounded-2xl shadow-elevated p-8">
                {!verified ? (
                  <>
                    <div className="text-center mb-6">
                      <KeyRound className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h1 className="font-serif text-2xl font-bold mb-2">Verify your email</h1>
                      <p className="text-muted-foreground text-sm">We sent a 6-digit code to <strong className="text-foreground">{form.email}</strong></p>
                    </div>

                    {/* Delivery status banner */}
                    <div className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 mb-4 border ${
                      deliveryStatus === 'sent' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                      deliveryStatus === 'sending' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                      deliveryStatus === 'failed' ? 'bg-red-50 border-red-200 text-red-800' :
                      'bg-muted border-border text-muted-foreground'}`}>
                      {deliveryStatus === 'sending' && <Loader2 size={14} className="animate-spin" />}
                      {deliveryStatus === 'sent' && <CheckCircle2 size={14} />}
                      {deliveryStatus === 'failed' && <HelpCircle size={14} />}
                      <span>
                        {deliveryStatus === 'sending' && 'Sending OTP to your inbox…'}
                        {deliveryStatus === 'sent' && 'OTP delivered from Ecovia Enterprises • Mittika 🌿'}
                        {deliveryStatus === 'failed' && 'Delivery failed. Please retry.'}
                        {deliveryStatus === 'idle' && 'Waiting for delivery status…'}
                      </span>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <input
                        type="text" inputMode="numeric" maxLength={6}
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none"
                        autoFocus
                      />
                      <button type="submit" disabled={loading || otp.length !== 6}
                        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                        <ArrowRight size={18} />
                      </button>
                    </form>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <button onClick={() => { setOtpStep(false); setOtp(''); setDeliveryStatus('idle'); }} className="text-muted-foreground hover:text-foreground">← Back</button>
                      <button
                        onClick={handleResend}
                        disabled={resendIn > 0}
                        className="inline-flex items-center gap-1 text-primary font-medium hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                      >
                        <RefreshCw size={14} className={deliveryStatus === 'sending' ? 'animate-spin' : ''} />
                        {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
                      </button>
                    </div>

                    {/* Troubleshooting */}
                    <div className="mt-6 border-t border-border pt-4">
                      <button onClick={() => setShowHelp(s => !s)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <HelpCircle size={14} /> Didn't receive the email? {showHelp ? 'Hide help' : 'Show help'}
                      </button>
                      {showHelp && (
                        <ul className="mt-3 space-y-2 text-xs text-muted-foreground list-disc pl-5 leading-relaxed">
                          <li>The code arrives from <strong>Ecovia Enterprises &lt;onboarding@resend.dev&gt;</strong> — please check your <strong>Spam / Promotions</strong> folder.</li>
                          <li>Search your inbox for <em>"Mittika OTP"</em> or <em>"Ecovia"</em>.</li>
                          <li>Add <strong>info@ecovia.co.in</strong> to your contacts to avoid filters next time.</li>
                          <li>Confirm the email <strong>{form.email}</strong> is correct — typos are the #1 cause.</li>
                          <li>Wait ~30 seconds; some providers (Gmail, Outlook, Yahoo) batch delivery.</li>
                          <li>Still nothing? Tap <em>Resend OTP</em> after the countdown, or email <strong>info@ecovia.co.in</strong> / WhatsApp <strong>+91 87588 08684</strong>.</li>
                        </ul>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                    </div>
                    <h1 className="font-serif text-2xl font-bold mb-2">You're verified! 🌿</h1>
                    <p className="text-muted-foreground text-sm mb-6">Welcome to the Mittika family, <strong className="text-foreground">{form.fullName || 'friend'}</strong>. Your account is ready.</p>
                    <div className="grid gap-3">
                      <button onClick={() => navigate('/orders/track')} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90">
                        <Package size={18} /> Track my orders
                      </button>
                      <button onClick={() => navigate(redirectTo)} className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:bg-secondary/80">
                        Go to my account <ArrowRight size={18} />
                      </button>
                      <button onClick={() => navigate('/products')} className="text-sm text-muted-foreground hover:text-foreground mt-1">Continue shopping →</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-12 bg-hero-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl shadow-elevated p-8">
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                <p className="text-muted-foreground">{isLogin ? 'Sign in to access your order history' : 'Verify your email with a 6-digit code'}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Enter your full name" className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" required={!isLogin} />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Enter your email" className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Enter your password" className="w-full pl-10 pr-12 py-3 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Send OTP & Create Account'}
                  <ArrowRight size={18} />
                </button>
              </form>
              <div className="mt-6 text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-foreground">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <span className="text-primary font-medium">{isLogin ? 'Sign Up' : 'Sign In'}</span>
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
