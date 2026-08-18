import React from 'react';
import PageHero from './PageHero';
import { usePageMeta } from '../../hooks/usePageMeta';

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
    <div className="min-h-screen bg-paper-100">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        image={image}
        compact
      />
      <div
        className={`${wide ? 'max-w-6xl' : 'max-w-4xl'} mx-auto px-4 sm:px-6 lg:px-8 md:-mt-8 relative z-20 pb-20`}
      >
        <div className="border border-paper-200 bg-paper-50 p-4 sm:p-6 md:p-10 shadow-folio dh-prose dh-tool">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
