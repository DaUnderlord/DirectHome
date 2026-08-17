import React from 'react';

interface PinMarkProps {
  className?: string;
  inverted?: boolean;
}

const PinMark = React.forwardRef<SVGSVGElement, PinMarkProps>(
  ({ className = '', inverted = false }, ref) => {
    const metal = inverted ? '#F6F1E8' : '#9A7B4F';
    const cut = inverted ? '#17382F' : '#F3EEE4';

    return (
      <svg
        ref={ref}
        viewBox="0 0 64 84"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill={metal}
          d="M32 83c0 0-27-30.2-27-54.5C5 13.3 17.1 1 32 1s27 12.3 27 27.5C59 52.8 32 83 32 83z"
        />
        <circle cx="32" cy="28.5" r="16.2" fill={cut} />
        <path
          fill={metal}
          d="M32 16.2l13.2 10.1v14.4H36.6V32.2h-9.2v8.5H18.8V26.3L32 16.2z"
        />
        <rect x="28.4" y="28.8" width="3.2" height="3.2" fill={cut} />
        <rect x="32.4" y="28.8" width="3.2" height="3.2" fill={cut} />
        <rect x="28.4" y="32.8" width="3.2" height="3.2" fill={cut} />
        <rect x="32.4" y="32.8" width="3.2" height="3.2" fill={cut} />
      </svg>
    );
  }
);

PinMark.displayName = 'PinMark';

export default PinMark;
