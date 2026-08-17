import React from 'react';
import { useIntro } from '../../context/IntroContext';

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle: string;
  children?: React.ReactNode;
  image?: string;
  compact?: boolean;
  cinematic?: boolean;
}

const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  subtitle,
  children,
  image = '/hero-courtyard-day.png',
  compact = false,
  cinematic = false,
}) => {
  const { phase } = useIntro();
  const revealed = !cinematic || phase !== 'playing';

  return (
    <section className={`page-folio ${compact ? 'page-folio-compact' : ''}`}>
      <div className="page-folio-copy">
        <div className="paper-grain" />
        <div className={`relative z-10 max-w-xl hero-copy ${revealed ? 'is-revealed' : ''}`}>
          {eyebrow && (
            <p className="text-courtyard-700 text-[11px] md:text-sm font-semibold tracking-[0.28em] uppercase mb-5">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[3.6rem] font-semibold text-ink-950 leading-[1.12] tracking-tight">
            {title}
          </h1>
          <span className="brass-rule mt-7 mb-6" />
          <p className="text-lg md:text-xl text-ink-600 leading-relaxed">
            {subtitle}
          </p>
          {children && <div className="mt-10 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
      <div className="page-folio-plate">
        <img src={image} alt="" />
      </div>
    </section>
  );
};

export default PageHero;
