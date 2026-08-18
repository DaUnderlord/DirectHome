import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconHammer,
  IconBuildingSkyscraper,
  IconArrowRight,
  IconChartBar,
  IconMapPin,
} from '@tabler/icons-react';
import CinematicHero from '../UI/CinematicHero';
import AdSlot from '../UI/AdSlot';
import { usePageMeta } from '../../hooks/usePageMeta';
import plateBuild from '../../assets/plate-build.png';
import plateRent from '../../assets/plate-rent.png';

const HomePage: React.FC = () => {
  usePageMeta({
    title: 'DirectHome — Build cost planning for Nigeria',
    description:
      'Plan your build budget before you break ground. Construction cost estimator for Nigerian cities — unlock a full report for ₦399. Property listings coming soon.',
    path: '/',
  });

  return (
    <div className="min-h-screen bg-paper-100">
      <CinematicHero />

      <section className="py-12 md:py-20 bg-paper-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-courtyard-700 text-[11px] font-semibold tracking-[0.28em] uppercase mb-3">The tools</p>
          <h2 className="font-display text-[1.85rem] md:text-5xl font-semibold text-ink-950 max-w-xl leading-tight">
            Plan the cost before you commit.
          </h2>
          <span className="brass-rule mt-6" />
          <p className="mt-5 text-ink-600 max-w-xl">
            Start with a build budget before you pour a foundation.
          </p>
        </div>
      </section>

      <section className="folio-spread">
        <div className="folio-plate">
          <img src={plateBuild} alt="Nigerian bungalow under construction in daylight" />
        </div>
        <div className="folio-essay bg-paper-50">
          <p className="text-courtyard-700 text-[11px] font-semibold tracking-[0.28em] uppercase mb-4">Build</p>
          <h3 className="font-display text-[1.85rem] md:text-4xl font-semibold text-ink-950 mb-4">
            Construction Cost Estimator
          </h3>
          <p className="text-ink-600 leading-relaxed mb-6">
            Materials, labor, professional fees, permits, and VAT — stepped through for bungalows,
            duplexes, and apartments, using current Nigerian market prices.
          </p>
          <ul className="space-y-3 mb-8 text-sm text-ink-600">
            <li className="flex items-start gap-2">
              <IconMapPin size={16} className="text-brass-500 mt-0.5 shrink-0" />
              Location-tier pricing for Lagos, Abuja, Port Harcourt and more
            </li>
            <li className="flex items-start gap-2">
              <IconChartBar size={16} className="text-brass-500 mt-0.5 shrink-0" />
              Full breakdown with a downloadable session report
            </li>
          </ul>
          <Link
            to="/construction-estimator"
            className="inline-flex items-center gap-2 text-courtyard-700 font-semibold hover:gap-3 transition-all"
          >
            <IconHammer size={18} />
            Start estimating
            <IconArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="folio-spread is-reverse">
        <div className="folio-plate">
          <img src={plateRent} alt="Bright Lagos apartment living room" />
        </div>
        <div className="folio-essay bg-paper-100">
          <p className="text-courtyard-700 text-[11px] font-semibold tracking-[0.28em] uppercase mb-4">Marketplace</p>
          <h3 className="font-display text-[1.85rem] md:text-4xl font-semibold text-ink-950 mb-4">
            Listings, next
          </h3>
          <p className="text-ink-600 leading-relaxed mb-6">
            Owners will list directly. Seekers will enquire without an agent in the middle.
            The estimator ships now; public search follows.
          </p>
          <ul className="space-y-3 mb-8 text-sm text-ink-600">
            <li className="flex items-start gap-2">
              <IconMapPin size={16} className="text-brass-500 mt-0.5 shrink-0" />
              Owners can already submit a property for review
            </li>
            <li className="flex items-start gap-2">
              <IconChartBar size={16} className="text-brass-500 mt-0.5 shrink-0" />
              Public listings stay gated until we open search
            </li>
          </ul>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-courtyard-700 font-semibold hover:gap-3 transition-all"
          >
            <IconBuildingSkyscraper size={18} />
            See listing plans
            <IconArrowRight size={18} />
          </Link>
        </div>
      </section>

      <div className="bg-paper-100">
        <AdSlot />
      </div>

      <section className="relative bg-courtyard-800 text-paper-50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'url(/compound-plan.png)', backgroundSize: '640px' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <p className="text-paper-300 text-[11px] font-semibold tracking-[0.28em] uppercase mb-4">Marketplace</p>
          <div className="inline-flex items-center justify-center w-14 h-14 border border-white/20 mb-6">
            <IconBuildingSkyscraper size={26} className="text-paper-50" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Property listings — coming soon
          </h2>
          <p className="text-paper-300 max-w-xl mx-auto mb-8 leading-relaxed">
            A direct marketplace where owners and seekers meet without agents. The tools ship first.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-white/30 text-paper-50 text-sm font-medium hover:bg-white/10 transition-colors rounded-sm"
          >
            Learn more
            <IconArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-paper-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-10 md:gap-6">
            {[
              { label: 'Nigeria-first pricing', desc: 'Rates tuned for local markets' },
              { label: '₦399 per report', desc: 'Pay once to unlock results this session' },
              { label: 'No middlemen', desc: 'Direct connections when listings launch' },
            ].map((item) => (
              <div key={item.label} className="text-center px-4">
                <p className="font-display text-lg font-semibold text-ink-950">{item.label}</p>
                <p className="text-sm text-ink-400 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
