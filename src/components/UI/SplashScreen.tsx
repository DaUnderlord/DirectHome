import React from 'react';
import PinMark from './PinMark';

interface SplashScreenProps {
  phase: 'playing' | 'revealing' | 'done';
  image: string;
  pinRef: React.RefObject<SVGSVGElement | null>;
  bleedRef: React.RefObject<HTMLDivElement | null>;
  onSkip: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  phase,
  image,
  pinRef,
  bleedRef,
  onSkip,
}) => {
  if (phase === 'done') return null;

  const leaving = phase === 'revealing';

  return (
    <>
      <div ref={bleedRef} className="intro-bleed" aria-hidden>
        <img src={image} alt="" />
        <div className="intro-bleed-scrim" />
        <div className="intro-bleed-plan" />
      </div>

      <div
        className="cinematic-stage"
        role="dialog"
        aria-label="DirectHome introduction"
        aria-live="polite"
      >
        <div className={`intro-folio ${leaving ? 'is-leaving' : ''}`}>
          <div className="paper-grain" />
        </div>

        <div className={`cinematic-logo-row ${leaving ? 'is-docking' : ''}`}>
          <div className="intro-stamp" aria-hidden>
            <span className={`intro-ring ${leaving ? 'is-leaving' : ''}`} />
            <span className={`intro-ring intro-ring-late ${leaving ? 'is-leaving' : ''}`} />
          </div>
          <PinMark ref={pinRef} className="cinematic-pin" />
          <p className={`cinematic-wordmark ${leaving ? 'is-leaving' : ''}`}>
            Direct<span>Home</span>
          </p>
        </div>
        <span className={`cinematic-line ${leaving ? 'is-leaving' : ''}`} />
        <p className={`cinematic-kicker ${leaving ? 'is-leaving' : ''}`}>
          Build · Estimate · List
        </p>
      </div>

      <button type="button" className="intro-skip" onClick={onSkip}>
        Skip
      </button>
    </>
  );
};

export default SplashScreen;
