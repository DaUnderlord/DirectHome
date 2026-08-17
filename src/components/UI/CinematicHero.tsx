import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconHammer, IconCalculator } from '@tabler/icons-react';
import PinMark from './PinMark';
import heroImage from '../../assets/hero-courtyard-day.png';
import { useIntro } from '../../context/IntroContext';

const CinematicHero: React.FC = () => {
  const { phase, beginReveal, complete, skip } = useIntro();
  const pinRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const lock = phase === 'playing';
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const t = window.setTimeout(beginReveal, 2400);
    return () => window.clearTimeout(t);
  }, [phase, beginReveal]);

  useEffect(() => {
    if (phase !== 'revealing') return;

    const pin = pinRef.current;
    const target = document.getElementById('dh-logo-target');
    if (pin && target) {
      pin.style.animation = 'none';
      const from = pin.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      const scale = Math.max(0.28, to.height / from.height);
      requestAnimationFrame(() => {
        pin.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        pin.style.opacity = '0';
      });
    }

    const t = window.setTimeout(complete, 1600);
    return () => window.clearTimeout(t);
  }, [phase, complete]);

  const introActive = phase !== 'done';

  return (
    <section className={`lookbook-hero ${phase}`}>
      <div className="lookbook-paper">
        <div className="paper-grain" />
        <div className="lookbook-plan" />

        <div className={`lookbook-copy ${phase !== 'playing' ? 'is-in' : ''}`}>
          <p className="lookbook-kicker">Built for Nigeria</p>
          <h1 className="font-display text-[2.6rem] md:text-5xl lg:text-[4.15rem] font-semibold text-ink-950 leading-[1.08] tracking-tight">
            Tools for the
            <br />
            <span className="italic text-courtyard-700">Nigerian house.</span>
          </h1>
          <span className="brass-rule mt-7 mb-6" />
          <p className="text-lg md:text-xl text-ink-600 leading-relaxed max-w-xl">
            A construction cost estimator and rent calculator priced for Lagos, Abuja, Port Harcourt,
            and the rest of the country — before you break ground or sign a lease.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/construction-estimator" className="btn-courtyard">
              <IconHammer size={18} />
              Estimate a build
            </Link>
            <Link to="/calculator" className="btn-outline-ink">
              <IconCalculator size={18} />
              Rent calculator
            </Link>
          </div>
        </div>
      </div>

      <div className="lookbook-plate">
        <img src={heroImage} alt="Tropical-modern courtyard house in afternoon light" />
      </div>

      {introActive && (
        <>
          <div className="lookbook-curtain" aria-hidden />
          <div className="cinematic-stage" aria-hidden="true">
            <PinMark
              ref={pinRef}
              className={`cinematic-pin ${phase === 'revealing' ? 'is-docking' : ''}`}
            />
            <p className={`cinematic-wordmark ${phase === 'revealing' ? 'is-leaving' : ''}`}>
              Direct<span>Home</span>
            </p>
            <span className={`cinematic-line ${phase === 'revealing' ? 'is-leaving' : ''}`} />
            <p className={`cinematic-kicker ${phase === 'revealing' ? 'is-leaving' : ''}`}>
              Nigeria · Build · Rent · Direct
            </p>
          </div>
        </>
      )}

      {introActive && (
        <button type="button" className="intro-skip" onClick={skip}>
          Skip
        </button>
      )}
    </section>
  );
};

export default CinematicHero;
