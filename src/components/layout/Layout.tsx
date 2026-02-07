import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SarinaBot from '@/components/chat/SarinaBot';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 sm:pt-20">
        {children}
      </main>
      <Footer />
      <SarinaBot />
    </div>
  );
};

export default Layout;
