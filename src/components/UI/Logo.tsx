import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = false }) => {
  const logoSizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  const textClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <Link to="/" className="flex items-center space-x-2 no-underline">
      <img 
        src={logoImage} 
        alt="Logo" 
        className={`${logoSizes[size]}`}
      />
      {withText && (
        <span className={`font-bold text-gray-900 ${textClasses[size]}`}>
          Real Estate
        </span>
      )}
    </Link>
  );
};

export default Logo;