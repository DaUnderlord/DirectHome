import React from 'react';

interface PinMarkProps {
  className?: string;
  inverted?: boolean;
}

const PinMark = React.forwardRef<SVGSVGElement, PinMarkProps>(
  ({ className = '', inverted = false }, ref) => {
    const pin = inverted ? '#F6F1E8' : '#1F4A3E';
    const house = inverted ? '#1A3D34' : '#F3EEE4';

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
          fill={pin}
          d="M32 83c0 0-26-29.4-26-54.2C6 13.6 17.6 2 32 2s26 11.6 26 26.8C58 53.6 32 83 32 83z"
        />
        <path
          fill={house}
          d="M32 14.8L46.4 26.6V42.2h-8.6V31.2H26.2v11H17.6V26.6L32 14.8z"
        />
      </svg>
    );
  }
);

PinMark.displayName = 'PinMark';

export default PinMark;
