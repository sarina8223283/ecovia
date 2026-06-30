import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import BulkOrders from "./pages/BulkOrders";
import Export from "./pages/Export";
import ShopByCategory from "./pages/ShopByCategory";
import PurityVerification from "./pages/PurityVerification";
import DirectionsOfUse from "./pages/DirectionsOfUse";
import Visitors from "./pages/Visitors";
import NotFound from "./pages/NotFound";
import SarinaAdmin from "./pages/SarinaAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import Payment from "./pages/Payment";
import Checkout from "./pages/Checkout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import DataDeletion from "./pages/DataDeletion";
import OrderTracking from "./pages/OrderTracking";
import MetaWebhook from "./pages/MetaWebhook";
import WebhookUninstall from "./pages/WebhookUninstall";
import WebhookDelete from "./pages/WebhookDelete";
import AuthCallback from "./pages/AuthCallback";
import CustomerOutreach from "./pages/CustomerOutreach";
import CosmeticGrade from "./pages/CosmeticGrade";

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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
