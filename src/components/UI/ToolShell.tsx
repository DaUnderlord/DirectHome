import React from 'react';
import PageHero from './PageHero';
import AdSlot from './AdSlot';
import { usePageMeta } from '../../hooks/usePageMeta';
import heroLagos from '../../assets/hero-lagos-night.png';

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
    <div className="min-h-screen bg-charcoal-950">
      <PageHero
        eyebrow={eyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImage || heroLagos}
        compact
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-16">
        <div className="rounded-2xl border border-white/10 bg-charcoal-900/80 backdrop-blur-xl p-6 md:p-10 dh-tool">
          {children}
        </div>

        <div className="mt-8">
          <AdSlot className="min-h-[100px]" />
        </div>

        {faq && faq.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-100 mb-8">
              Frequently asked questions
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <article
                  key={item.question}
                  className="rounded-xl border border-charcoal-700/50 bg-charcoal-900/50 p-6"
                >
                  <h3 className="font-semibold text-gold-400 mb-2">{item.question}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{item.answer}</p>
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
