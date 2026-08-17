import React from 'react';
import ContentPage from '../UI/ContentPage';

const CareersPage: React.FC = () => {
  return (
    <ContentPage
      meta={{
        title: 'Careers at DirectHome',
        description: 'Join DirectHome — we are building Nigeria-first housing tools and a direct marketplace without agents.',
        path: '/careers',
      }}
      eyebrow="Careers"
      title={
        <>
          Help us take the agent out of{' '}
          <span className="italic text-courtyard-700">housing</span>
        </>
      }
      subtitle="We are a small team. If you care about real estate, product, and Nigeria, we want to hear from you."
    >
      <div className="space-y-10">
        <section>
          <h2 className="font-display text-2xl font-bold text-stone-100 mb-3">Why work here</h2>
          <ul className="space-y-2 text-stone-400">
            <li>— Ship tools people in Lagos, Abuja, and beyond actually use</li>
            <li>— Small team, real ownership, no agency layers</li>
            <li>— Competitive pay and room to grow with the product</li>
            <li>— Flexible work arrangements</li>
          </ul>
        </section>

        <section className="rounded-xl border border-charcoal-700/70 bg-charcoal-950/50 p-6">
          <h2 className="font-display text-2xl font-bold text-stone-100 mb-3">Open roles</h2>
          <p className="text-stone-400 leading-relaxed">
            No listed openings right now — we still want to meet strong people. Send a short note and your
            resume to{' '}
            <a href="mailto:norwickprojects@gmail.com" className="text-gold-400 hover:text-gold-300">
              norwickprojects@gmail.com
            </a>{' '}
            and we will keep you in mind.
          </p>
        </section>
      </div>
    </ContentPage>
  );
};

export default CareersPage;
