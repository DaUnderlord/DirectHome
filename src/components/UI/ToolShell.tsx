import React from 'react';
import PageHero from './PageHero';
import AdSlot from './AdSlot';
import { usePageMeta } from '../../hooks/usePageMeta';

interface ToolShellProps {
  meta: { title: string; description: string; path: string };
  eyebrow: string;
  heroTitle: React.ReactNode;
  heroSubtitle: string;
  heroImage?: string;
  faq?: { question: string; answer: string }[];
  children: React.ReactNode;
}

const ToolShell: React.FC<ToolShellProps> = ({
  meta,
  eyebrow,
  heroTitle,
  heroSubtitle,
  heroImage,
  faq,
  children,
}) => {
  usePageMeta(meta);

  return (
    <div className="min-h-screen bg-paper-100">
      <PageHero
        eyebrow={eyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImage}
        compact
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 md:-mt-8 relative z-20 pb-24 md:pb-16">
        <div className="border border-paper-200 bg-paper-50 p-4 sm:p-6 md:p-10 shadow-folio dh-tool">
          {children}
        </div>

        <div className="mt-8">
          <AdSlot className="min-h-[100px]" />
        </div>

        {faq && faq.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink-950 mb-8">
              Frequently asked questions
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <article
                  key={item.question}
                  className="border border-paper-200 bg-paper-50 p-6"
                >
                  <h3 className="font-semibold text-courtyard-700 mb-2">{item.question}</h3>
                  <p className="text-ink-600 text-sm leading-relaxed">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ToolShell;
