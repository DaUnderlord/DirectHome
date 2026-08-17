import React, { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import MobileNavigation from './Navigation/MobileNavigation';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const flushHero =
    isHomePage ||
    [
      '/construction-estimator',
      '/calculator',
      '/search',
      '/verified-properties',
      '/about',
      '/contact',
      '/careers',
      '/help',
      '/faq',
      '/terms',
      '/privacy',
      '/cookies',
    ].includes(location.pathname);
  const pageClass = flushHero ? 'page-content home-page' : 'page-content dh-app';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((open) => !open), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggle={toggleMobileMenu} />
      <MobileNavigation isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
      <main className={`flex-grow ${pageClass}`}>
        <ErrorBoundary>
          {children || <Outlet />}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;