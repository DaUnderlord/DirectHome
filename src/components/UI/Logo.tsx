import React from 'react';
import { Link } from 'react-router-dom';
import PinMark from './PinMark';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  markTarget?: boolean;
  inverted?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', markTarget = false, inverted = false }) => {
  const pinSizes = {
    sm: 'h-8 w-6',
    md: 'h-10 w-8',
    lg: 'h-12 w-9',
  };

  return (
    <Link
      to="/"
      className="flex items-center gap-2 no-underline"
      id={markTarget ? 'dh-logo-target' : undefined}
    >
      <PinMark inverted={inverted} className={`${pinSizes[size]} shrink-0`} />
      <span
        className={`font-display font-semibold text-[1.05rem] sm:text-lg leading-none ${
          inverted ? 'text-paper-50' : 'text-ink-950'
        }`}
      >
        Direct
        <span className={`italic ${inverted ? 'text-paper-200' : 'text-courtyard-700'}`}>Home</span>
      </span>
    </Link>
  );
};

export default Logo;
