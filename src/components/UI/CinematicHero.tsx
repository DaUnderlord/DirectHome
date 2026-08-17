import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconHammer, IconCalculator } from '@tabler/icons-react';
import pinMark from '../../assets/dh-pin-mark.png';
import heroImage from '../../assets/hero-lagos-night.png';
import { useIntro } from '../../context/IntroContext';

const CinematicHero: React.FC = () => {
  const { phase, beginReveal, complete, skip } = useIntro();
  const pinRef = useRef<HTMLImageElement>(null);

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
    <section className={`cinematic-hero ${phase}`}>
      <div className="cinematic-photo" style={{ backgroundImage: `url(${heroImage})` }} />
      <div className="cinematic-shade" />
      <div className="cinematic-gold" />
      <div className="film-grain" />

      {introActive && (
        <div className="cinematic-stage" aria-hidden={phase === 'done'}>
          <img
            ref={pinRef}
            src={pinMark}
            alt=""
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
      )}

      <div className={`cinematic-copy ${phase !== 'playing' ? 'is-in' : ''}`}>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[4.35rem] font-bold text-stone-50 leading-[1.05] tracking-tight">
          Plan your build.
          <br />
          <span className="text-gold-400">Budget your rent.</span>
        </h1>
        <span className="gold-rule mt-7 mb-6" />
        <p className="text-lg md:text-xl text-stone-300/90 leading-relaxed max-w-2xl">
          Two flagship tools you won&apos;t find anywhere else — a Construction Cost Estimator and
          Rent Calculator tuned for Nigerian prices, locations, and market realities.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/construction-estimator"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold-500 text-charcoal-950 font-semibold hover:bg-gold-400 transition-colors"
          >
            <IconHammer size={18} />
            Estimate Build Cost
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-stone-400/30 text-stone-100 font-semibold hover:border-gold-500/50 hover:text-gold-300 transition-colors backdrop-blur-sm"
          >
            <IconCalculator size={18} />
            Rent Calculator
          </Link>
        </div>
      </div>

      {introActive && (
        <button type="button" className="intro-skip" onClick={skip}>
          Skip
        </button>
      )}
    </section>
  );
};

export default CinematicHero;
