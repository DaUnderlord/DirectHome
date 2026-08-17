import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconHammer, IconCalculator } from '@tabler/icons-react';
import SplashScreen from './SplashScreen';
import heroCourtyard from '../../assets/hero-courtyard-day.png';
import heroVeranda from '../../assets/hero-veranda-day.png';
import heroInterior from '../../assets/hero-interior-court.png';
import { useIntro } from '../../context/IntroContext';

const slides = [
  {
    src: heroCourtyard,
    alt: 'Tropical-modern courtyard house in afternoon light',
  },
  {
    src: heroVeranda,
    alt: 'Covered bungalow veranda opening to a planted compound',
  },
  {
    src: heroInterior,
    alt: 'Living room looking out to a Nigerian courtyard',
  },
];

const CinematicHero: React.FC = () => {
  const { phase, beginReveal, complete, skip } = useIntro();
  const pinRef = useRef<SVGSVGElement>(null);
  const bleedRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const lock = phase !== 'done';
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const t = window.setTimeout(beginReveal, 1200);
    return () => window.clearTimeout(t);
  }, [phase, beginReveal]);

  useEffect(() => {
    if (phase !== 'revealing') return;

    const hero = heroRef.current;
    const bleed = bleedRef.current;
    const plate = plateRef.current;
    if (hero && bleed && plate) {
      const heroBox = hero.getBoundingClientRect();
      const plateBox = plate.getBoundingClientRect();
      const top = Math.max(0, plateBox.top - heroBox.top);
      const right = Math.max(0, heroBox.right - plateBox.right);
      const bottom = Math.max(0, heroBox.bottom - plateBox.bottom);
      const left = Math.max(0, plateBox.left - heroBox.left);
      requestAnimationFrame(() => {
        bleed.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
      });
    }

    const pin = pinRef.current;
    const target = document.getElementById('dh-logo-pin');
    if (pin && target) {
      pin.style.animation = 'none';
      const from = pin.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      const scale = Math.max(0.22, to.height / from.height);
      requestAnimationFrame(() => {
        pin.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      });
    }

    const t = window.setTimeout(complete, 1380);
    return () => window.clearTimeout(t);
  }, [phase, complete]);

  useEffect(() => {
    if (phase !== 'done' || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => {
      setSlide((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(t);
  }, [phase, paused]);

  const introActive = phase !== 'done';

  return (
    <section ref={heroRef} className={`lookbook-hero ${phase}`}>
      <div className="lookbook-paper">
        <div className="paper-grain" />
        <div className="lookbook-plan" />

        <div className={`lookbook-copy ${phase !== 'playing' ? 'is-in' : ''}`}>
          <p className="lookbook-kicker">Built for Nigeria</p>
          <h1 className="font-display text-[2.05rem] sm:text-[2.6rem] md:text-5xl lg:text-[4.15rem] font-semibold text-ink-950 leading-[1.1] tracking-tight">
            Tools for the
            <br />
            <span className="italic text-courtyard-700">Nigerian house.</span>
          </h1>
          <span className="brass-rule mt-6 mb-5 md:mt-7 md:mb-6" />
          <p className="text-base sm:text-lg md:text-xl text-ink-600 leading-relaxed max-w-xl">
            A construction cost estimator and rent calculator priced for Lagos, Abuja, Port Harcourt,
            and the rest of the country — before you break ground or sign a lease.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <Link to="/construction-estimator" className="btn-courtyard justify-center w-full sm:w-auto">
              <IconHammer size={18} />
              Estimate a build
            </Link>
            <Link to="/calculator" className="btn-outline-ink justify-center w-full sm:w-auto">
              <IconCalculator size={18} />
              Rent calculator
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={plateRef}
        className="lookbook-plate"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((item, index) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            className={index === slide ? 'is-active' : ''}
          />
        ))}
        <div className={`plate-index ${phase === 'done' ? 'is-ready' : ''}`} role="tablist" aria-label="Hero photographs">
          {slides.map((item, index) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={index === slide}
              aria-label={`Photograph ${index + 1}`}
              className={index === slide ? 'is-on' : ''}
              onClick={() => setSlide(index)}
            />
          ))}
        </div>
      </div>

      {introActive && (
        <SplashScreen
          phase={phase}
          image={heroCourtyard}
          pinRef={pinRef}
          bleedRef={bleedRef}
          onSkip={skip}
        />
      )}
    </section>
  );
};

export default CinematicHero;
