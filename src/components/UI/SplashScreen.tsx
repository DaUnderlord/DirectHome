import React, { useEffect } from 'react';
import pinMark from '../../assets/dh-pin-mark.png';
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
      className={`intro-curtain ${phase === 'revealing' ? 'is-lifting' : ''}`}
      role="dialog"
      aria-label="DirectHome introduction"
      aria-live="polite"
    >
      <div className="intro-veil" />
      <div className="intro-gold-wash" />
      <div className="film-grain" />

      <div className="intro-mark">
        <div className="intro-pin-glow" />
        <img src={pinMark} alt="" className="intro-pin" />
        <p className="intro-wordmark">
          Direct<span>Home</span>
        </p>
        <span className="intro-line" />
        <p className="intro-kicker">Nigeria · Build · Rent · Direct</p>
      </div>

      <button type="button" className="intro-skip" onClick={skip}>
        Skip
      </button>
    </div>
  );
};

export default SplashScreen;
