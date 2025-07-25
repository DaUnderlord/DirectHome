import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar/Sidebar';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Container from '../UI/Container';

interface AppShellProps {
  children?: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [opened, setOpened] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  
  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggle = () => setOpened(!opened);
  const close = () => setOpened(false);
  
  // Don't show breadcrumbs on the home page
  const showBreadcrumbs = location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <Header opened={opened} toggle={toggle} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
          ${isMobile && !opened ? '-translate-x-full' : 'translate-x-0'}
          w-64 md:w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          ${isMobile ? 'top-16' : 'top-0'}
        `}>
          <div className="p-4">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobile && opened && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
            onClick={close}
          />
        )}

        {/* Main content */}
        <main 
          className="flex-1 min-w-0"
          onClick={isMobile && opened ? close : undefined}
        >
          <ErrorBoundary>
            {showBreadcrumbs && (
              <Container size="xl">
                <Breadcrumbs />
              </Container>
            )}
            {children || <Outlet />}
          </ErrorBoundary>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="p-4">
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default AppShell;