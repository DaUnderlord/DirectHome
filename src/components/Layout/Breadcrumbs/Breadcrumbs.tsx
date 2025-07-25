import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconChevronRight } from '@tabler/icons-react';

interface BreadcrumbItem {
  title: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  homeLabel?: string;
  homePath?: string;
}

// Map of route paths to human-readable names
const routeNameMap: Record<string, string> = {
  'search': 'Search',
  'properties': 'Properties',
  'create': 'Add Property',
  'manage': 'Manage Properties',
  'messages': 'Messages',
  'appointments': 'Appointments',
  'profile': 'Profile',
  'settings': 'Settings',
  'help': 'Help Center',
  'admin': 'Admin Dashboard',
  'dashboard': 'Dashboard',
  'homeowner': 'Homeowner',
  'homeseeker': 'Home Seeker',
  'calculator': 'Rent Calculator',
  'auth': 'Authentication',
  'login': 'Login',
  'register': 'Register',
  'verify': 'Verify Account',
  'reset-password': 'Reset Password',
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items, 
  homeLabel = 'Home',
  homePath = '/'
}) => {
  const location = useLocation();
  
  // If no items are provided, generate them from the current path
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname, homeLabel, homePath);

  return (
    <nav role="navigation" aria-label="Breadcrumb" className="mt-2 mb-4">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <IconChevronRight size={14} className="text-gray-400 mx-2" />
              )}
              {isLast ? (
                <span className="text-gray-900 font-medium">
                  {item.title}
                </span>
              ) : (
                <Link 
                  to={item.path}
                  className="text-gray-500 hover:text-blue-600 hover:underline transition-colors duration-200"
                >
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumb items from the current path
const generateBreadcrumbsFromPath = (
  path: string, 
  homeLabel: string,
  homePath: string
): BreadcrumbItem[] => {
  const pathSegments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ title: homeLabel, path: homePath }];
  
  let currentPath = '';
  
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    
    // Get a human-readable name for this segment
    const title = routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      title,
      path: currentPath,
    });
  });
  
  return breadcrumbs;
};

export default Breadcrumbs;