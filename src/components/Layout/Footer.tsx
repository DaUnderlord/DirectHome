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
  return (
    <Link
      to={to}
      className="text-paper-300 hover:text-paper-50 transition-colors duration-200 block"
    >
      {label}
    </Link>
  );
};

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-courtyard-800 pt-12 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:pt-16 md:pb-10 text-paper-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="lg" inverted />
            </div>
            <p className="text-paper-300 mb-6 leading-relaxed max-w-sm">
              Tools for the Nigerian house — construction estimates, rent affordability, and a marketplace launching without middlemen.
            </p>
            <div className="flex space-x-4">
              {[
                IconBrandFacebook,
                IconBrandTwitter,
                IconBrandInstagram,
                IconBrandLinkedin,
              ].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 border border-white/15 hover:border-paper-50 rounded-sm flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-5 h-5 text-paper-200" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-paper-200 mb-4">Tools</h4>
            <div className="space-y-2">
              <FooterLink to="/construction-estimator" label="Construction Cost Estimator" />
              <FooterLink to="/calculator" label="Rent Calculator" />
              <FooterLink to="/search" label="Property Listings (Soon)" />
            </div>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-paper-200 mb-4">Company</h4>
            <div className="space-y-2">
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/careers" label="Careers" />
              <FooterLink to="/contact" label="Contact Us" />
            </div>
          </div>

          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase text-paper-200 mb-4">Support</h4>
            <div className="space-y-2">
              <FooterLink to="/help" label="Help Center" />
              <FooterLink to="/faq" label="FAQ" />
              <FooterLink to="/terms" label="Terms of Service" />
              <FooterLink to="/privacy" label="Privacy Policy" />
              {isAuthenticated && <FooterLink to="/dashboard" label="Dashboard" />}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-paper-300/80 mb-4 md:mb-0 text-sm">
              © {new Date().getFullYear()} DirectHome. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-paper-300 hover:text-paper-50 transition-colors text-sm">
                Terms
              </Link>
              <Link to="/privacy" className="text-paper-300 hover:text-paper-50 transition-colors text-sm">
                Privacy
              </Link>
              <Link to="/cookies" className="text-paper-300 hover:text-paper-50 transition-colors text-sm">
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
