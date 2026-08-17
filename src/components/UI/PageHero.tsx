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
  image = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop',
  compact = false,
  cinematic = false,
}) => {
  const { phase } = useIntro();
  const revealed = !cinematic || phase !== 'playing';

  return (
    <section
      className={`relative overflow-hidden bg-charcoal-950 ${
        cinematic
          ? 'min-h-[92vh] flex items-end md:items-center pb-16 pt-28 md:pt-24 md:pb-24'
          : compact
            ? 'py-16 md:py-20'
            : 'py-20 md:py-28'
      }`}
    >
      <div
        className={`absolute inset-0 bg-cover bg-center ${cinematic ? 'hero-kenburns' : 'opacity-30'}`}
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/70 via-charcoal-950/78 to-charcoal-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,98,0.16),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(15,20,25,0.55),transparent_45%)]" />
      <div className="film-grain" />

      <div
        className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full hero-copy ${
          revealed ? 'is-revealed' : ''
        }`}
      >
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-gold-400 text-[11px] md:text-sm font-semibold tracking-[0.28em] uppercase mb-5">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-[4.25rem] font-bold text-stone-50 leading-[1.05] tracking-tight">
            {title}
          </h1>
          <span className="gold-rule mt-7 mb-6" />
          <p className="text-lg md:text-xl text-stone-300/90 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
          {children && <div className="mt-10 flex flex-wrap gap-4">{children}</div>}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
