import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IconSearch,
  IconPlus,
  IconUser,
  IconDashboard,
  IconLogin,
  IconMenu2
} from '@tabler/icons-react';
import Logo from '../UI/Logo';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  opened?: boolean;
  toggle?: () => void;
}

/* ---------- helpers ---------- */
const glass = {
  light: {
    bg: 'rgba(255, 255, 255, .08)',
    border: 'rgba(255, 255, 255, .25)',
    shadow: 'rgba(0, 0, 0, .15)',
    glow: 'rgba(255, 255, 255, .35)'
  },
  dark: {
    bg: 'rgba(0, 0, 0, .15)',
    border: 'rgba(255, 255, 255, .12)',
    shadow: 'rgba(0, 0, 0, .35)',
    glow: 'rgba(255, 255, 255, .25)'
  }
};

const Header: React.FC<HeaderProps> = ({ toggle }) => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  /* choose light/dark variables automatically */
  const mode = scrolled ? 'dark' : 'light';
  const vars = glass[mode];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
      style={{
        // 1) frosted sheet
        background: `linear-gradient(135deg, ${vars.bg}, ${vars.bg})`,
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        // 2) glass edge + glow
        borderBottom: `1px solid ${vars.border}`,
        boxShadow: `inset 0 1px 0 0 ${vars.glow}, 0 8px 32px 0 ${vars.shadow}`,
        // 3) height & padding
        height: '4.5rem'
      }}
    >
      <div className="h-full flex items-center justify-between px-6 max-w-screen-2xl mx-auto">
        {/* Mobile menu */}
        <div className="md:hidden">
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/10 dark:hover:bg-black/10 transition"
            aria-label="Toggle menu"
          >
            <IconMenu2 size={22} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo size="md" />
        </div>

        {/* Mobile quick actions */}
        <div className="md:hidden flex items-center space-x-2">
          <Link
            to="/search"
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/10 dark:hover:bg-black/10 transition"
            aria-label="Search"
          >
            <IconSearch size={20} />
          </Link>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/10 dark:hover:bg-black/10 transition"
              aria-label="Profile"
            >
              <IconUser size={20} />
            </Link>
          ) : (
            <Link
              to="/auth/login"
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/10 dark:hover:bg-black/10 transition"
              aria-label="Login"
            >
              <IconLogin size={20} />
            </Link>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/search"
            className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-medium hover:opacity-70 transition"
          >
            <IconSearch size={18} />
            <span>Search</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-medium hover:opacity-70 transition"
              >
                <IconDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-medium hover:opacity-70 transition"
              >
                <IconUser size={18} />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth/login?redirect=list-property"
                className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl shadow-sm transition-all duration-200"
              >
                <IconPlus size={18} />
                <span>List Property</span>
              </Link>
              <Link
                to="/auth/login"
                className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 font-medium hover:opacity-70 transition"
              >
                <IconLogin size={18} />
                <span>Login</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;