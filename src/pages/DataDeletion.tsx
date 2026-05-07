import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Trash2, Mail } from 'lucide-react';

const DataDeletion = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `MTK-DEL-${Date.now().toString().slice(-8)}`;
    setConfirmationCode(code);
    setSubmitted(true);
    const subject = encodeURIComponent(`Data Deletion Request — ${code}`);
    const body = encodeURIComponent(
      `Confirmation Code: ${code}\nAccount Email: ${email || user?.email || ''}\nReason: ${reason || 'Not specified'}\n\nI request deletion of all my personal data, orders history, and any data received from Meta APIs (Facebook/Instagram).`
    );
    window.location.href = `mailto:info@ecovia.co.in?subject=${subject}&body=${body}`;
    toast.success('Request prepared. Please send the email to complete deletion.');
  };

  return (
    <Layout>
      <Helmet>
        <title>Data Deletion – Mittika by Ecovia</title>
        <meta name="description" content="Request deletion of your personal data and Meta (Facebook/Instagram) API data from Mittika." />
        <link rel="canonical" href="https://ecovia.co.in/data-deletion" />
      </Helmet>
      <section className="py-12 bg-hero-pattern min-h-[80vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="prose prose-emerald dark:prose-invert mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">User Data Deletion</h1>
            <p className="text-sm text-muted-foreground">Compliant with Meta Platform "User Data Deletion Callback URL" requirement for Facebook Login, Messenger, and Instagram APIs.</p>

            <h2>How to Delete Your Data</h2>
            <p>You can permanently delete the data Mittika holds about you — including your profile, address, order history, and any data received from Meta APIs (Facebook / Instagram) — by submitting the form below.</p>

            <h3>What Gets Deleted</h3>
            <ul>
              <li>Profile (name, email, phone, address)</li>
              <li>Order history and saved invoices</li>
              <li>Any messages, profile information, or media received via Facebook Messenger / Instagram Direct through our official Meta App</li>
              <li>Any access tokens issued by Facebook Login</li>
              <li>Anonymous analytics tied to your account</li>
            </ul>

            <h3>What May Be Retained</h3>
            <p>Under Indian tax and consumer-protection law, we are required to retain invoice and tax records for up to <strong>8 years</strong>. These records are anonymised where possible. Suppression-list entries (so we never email you again) are retained.</p>

            <h3>Processing Time</h3>
            <p>Requests are processed within <strong>30 days</strong>. You will receive a confirmation email when complete. The confirmation code below lets you track your request.</p>

            <h3>Alternative for Facebook / Instagram users</h3>
            <p>You may also remove our app entirely from your Meta account: <em>Settings → Apps and Websites → Mittika → Remove</em>. This automatically triggers our deletion callback.</p>
          </div>

          {submitted ? (
            <div className="bg-card rounded-2xl shadow-elevated p-8 text-center">
              <Trash2 className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="font-serif text-2xl font-bold mb-2">Request Submitted</h2>
              <p className="text-muted-foreground mb-4">Your confirmation code:</p>
              <p className="font-mono text-xl font-bold text-primary mb-4">{confirmationCode}</p>
              <p className="text-sm text-muted-foreground">Please complete the email that just opened to confirm. You can also email <a className="underline" href={`mailto:info@ecovia.co.in?subject=Data Deletion ${confirmationCode}`}>info@ecovia.co.in</a> directly with this code.</p>
              <p className="text-xs text-muted-foreground mt-4">Status URL: <a className="underline" href={`https://ecovia.co.in/data-deletion?code=${confirmationCode}`}>https://ecovia.co.in/data-deletion?code={confirmationCode}</a></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-elevated p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Account Email</label>
                <input type="email" required value={email || user?.email || ''} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reason (optional)</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:border-primary outline-none resize-none" />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90">
                <Mail size={18} /> Submit Deletion Request
              </button>
              <p className="text-xs text-muted-foreground">By submitting, you confirm you are the account owner. We will email you a confirmation when deletion is complete.</p>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DataDeletion;