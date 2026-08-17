import React from 'react';
import PageHero from './PageHero';
import { usePageMeta } from '../../hooks/usePageMeta';
import heroLagos from '../../assets/hero-lagos-night.png';

interface ContentPageProps {
  meta: { title: string; description: string; path: string };
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  image?: string;
  children: React.ReactNode;
  wide?: boolean;
}

const ContentPage: React.FC<ContentPageProps> = ({
  meta,
  eyebrow,
  title,
  subtitle,
  image,
  children,
  wide = false,
}) => {
  usePageMeta(meta);

  return (
    <div className="min-h-screen bg-charcoal-950">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        image={image || heroLagos}
        compact
      />
      <div
        className={`${wide ? 'max-w-6xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20`}
      >
        <div className="rounded-2xl border border-white/10 bg-charcoal-900/80 backdrop-blur-xl p-6 md:p-10 dh-prose">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
