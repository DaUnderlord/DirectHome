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
import Logo from '../../UI/Logo';
import { useAuth } from '../../../context/AuthContext';

interface HeaderProps {
  opened?: boolean;
  toggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggle }) => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        background: scrolled 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        boxShadow: scrolled 
          ? '0 8px 32px rgba(31, 38, 135, 0.15)' 
          : 'none'
      }}
    >
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggle}
          className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          aria-label="Toggle menu"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <IconMenu2 size={20} className="text-white drop-shadow-lg" />
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
          className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          aria-label="Search"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <IconSearch size={18} className="text-white drop-shadow-lg" />
        </Link>

        {isAuthenticated ? (
          <Link
            to="/profile"
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            aria-label="Profile"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <IconUser size={18} className="text-white drop-shadow-lg" />
          </Link>
        ) : (
          <Link
            to="/auth/login"
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            aria-label="Login"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <IconLogin size={18} className="text-white drop-shadow-lg" />
          </Link>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-4">
        <Link
          to="/search"
          className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 text-white hover:bg-blue-500/20 hover:text-blue-200 backdrop-blur-sm drop-shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <IconSearch size={18} />
          <span>Search</span>
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600/90 hover:to-blue-700/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm"
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              <IconDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 text-white hover:bg-white/10 backdrop-blur-sm drop-shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              <IconUser size={18} />
              <span>Profile</span>
            </Link>
          </>
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
              className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 text-white hover:bg-blue-500/20 hover:text-blue-200 backdrop-blur-sm drop-shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
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