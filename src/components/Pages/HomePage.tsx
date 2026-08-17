import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconHammer,
  IconCalculator,
  IconBuildingSkyscraper,
  IconArrowRight,
  IconShieldCheck,
  IconChartBar,
  IconMapPin,
} from '@tabler/icons-react';
import CinematicHero from '../UI/CinematicHero';
import AdSlot from '../UI/AdSlot';
import { usePageMeta } from '../../hooks/usePageMeta';
import heroLagos from '../../assets/hero-lagos-night.png';
import rentPanel from '../../assets/tool-rent-panel.png';

const HomePage: React.FC = () => {
  usePageMeta({
    title: 'DirectHome — Construction & Rent Calculators for Nigeria',
    description:
      'Construction Cost Estimator and Rent Calculator built for Nigeria. Plan your build budget and rent affordability — unlock results for ₦399. Property listings coming soon.',
    path: '/',
  });

  return (
    <div className="min-h-screen bg-charcoal-950">
      <CinematicHero />

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-14 max-w-xl">
            <p className="text-gold-400 text-[11px] font-semibold tracking-[0.28em] uppercase mb-3">The suite</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-100">
              Flagship tools
            </h2>
            <span className="gold-rule mt-5" />
            <p className="mt-5 text-stone-400">
              Start with real numbers before you sign a lease or break ground.
            </p>
          </div>
        </div>

        <div className="md:hidden">
          {[
            {
              n: '01',
              to: '/construction-estimator',
              title: 'Construction Cost Estimator',
              line: 'Materials, labor, fees, and VAT — priced for Nigeria.',
              image: heroLagos,
            },
            {
              n: '02',
              to: '/calculator',
              title: 'Rent Calculator',
              line: 'Affordability, agency fees, and what you need before keys.',
              image: rentPanel,
            },
          ].map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="relative block h-[72vh] overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${tool.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/55 to-charcoal-950/15" />
              <div className="absolute inset-x-0 bottom-0 p-6 pb-10">
                <p className="text-gold-400 text-[11px] tracking-[0.28em] mb-3">{tool.n}</p>
                <h3 className="font-display text-3xl font-bold text-stone-50 mb-3">{tool.title}</h3>
                <p className="text-stone-300 mb-5 max-w-sm">{tool.line}</p>
                <span className="inline-flex items-center gap-2 text-gold-400 font-semibold">
                  Open tool
                  <IconArrowRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal-900/70 p-8 md:p-10 hover:border-gold-500/35 transition-colors">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-[11px] tracking-[0.22em] uppercase text-gold-500/80 mb-6">01</p>
            <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/25 flex items-center justify-center mb-6">
              <IconHammer size={22} className="text-gold-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-stone-100 mb-3">
              Construction Cost Estimator
            </h3>
            <p className="text-stone-400 leading-relaxed mb-6">
              Step-by-step estimate for bungalows, duplexes, and apartments — materials, labor,
              professional fees, permits, and VAT based on 2024+ Nigerian market prices.
            </p>
            <ul className="space-y-2 mb-8 text-sm text-stone-500">
              <li className="flex items-center gap-2">
                <IconMapPin size={16} className="text-gold-500 shrink-0" />
                Location-tier pricing (Lagos, Abuja, Port Harcourt & more)
              </li>
              <li className="flex items-center gap-2">
                <IconChartBar size={16} className="text-gold-500 shrink-0" />
                Detailed cost breakdown with downloadable report
              </li>
            </ul>
            <Link
              to="/construction-estimator"
              className="inline-flex items-center gap-2 text-gold-400 font-semibold group-hover:gap-3 transition-all"
            >
              Start estimating
              <IconArrowRight size={18} />
            </Link>
          </article>

          <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-charcoal-900/70 p-8 md:p-10 hover:border-gold-500/35 transition-colors">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-[11px] tracking-[0.22em] uppercase text-gold-500/80 mb-6">02</p>
            <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/25 flex items-center justify-center mb-6">
              <IconCalculator size={22} className="text-gold-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-stone-100 mb-3">
              Rent Calculator
            </h3>
            <p className="text-stone-400 leading-relaxed mb-6">
              Check what you can afford, compare properties side-by-side, and understand the full
              cost of renting — agency fees, caution deposit, service charge, and more.
            </p>
            <ul className="space-y-2 mb-8 text-sm text-stone-500">
              <li className="flex items-center gap-2">
                <IconShieldCheck size={16} className="text-gold-500 shrink-0" />
                Affordability check against your income
              </li>
              <li className="flex items-center gap-2">
                <IconChartBar size={16} className="text-gold-500 shrink-0" />
                Property comparison and total move-in cost
              </li>
            </ul>
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 text-gold-400 font-semibold group-hover:gap-3 transition-all"
            >
              Calculate rent
              <IconArrowRight size={18} />
            </Link>
          </article>
        </div>

        <div className="mt-10">
          <AdSlot />
        </div>
      </section>

      <section className="relative border-y border-white/5 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1600&h=900&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-charcoal-950/80" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-gold-400 text-[11px] font-semibold tracking-[0.28em] uppercase mb-4">Marketplace</p>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-gold-500/25 mb-6">
            <IconBuildingSkyscraper size={26} className="text-gold-400" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-100 mb-4">
            Property listings — coming soon
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto mb-8 leading-relaxed">
            We&apos;re building a direct marketplace where owners and seekers connect without
            agents.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-500/40 text-stone-200 text-sm font-medium hover:border-gold-500/50 hover:text-gold-300 transition-colors"
          >
            Learn more
            <IconArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-10 md:gap-6">
            {[
              { index: 'I', label: 'Nigeria-first pricing', desc: 'Rates tuned for local markets' },
              { index: 'II', label: '₦399 per report', desc: 'Pay once to unlock results this session' },
              { index: 'III', label: 'No middlemen', desc: 'Direct connections when listings launch' },
            ].map((item) => (
              <div key={item.label} className="text-center px-4">
                <p className="text-gold-500/70 text-[11px] tracking-[0.28em] mb-3">{item.index}</p>
                <p className="font-display text-lg font-semibold text-stone-100">{item.label}</p>
                <p className="text-sm text-stone-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
