import React, { useEffect } from 'react';
import PinMark from './PinMark';
import { useIntro } from '../../context/IntroContext';

const SplashScreen: React.FC = () => {
  const { phase, beginReveal, complete, skip } = useIntro();

  useEffect(() => {
    if (phase !== 'playing') return;

    const revealTimer = window.setTimeout(beginReveal, 2100);
    return () => window.clearTimeout(revealTimer);
  }, [phase, beginReveal]);

  useEffect(() => {
    const lock = phase === 'playing';
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'revealing') return;
    const doneTimer = window.setTimeout(complete, 1100);
    return () => window.clearTimeout(doneTimer);
  }, [phase, complete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`lookbook-curtain ${phase === 'revealing' ? 'is-lifting' : ''}`}
      role="dialog"
      aria-label="DirectHome introduction"
      aria-live="polite"
      style={{ position: 'fixed', zIndex: 60 }}
    >
      <div className="paper-grain" />
      <div className="cinematic-stage" style={{ position: 'relative' }}>
        <PinMark className="cinematic-pin" />
        <p className="cinematic-wordmark">
          Direct<span>Home</span>
        </p>
        <span className="cinematic-line" />
        <p className="cinematic-kicker">Nigeria · Build · Rent · Direct</p>
      </div>

      <button type="button" className="intro-skip" onClick={skip}>
        Skip
      </button>
    </div>
  );
};

export default SplashScreen;
