import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { lazy, Suspense } from 'react';
import Index from "./pages/Index";
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Auth = lazy(() => import('./pages/Auth'));
const Account = lazy(() => import('./pages/Account'));
const BulkOrders = lazy(() => import('./pages/BulkOrders'));
const Export = lazy(() => import('./pages/Export'));
const ShopByCategory = lazy(() => import('./pages/ShopByCategory'));
const PurityVerification = lazy(() => import('./pages/PurityVerification'));
const DirectionsOfUse = lazy(() => import('./pages/DirectionsOfUse'));
const Visitors = lazy(() => import('./pages/Visitors'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SarinaAdmin = lazy(() => import('./pages/SarinaAdmin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DemoRequests = lazy(() => import('./pages/DemoRequests'));
const Payment = lazy(() => import('./pages/Payment'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const DataDeletion = lazy(() => import('./pages/DataDeletion'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const MetaWebhook = lazy(() => import('./pages/MetaWebhook'));
const WebhookUninstall = lazy(() => import('./pages/WebhookUninstall'));
const WebhookDelete = lazy(() => import('./pages/WebhookDelete'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const CustomerOutreach = lazy(() => import('./pages/CustomerOutreach'));
const CosmeticGrade = lazy(() => import('./pages/CosmeticGrade'));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground" role="status">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account" element={<Account />} />
                <Route path="/bulk-orders" element={<BulkOrders />} />
                <Route path="/export" element={<Export />} />
                <Route path="/shop-by-category" element={<ShopByCategory />} />
                <Route path="/cosmetic-grade" element={<CosmeticGrade />} />
                <Route path="/cosmetic-grade/:category" element={<CosmeticGrade />} />
                <Route path="/purity" element={<PurityVerification />} />
                <Route path="/directions" element={<DirectionsOfUse />} />
                <Route path="/visitors" element={<Visitors />} />
                <Route path="/sarina-admin" element={<SarinaAdmin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/data-deletion" element={<DataDeletion />} />
                <Route path="/order/:orderNumber" element={<OrderTracking />} />
                <Route path="/webhook" element={<MetaWebhook />} />
                <Route path="/webhook/uninstall" element={<WebhookUninstall />} />
                <Route path="/webhook/delete" element={<WebhookDelete />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/admin/outreach" element={<CustomerOutreach />} />
                <Route path="/admin/demo-requests" element={<DemoRequests />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
