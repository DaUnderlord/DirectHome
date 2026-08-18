import React from 'react';
import { Link } from 'react-router-dom';
import { IconBuildingSkyscraper, IconCalculator, IconHammer, IconBell } from '@tabler/icons-react';
import PageHero from '../UI/PageHero';
import { usePageMeta } from '../../hooks/usePageMeta';
import courtyard from '../../assets/hero-courtyard-day.png';

const ListingsComingSoon: React.FC = () => {
  usePageMeta({
    title: 'Property Listings Coming Soon',
    description:
      'DirectHome property listings are launching soon. Use the Construction Cost Estimator while you wait — unlock a report for ₦399.',
    path: '/search',
  });

  return (
    <div className="min-h-screen bg-paper-100">
      <PageHero
        eyebrow="Marketplace"
        title={
          <>
            Property listings are{' '}
            <span className="italic text-courtyard-700">coming soon</span>
          </>
        }
        subtitle="We're building a direct marketplace for Nigerian property — no agents, no middlemen. In the meantime, plan a build with the estimator. Owners can already submit a listing for review."
        image={courtyard}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
        <div className="border border-paper-200 bg-paper-50 shadow-folio p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-paper-300 mb-6">
            <IconBuildingSkyscraper size={32} className="text-courtyard-700" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink-950 mb-3">
            Listings launch in progress
          </h2>
          <p className="text-ink-600 max-w-lg mx-auto mb-10 leading-relaxed">
            Owners and seekers will connect here soon. Use the Construction Cost Estimator today.
            Results are ₦399 to unlock.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link to="/construction-estimator" className="btn-courtyard justify-center">
              <IconHammer size={20} />
              Construction Cost Estimator
            </Link>
            <Link to="/auth/register" className="btn-outline-ink justify-center">
              <IconCalculator size={20} />
              List as an owner
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-ink-400 text-sm">
            <IconBell size={16} />
            <span>Want early access? Create an account and we&apos;ll notify you at launch.</span>
          </div>
          <Link
            to="/auth/register"
            className="inline-block mt-4 text-courtyard-700 hover:text-courtyard-600 font-medium text-sm"
          >
            Register for updates →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingsComingSoon;
