import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconSearch,
  IconBuildingEstate,
  IconMessage,
  IconCalendarEvent,
  IconHeart,
  IconChevronDown,
  IconCalculator,
  IconInfoCircle,
  IconHelp
} from '@tabler/icons-react';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types/auth';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  hasDropdown?: boolean;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  to,
  active,
  hasDropdown = false,
  children
}) => {

  if (hasDropdown && children) {
    return (
      <div className="relative group">
        <button
          className={`flex items-center space-x-1 px-3 py-2 rounded-md ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
        >
          <span className="flex items-center space-x-2">
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </span>
          <IconChevronDown size={16} className="ml-1" />
        </button>

        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
          {children}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
        } transition-colors duration-200`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

// Dropdown menu item component
const DropdownItem: React.FC<{ icon: React.ReactNode; label: string; to: string }> = ({
  icon,
  label,
  to
}) => {
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Link>
  );
};

// Dropdown divider component
const DropdownDivider: React.FC = () => {
  return <div className="border-t border-gray-100 my-1"></div>;
};

const Navigation: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isHomeOwner = user?.role === UserRole.HOME_OWNER;
  const isHomeSeeker = user?.role === UserRole.HOME_SEEKER;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex items-center space-x-1">
      <NavItem
        icon={<IconHome size={18} />}
        label="Home"
        to="/"
        active={isActive('/')}
      />

      <NavItem
        icon={<IconSearch size={18} />}
        label="Search"
        to="/search"
        active={isActive('/search')}
      />

      {isAuthenticated && isHomeOwner && (
        <NavItem
          icon={<IconBuildingEstate size={18} />}
          label="My Properties"
          to="/dashboard/homeowner"
          active={isActive('/dashboard/homeowner')}
          hasDropdown
        >
          <div className="py-1">
            <div className="px-4 py-1 text-xs font-semibold text-gray-500">Property Management</div>
            <DropdownItem
              icon={<IconBuildingEstate size={14} />}
              label="Dashboard"
              to="/dashboard/homeowner"
            />
            <DropdownItem
              icon={<IconBuildingEstate size={14} />}
              label="Add New Property"
              to="/properties/create"
            />
            <DropdownItem
              icon={<IconBuildingEstate size={14} />}
              label="Manage Properties"
              to="/properties/manage"
            />
          </div>
        </NavItem>
      )}

      {isAuthenticated && isHomeSeeker && (
        <NavItem
          icon={<IconHeart size={18} />}
          label="Saved Properties"
          to="/dashboard/homeseeker"
          active={isActive('/dashboard/homeseeker')}
        />
      )}

      {isAuthenticated && (
        <>
          <NavItem
            icon={<IconMessage size={18} />}
            label="Messages"
            to="/messages"
            active={isActive('/messages')}
          />

          <NavItem
            icon={<IconCalendarEvent size={18} />}
            label="Appointments"
            to="/appointments"
            active={isActive('/appointments')}
          />
        </>
      )}

      <NavItem
        icon={<IconCalculator size={18} />}
        label="Rent Calculator"
        to="/calculator"
        active={isActive('/calculator')}
      />

      <NavItem
        icon={<IconInfoCircle size={18} />}
        label="About"
        to="/about"
        active={isActive('/about')}
        hasDropdown
      >
        <div className="py-1">
          <div className="px-4 py-1 text-xs font-semibold text-gray-500">About Us</div>
          <DropdownItem
            icon={<IconInfoCircle size={14} />}
            label="About Us"
            to="/about"
          />
          <DropdownItem
            icon={<IconHelp size={14} />}
            label="Help Center"
            to="/help"
          />
          <DropdownDivider />
          <DropdownItem
            icon={<IconInfoCircle size={14} />}
            label="Contact Us"
            to="/contact"
          />
        </div>
      </NavItem>
    </div>
  );
};

export default Navigation;