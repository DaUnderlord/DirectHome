import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandInstagram, 
  IconBrandLinkedin
} from '@tabler/icons-react';
import Logo from '../UI/Logo';
import { useAuth } from '../../context/AuthContext';

interface FooterLinkProps {
  label: string;
  to: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ label, to }) => {
  const handleClick = () => {
    // Scroll to top when navigating
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <Link 
      to={to} 
      onClick={handleClick}
      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 block"
    >
      {label}
    </Link>
  );
};

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="bg-gray-100 pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="lg" />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-sm">
              Your trusted platform for connecting property seekers directly with homeowners in Nigeria, eliminating middlemen and reducing costs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200">
                <IconBrandFacebook className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200">
                <IconBrandTwitter className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200">
                <IconBrandInstagram className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200">
                <IconBrandLinkedin className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <div className="space-y-2">
              <FooterLink to="/search" label="Search Properties" />
              {isAuthenticated ? (
                <FooterLink to="/dashboard" label="Dashboard" />
              ) : (
                <FooterLink to="/auth/login?redirect=list-property" label="List Your Property" />
              )}
              <FooterLink to="/calculator" label="Rent Calculator" />
              <FooterLink to="/verified-properties" label="Verified Properties" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Company</h4>
            <div className="space-y-2">
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/careers" label="Careers" />
              <FooterLink to="/contact" label="Contact Us" />
              <FooterLink to="/blog" label="Blog" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Support</h4>
            <div className="space-y-2">
              <FooterLink to="/help" label="Help Center" />
              <FooterLink to="/faq" label="FAQ" />
              <FooterLink to="/terms" label="Terms of Service" />
              <FooterLink to="/privacy" label="Privacy Policy" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} DirectHome. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/terms" 
                onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link 
                to="/privacy" 
                onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link 
                to="/cookies" 
                onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;