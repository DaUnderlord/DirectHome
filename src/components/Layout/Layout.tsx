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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((open) => !open), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggle={toggleMobileMenu} />
      <MobileNavigation isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
      <main className={`flex-grow ${isHomePage ? 'page-content home-page' : 'page-content'}`}>
        <ErrorBoundary>
          {children || <Outlet />}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;