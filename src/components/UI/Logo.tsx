import React from 'react';
import { Link } from 'react-router-dom';
import pinMark from '../../assets/dh-pin-mark.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  markTarget?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', markTarget = false }) => {
  const pinSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 no-underline"
      id={markTarget ? 'dh-logo-target' : undefined}
    >
      <img
        src={pinMark}
        alt=""
        className={`${pinSizes[size]} object-contain mix-blend-lighten`}
      />
      <span className="font-display font-bold tracking-[0.18em] uppercase text-[11px] sm:text-xs text-stone-100">
        Direct<span className="text-gold-400">Home</span>
      </span>
    </Link>
  );
};

export default Logo;
