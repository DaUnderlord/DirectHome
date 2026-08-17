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
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="text-stone-400 hover:text-gold-400 transition-colors duration-200 block"
    >
      {label}
    </Link>
  );
};

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-charcoal-950 border-t border-gold-500/10 pt-16 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="lg" />
            </div>
            <p className="text-stone-400 mb-6 leading-relaxed max-w-sm">
              Free construction and rent calculators for Nigeria. Property listings launching soon — direct connections, no middlemen.
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
                  className="w-10 h-10 bg-charcoal-800 hover:bg-charcoal-700 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-5 h-5 text-stone-400" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-stone-200 mb-4">Tools</h4>
            <div className="space-y-2">
              <FooterLink to="/construction-estimator" label="Construction Cost Estimator" />
              <FooterLink to="/calculator" label="Rent Calculator" />
              <FooterLink to="/search" label="Property Listings (Soon)" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-stone-200 mb-4">Company</h4>
            <div className="space-y-2">
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/careers" label="Careers" />
              <FooterLink to="/contact" label="Contact Us" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-stone-200 mb-4">Support</h4>
            <div className="space-y-2">
              <FooterLink to="/help" label="Help Center" />
              <FooterLink to="/faq" label="FAQ" />
              <FooterLink to="/terms" label="Terms of Service" />
              <FooterLink to="/privacy" label="Privacy Policy" />
              {isAuthenticated && <FooterLink to="/dashboard" label="Dashboard" />}
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-stone-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} DirectHome. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-stone-500 hover:text-gold-400 transition-colors text-sm">
                Terms
              </Link>
              <Link to="/privacy" className="text-stone-500 hover:text-gold-400 transition-colors text-sm">
                Privacy
              </Link>
              <Link to="/cookies" className="text-stone-500 hover:text-gold-400 transition-colors text-sm">
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
