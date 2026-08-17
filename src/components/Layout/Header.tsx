import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconHammer,
  IconCalculator,
  IconUser,
  IconDashboard,
  IconLogin,
  IconMenu2,
  IconBuildingSkyscraper,
} from '@tabler/icons-react';
import Logo from '../UI/Logo';
import { useAuth } from '../../context/AuthContext';
import { useIntro } from '../../context/IntroContext';

interface HeaderProps {
  opened?: boolean;
  toggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggle }) => {
  const { isAuthenticated } = useAuth();
  const { phase } = useIntro();
  const navLink =
    'flex items-center space-x-2 text-ink-600 text-sm tracking-wide font-medium hover:text-courtyard-700 transition-colors';
  const navLinkMobile = 'p-2 rounded-sm text-ink-800 hover:bg-paper-200 transition';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-paper-100 border-b border-paper-200 transition-all duration-700 ${
        phase === 'playing' ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        height: 'calc(4.5rem + env(safe-area-inset-top))',
      }}
    >
      <div className="h-[4.5rem] flex items-center justify-between px-3 sm:px-6 max-w-screen-2xl mx-auto">
        <div className="md:hidden">
          <button onClick={toggle} className={navLinkMobile} aria-label="Toggle menu">
            <IconMenu2 size={22} />
          </button>
        </div>

        <div className="flex-shrink-0 min-w-0">
          <div className={phase === 'playing' ? 'opacity-0' : 'opacity-100 transition-opacity duration-500 delay-300'}>
            <Logo size="md" markTarget />
          </div>
        </div>

        <div className="md:hidden flex items-center space-x-1">
          <Link to="/construction-estimator" className={navLinkMobile} aria-label="Construction Estimator">
            <IconHammer size={20} />
          </Link>
          <Link to="/calculator" className={navLinkMobile} aria-label="Rent Calculator">
            <IconCalculator size={20} />
          </Link>
          {isAuthenticated ? (
            <Link to="/profile" className={navLinkMobile} aria-label="Profile">
              <IconUser size={20} />
            </Link>
          ) : (
            <Link to="/auth/login" className={navLinkMobile} aria-label="Login">
              <IconLogin size={20} />
            </Link>
          )}
        </div>

        <nav className="hidden md:flex items-center space-x-7">
          <Link to="/construction-estimator" className={navLink}>
            <IconHammer size={16} />
            <span>Build Cost</span>
          </Link>
          <Link to="/calculator" className={navLink}>
            <IconCalculator size={16} />
            <span>Rent Calculator</span>
          </Link>
          <Link to="/search" className={navLink}>
            <IconBuildingSkyscraper size={16} />
            <span>Listings</span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-brass-500 font-semibold ml-0.5">Soon</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={navLink}>
                <IconDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" className={navLink}>
                <IconUser size={16} />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="flex items-center space-x-2 px-5 py-2 bg-courtyard-700 hover:bg-courtyard-600 active:scale-[0.98] text-paper-50 text-sm font-semibold rounded-sm transition-all duration-200"
            >
              <IconLogin size={16} />
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
