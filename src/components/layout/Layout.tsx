import { ReactNode, lazy, Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
const SarinaBot = lazy(() => import('@/components/chat/SarinaBot'));
import usePageAnalytics from '@/hooks/usePageAnalytics';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  usePageAnalytics();

  return (
    <div className="min-h-screen flex flex-col page-nature-overlay">
      <Navbar />
      <main className="flex-1 pt-16 sm:pt-20">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}><SarinaBot /></Suspense>
    </div>
  );
};

export default Layout;
