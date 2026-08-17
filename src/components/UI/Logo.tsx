import React from 'react';
import { Link } from 'react-router-dom';
import PinMark from './PinMark';
import { useIntro } from '../../context/IntroContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  markTarget?: boolean;
  inverted?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', markTarget = false, inverted = false }) => {
  const { phase } = useIntro();
  const pinSizes = {
    sm: 'h-9 w-[1.65rem]',
    md: 'h-11 w-8',
    lg: 'h-12 w-9',
  };
  const typeSizes = {
    sm: 'text-[1.02rem]',
    md: 'text-[1.12rem] sm:text-[1.22rem]',
    lg: 'text-[1.28rem]',
  };
  const hidePin = markTarget && phase !== 'done';

  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 no-underline"
      id={markTarget ? 'dh-logo-target' : undefined}
    >
      <span id={markTarget ? 'dh-logo-pin' : undefined} className={hidePin ? 'opacity-0' : ''}>
        <PinMark inverted={inverted} className={`${pinSizes[size]} shrink-0`} />
      </span>
      <span
        className={`font-display font-semibold leading-none tracking-[-0.03em] ${typeSizes[size]} ${
          inverted ? 'text-paper-50' : 'text-ink-950'
        }`}
      >
        Direct
        <span className={`italic tracking-normal ${inverted ? 'text-paper-200' : 'text-courtyard-700'}`}>
          Home
        </span>
      </span>
    </Link>
  );
};

export default Logo;
