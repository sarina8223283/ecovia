import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const Terms = () => (
  <Layout>
    <Helmet>
      <title>Terms of Service – Mittika by Ecovia</title>
      <meta name="description" content="Terms of service for Mittika herbal powders, including statutory norms for herbal brands and Meta API compliance." />
      <link rel="canonical" href="https://ecovia.co.in/terms" />
    </Helmet>
    <section className="py-12 bg-hero-pattern min-h-[80vh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-emerald dark:prose-invert">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Effective: May 7, 2026</p>

        <p>By using ecovia.co.in or any Mittika service, you agree to these Terms.</p>

        <h2>1. About Us</h2>
        <p>Mittika is a brand of <strong>Ecovia Enterprises OPC Pvt. Ltd.</strong>, registered in India, selling 100% natural herbal powders sourced and packed in India.</p>

        <h2>2. Products & Statutory Compliance (Herbal Brand Norms)</h2>
        <ul>
          <li>All products are <strong>cosmetic-grade herbal powders</strong> intended for external use unless explicitly stated otherwise.</li>
          <li>Products comply with <strong>FSSAI</strong>, <strong>BIS</strong>, and applicable provisions of the <strong>Drugs and Cosmetics Act, 1940</strong>, and the <strong>Legal Metrology Act, 2009</strong>.</li>
          <li>NABL-accredited lab reports are made available for purity verification.</li>
          <li>Statements on this site have not been evaluated by any medical regulator. Our products are not intended to diagnose, treat, cure, or prevent any disease.</li>
          <li>Always perform a patch test before topical use. Discontinue if irritation occurs.</li>
          <li>Pregnant or nursing women, children under 12, and people with chronic conditions should consult a qualified physician before use.</li>
        </ul>

        <h2>3. Orders, Payment & Shipping</h2>
        <ul>
          <li>Payment is <strong>UPI-only and in advance</strong>. Orders are confirmed only after payment is received.</li>
          <li>Order tracking is provided via the <a href="/account">My Account</a> page and WhatsApp updates.</li>
          <li>Dispatch typically occurs within 2–4 business days from order acceptance.</li>
        </ul>

        <h2>4. No Returns Policy</h2>
        <p>Owing to the consumable, hygiene-sensitive, and herbal nature of our products, <strong>we do not accept returns or exchanges</strong> once an order has been dispatched. Damaged-on-arrival cases must be reported within 24 hours of delivery with photo evidence to <a href="mailto:info@ecovia.co.in">info@ecovia.co.in</a>.</p>

        <h2>5. User Accounts</h2>
        <p>You are responsible for the accuracy of the data you provide and for maintaining the confidentiality of your account. We verify your email via OTP at signup.</p>

        <h2>6. Acceptable Use</h2>
        <p>You agree not to misuse the site, reverse-engineer it, scrape data at scale, or attempt to access other users' accounts.</p>

        <h2>7. Meta Platform Terms (Facebook & Instagram API)</h2>
        <p>If you engage with us through Facebook, Instagram, or Messenger, the following additional terms apply alongside Meta's own Platform Terms:</p>
        <ul>
          <li>Our use of information received from Meta APIs (Facebook Login, Messenger Platform, Instagram Graph API, Instagram Messaging API) is bound by, and adheres to, the <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener">Meta Platform Terms</a> and <a href="https://developers.facebook.com/devpolicy/" target="_blank" rel="noopener">Developer Policies</a>.</li>
          <li>We use Meta data only to provide customer support, respond to inquiries, and confirm orders. We do not sell, transfer, or use it for advertising or profiling.</li>
          <li>You may revoke our app's permissions anytime via your Facebook / Instagram settings, and request deletion via the <a href="/data-deletion">Data Deletion</a> page.</li>
          <li>Our app complies with Meta's Limited Use, Data Minimization, and User Messaging Policy.</li>
        </ul>

        <h2>8. Intellectual Property</h2>
        <p>The Mittika name, logo, product photos, and copy are the property of Ecovia Enterprises OPC Pvt. Ltd. and may not be reused without written permission.</p>

        <h2>9. Limitation of Liability</h2>
        <p>To the maximum extent permitted by Indian law, Ecovia Enterprises' liability for any claim arising from product use is limited to the amount paid for that specific order. We are not liable for indirect or consequential damages.</p>

        <h2>10. Governing Law</h2>
        <p>These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts at Ahmedabad, Gujarat.</p>

        <h2>11. Contact</h2>
        <p>Ecovia Enterprises OPC Pvt. Ltd. — <a href="mailto:info@ecovia.co.in">info@ecovia.co.in</a> — +91 87588 08684</p>
      </div>
    </section>
  </Layout>
);

export default Terms;