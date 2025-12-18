import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IconSearch,
  IconPlus,
  IconUser,
  IconLogin,
  IconMenu2
} from '@tabler/icons-react';
import Logo from '../../UI/Logo';
import { useAuth } from '../../../context/AuthContext';

interface HeaderProps {
  opened?: boolean;
  toggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggle }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [lightHeader, setLightHeader] = useState(!isHomePage);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
      setLightHeader(!isHomePage || window.scrollY > window.innerHeight * 0.6);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navPillStyle: React.CSSProperties = {
    background: lightHeader ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: lightHeader ? '1px solid rgba(30, 74, 109, 0.12)' : '1px solid rgba(255, 255, 255, 0.12)'
  };

  return (
    <div 
      className={`
        h-full flex items-center justify-between px-4 transition-all duration-700 ease-out
        ${scrolled 
          ? 'glassmorphic-header' 
          : 'bg-transparent'
        }
      `}
      style={{
        background: lightHeader
          ? 'rgba(255, 255, 255, 0.92)'
          : scrolled
            ? 'rgba(255, 255, 255, 0.05)'
            : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? (lightHeader ? '1px solid rgba(30, 74, 109, 0.12)' : '1px solid rgba(255, 255, 255, 0.1)')
          : 'none',
        boxShadow: scrolled
          ? (lightHeader ? '0 8px 32px rgba(30, 74, 109, 0.10)' : '0 8px 32px rgba(31, 38, 135, 0.15)')
          : 'none'
      }}
    >
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggle}
          className={`p-2 rounded-xl transition-all duration-300 backdrop-blur-sm ${
            lightHeader ? 'hover:bg-blue-50' : 'hover:bg-white/10'
          }`}
          aria-label="Toggle menu"
          style={navPillStyle}
        >
          <IconMenu2 size={20} className={lightHeader ? 'text-blue-700' : 'text-white drop-shadow-lg'} />
        </button>
      </div>

      {/* Logo */}
      <div>
        <Logo size="md" />
      </div>

      {/* Mobile quick actions */}
      <div className="md:hidden flex items-center space-x-2">
        <Link
          to="/search"
          className={`p-2 rounded-xl transition-all duration-300 backdrop-blur-sm ${
            lightHeader ? 'hover:bg-blue-50' : 'hover:bg-white/10'
          }`}
          aria-label="Search"
          style={navPillStyle}
        >
          <IconSearch size={18} className={lightHeader ? 'text-blue-700' : 'text-white drop-shadow-lg'} />
        </Link>

        {isAuthenticated ? (
          <Link
            to="/profile"
            className={`p-2 rounded-xl transition-all duration-300 backdrop-blur-sm ${
              lightHeader ? 'hover:bg-blue-50' : 'hover:bg-white/10'
            }`}
            aria-label="Profile"
            style={navPillStyle}
          >
            <IconUser size={18} className={lightHeader ? 'text-blue-700' : 'text-white drop-shadow-lg'} />
          </Link>
        ) : (
          <Link
            to="/auth/login"
            className={`p-2 rounded-xl transition-all duration-300 backdrop-blur-sm ${
              lightHeader ? 'hover:bg-blue-50' : 'hover:bg-white/10'
            }`}
            aria-label="Login"
            style={navPillStyle}
          >
            <IconLogin size={18} className={lightHeader ? 'text-blue-700' : 'text-white drop-shadow-lg'} />
          </Link>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4">
        <Link
          to="/search"
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm drop-shadow-lg ${
            lightHeader
              ? 'text-blue-700 hover:bg-blue-50 hover:text-blue-800'
              : 'text-white hover:bg-blue-500/20 hover:text-blue-200'
          }`}
          style={navPillStyle}
        >
          <IconSearch size={18} />
          <span>Search</span>
        </Link>

        {isAuthenticated ? (
          <Link
            to="/profile"
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm drop-shadow-lg ${
              lightHeader
                ? 'text-blue-700 hover:bg-blue-50 hover:text-blue-800'
                : 'text-white hover:bg-white/10'
            }`}
            style={navPillStyle}
          >
            <IconUser size={18} />
            <span>Profile</span>
          </Link>
        ) : (
          <>
            <button
              onClick={() => {
                // Demo functionality - could show a modal or navigate to demo page
                alert('Demo functionality - this would show a product demo');
              }}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm"
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              <IconPlus size={18} />
              <span>+ List Property</span>
            </button>
            <Link
              to="/auth/login"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm drop-shadow-lg ${
                lightHeader
                  ? 'text-blue-700 hover:bg-blue-50 hover:text-blue-800'
                  : 'text-white hover:bg-blue-500/20 hover:text-blue-200'
              }`}
              style={navPillStyle}
            >
              <IconLogin size={18} />
              <span>Login</span>
            </Link>
          </>
        )}
      </nav>

    </div>
  );
};

export default Header;