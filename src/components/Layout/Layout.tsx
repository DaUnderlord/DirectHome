import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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