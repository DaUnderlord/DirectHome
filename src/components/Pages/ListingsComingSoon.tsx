import React from 'react';
import { Link } from 'react-router-dom';
import { IconBuildingSkyscraper, IconCalculator, IconHammer, IconBell } from '@tabler/icons-react';
import PageHero from '../UI/PageHero';
import { usePageMeta } from '../../hooks/usePageMeta';

const ListingsComingSoon: React.FC = () => {
  usePageMeta({
    title: 'Property Listings Coming Soon',
    description:
      'DirectHome property listings are launching soon. Use our Construction Cost Estimator and Rent Calculator while you wait — unlock results for ₦399.',
    path: '/search',
  });

  return (
    <div className="min-h-screen bg-charcoal-950">
      <PageHero
        eyebrow="Marketplace"
        title={
          <>
            Property listings are{' '}
            <span className="text-gold-400">coming soon</span>
          </>
        }
        subtitle="We're building a direct marketplace for Nigerian property — no agents, no middlemen. In the meantime, plan your build and rent budget with our flagship tools."
        image="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1920&h=1080&fit=crop"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
        <div className="rounded-2xl border border-charcoal-700/60 bg-charcoal-900/80 backdrop-blur-xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 mb-6">
            <IconBuildingSkyscraper size={32} className="text-gold-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-100 mb-3">
            Listings launch in progress
          </h2>
          <p className="text-stone-400 max-w-lg mx-auto mb-10 leading-relaxed">
            Owners and seekers will connect here soon. Use our flagship calculators today — they&apos;re
            built for the Nigerian market. Results are ₦399 to unlock.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/construction-estimator"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 text-charcoal-950 font-semibold hover:bg-gold-400 transition-colors"
            >
              <IconHammer size={20} />
              Construction Cost Estimator
            </Link>
            <Link
              to="/calculator"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-charcoal-600 text-stone-200 font-semibold hover:bg-charcoal-800 transition-colors"
            >
              <IconCalculator size={20} />
              Rent Calculator
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-stone-500 text-sm">
            <IconBell size={16} />
            <span>Want early access? Create an account and we&apos;ll notify you at launch.</span>
          </div>
          <Link
            to="/auth/register"
            className="inline-block mt-4 text-gold-400 hover:text-gold-300 font-medium text-sm"
          >
            Register for updates →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingsComingSoon;
