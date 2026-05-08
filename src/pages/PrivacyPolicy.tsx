import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => (
  <Layout>
    <Helmet>
      <title>Privacy Policy – Mittika by Ecovia</title>
      <meta name="description" content="Mittika privacy policy covering customer data, Sarina AI chat handling, and Meta (Facebook/Instagram) Platform compliance." />
      <link rel="canonical" href="https://ecovia.co.in/privacy-policy" />
    </Helmet>
    <section className="py-12 bg-hero-pattern min-h-[80vh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-8 mb-6 shadow-elevated">
          <p className="text-xs uppercase tracking-widest opacity-80">Ecovia Enterprises • Brand: Mittika</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-1">Privacy Policy</h1>
          <p className="text-sm opacity-90 mt-2">Last updated: May 7, 2026</p>
        </div>
        <div className="bg-card rounded-2xl shadow-elevated p-8 prose prose-emerald dark:prose-invert max-w-none">

        <p>Mittika is a brand operated by <strong>Ecovia Enterprises OPC Pvt. Ltd.</strong> ("Mittika", "we", "us"). This Privacy Policy explains how we collect, use, store, and protect your information when you use <a href="https://ecovia.co.in">ecovia.co.in</a> and our official Facebook and Instagram presence.</p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Account data</strong>: name, email, phone, residential and permanent address — provided by you at signup or checkout.</li>
          <li><strong>Order data</strong>: items, prices, invoices, tracking, and payment confirmation (we never store your UPI PIN, card numbers, or bank credentials).</li>
          <li><strong>Usage analytics</strong>: anonymous page views, referrer source, and device type.</li>
          <li><strong>Meta Platform data</strong>: if you contact us via Facebook Messenger or Instagram Direct, Meta provides us your public profile and message content for the sole purpose of replying to you.</li>
        </ul>

        <h2>2. Sarina AI Chat — Zero Data Retention</h2>
        <p>Sarina is our on-site AI assistant. We want you to be 100% clear:</p>
        <ul>
          <li><strong>Sarina AI does NOT collect, store, or sell any data from customers.</strong></li>
          <li>Conversations are <strong>temporary</strong> and exist only in your browser session.</li>
          <li>The chat is <strong>automatically deleted</strong> the moment you close the chat window or your browser tab.</li>
          <li>Sarina does not log your IP, identity, or messages to any database.</li>
          <li>Messages are sent to the AI model only to generate a reply, and are not retained after the response is delivered.</li>
        </ul>

        <h2>3. Meta Platform (Facebook & Instagram) Compliance</h2>
        <p>This page is provided to satisfy <strong>Meta Platform Terms</strong> and the <strong>Meta Developer Policies</strong>, including the Facebook Login, Messenger Platform, Instagram Graph API, and Instagram Messaging API requirements.</p>
        <ul>
          <li><strong>App Name</strong>: Mittika by Ecovia</li>
          <li><strong>Data Controller</strong>: Ecovia Enterprises OPC Pvt. Ltd., India</li>
          <li><strong>Contact</strong>: <a href="mailto:info@ecovia.co.in">info@ecovia.co.in</a></li>
          <li><strong>Permissions used</strong>: <code>pages_messaging</code>, <code>instagram_basic</code>, <code>instagram_manage_messages</code>, <code>pages_manage_metadata</code>, <code>public_profile</code> — solely to receive and respond to customer messages on Facebook and Instagram.</li>
          <li><strong>We do not</strong> use Meta data for advertising, profiling, resale, or any purpose unrelated to direct customer support.</li>
          <li>Meta data is retained only as long as needed to resolve your inquiry and is deleted on request via the <a href="/data-deletion">Data Deletion</a> page.</li>
        </ul>

        <h2>4. How We Use Information</h2>
        <ul>
          <li>To process orders, send invoices, and ship products.</li>
          <li>To send order status updates (Placed, Accepted, Shipped, Delivered) over WhatsApp or email.</li>
          <li>To respond to messages on Facebook, Instagram, WhatsApp, and email.</li>
          <li>To improve our products and website. Analytics is anonymous and aggregate-only.</li>
        </ul>

        <h2>5. Sharing of Information</h2>
        <p>We do <strong>not</strong> sell your personal data. We share data only with: (a) shipping couriers, to deliver your order; (b) UPI/payment processors, for verifying payments; (c) law enforcement when legally required.</p>

        <h2>6. Data Security</h2>
        <p>All data is stored on secure cloud infrastructure with TLS encryption in transit and Row-Level Security on every customer record. Only the account owner can access their own profile and orders.</p>

        <h2>7. Your Rights</h2>
        <ul>
          <li>Access, correct, or download your data from the <a href="/account">My Account</a> page.</li>
          <li>Request deletion of your data via the <a href="/data-deletion">Data Deletion</a> page (also satisfies Meta's User Data Deletion URL requirement).</li>
          <li>Opt out of marketing messages anytime by replying STOP on WhatsApp.</li>
        </ul>

        <h2>8. Cookies</h2>
        <p>We use only essential cookies for authentication and cart state. No third-party advertising cookies.</p>

        <h2>9. Children</h2>
        <p>Our services are not directed to children under 13. We do not knowingly collect data from minors.</p>

        <h2>10. Changes & Contact</h2>
        <p>We may update this policy. The "Last updated" date will reflect changes. Questions: <a href="mailto:info@ecovia.co.in">info@ecovia.co.in</a> or +91 87588 08684.</p>
      </div>
    </section>
  </Layout>
);

export default PrivacyPolicy;