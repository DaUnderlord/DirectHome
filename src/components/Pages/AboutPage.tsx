import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconShieldCheck,
  IconCoin,
  IconHeart,
  IconBulb,
  IconTarget,
  IconHammer,
  IconCalculator,
} from '@tabler/icons-react';
import PageHero from '../UI/PageHero';
import { usePageMeta } from '../../hooks/usePageMeta';
import courtyard from '../../assets/hero-courtyard-day.png';
import plateRent from '../../assets/plate-rent.png';

const teamMembers = [
  {
    name: 'Segun Owele',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Licensed architect with 10+ years helping families and Nigerians in the diaspora find and build homes.',
  },
  {
    name: 'Abiodun Owele',
    role: 'Business Analyst & Co-founder',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?auto=format&fit=crop&w=600&q=80',
    bio: 'Focused on data and strategy to scale Nigeria’s most trusted direct-to-owner housing platform.',
  },
  {
    name: 'Dennis Ogi',
    role: 'CTO / Head of IT',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    bio: 'Building the product that connects renters and owners without agents in the middle.',
  },
];

const values = [
  {
    icon: IconShieldCheck,
    title: 'Trust & Transparency',
    description: 'Honest listings and clear numbers. What you see is what you get.',
  },
  {
    icon: IconCoin,
    title: 'Cost Efficiency',
    description: 'Cut out middlemen and plan with real Nigerian market prices.',
  },
  {
    icon: IconHeart,
    title: 'User-Centric',
    description: 'Every feature is built around how people actually rent and build here.',
  },
  {
    icon: IconBulb,
    title: 'Innovation',
    description: 'Tools first — then a marketplace that makes property simpler.',
  },
];

const AboutPage: React.FC = () => {
  usePageMeta({
    title: 'About DirectHome',
    description:
      'DirectHome is building a Nigeria-first platform to plan construction costs, check rent affordability, and connect owners with seekers — without agents.',
    path: '/about',
  });

  return (
    <div className="min-h-screen bg-paper-100">
      <PageHero
        eyebrow="About"
        title={
          <>
            Built for how Nigeria{' '}
            <span className="italic text-courtyard-700">actually houses people</span>
          </>
        }
        subtitle="We connect seekers directly with homeowners and give you the numbers to plan a build or a lease — without the agent markup."
        image={courtyard}
      >
        <Link to="/construction-estimator" className="btn-courtyard">
          <IconHammer size={18} />
          Estimate a build
        </Link>
        <Link to="/calculator" className="btn-outline-ink">
          <IconCalculator size={18} />
          Check rent
        </Link>
      </PageHero>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-courtyard-700 text-[11px] tracking-[0.28em] uppercase mb-4">Mission</p>
              <div className="flex items-center mb-4">
                <IconTarget className="w-7 h-7 text-brass-500 mr-3" />
                <h2 className="font-display text-3xl font-semibold text-ink-950">Why DirectHome exists</h2>
              </div>
              <p className="text-ink-600 leading-relaxed mb-5">
                Quality housing should not require opaque fees and a house agent in every conversation.
                We started with two tools people actually need — a construction cost estimator and a rent
                calculator — and we are building a direct marketplace next.
              </p>
              <p className="text-ink-400 leading-relaxed">
                The long-term goal is simple: owners and seekers meet here, with clear numbers and no middlemen.
              </p>
            </div>
            <div className="relative">
              <img
                src={plateRent}
                alt="Interior of a home"
                className="w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-5 -left-4 w-16 h-16 bg-courtyard-700 flex items-center justify-center">
                <IconHeart className="w-8 h-8 text-paper-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-paper-200 bg-paper-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold text-ink-950 mb-3">What we stand for</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">Principles that shape the product.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => (
              <article
                key={value.title}
                className="border border-paper-200 bg-paper-50 p-6"
              >
                <div className="w-12 h-12 border border-paper-300 flex items-center justify-center mb-5">
                  <value.icon className="w-6 h-6 text-courtyard-700" />
                </div>
                <h3 className="font-semibold text-ink-950 mb-2">{value.title}</h3>
                <p className="text-sm text-ink-600 leading-relaxed">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold text-ink-950 mb-3">The team</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              A small group building a Nigeria-first housing platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="border border-paper-200 bg-paper-50 overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-ink-950">{member.name}</h3>
                  <p className="text-courtyard-700 text-sm mb-3">{member.role}</p>
                  <p className="text-sm text-ink-600 leading-relaxed">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
