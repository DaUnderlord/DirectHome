import React from 'react';
import { Link } from 'react-router-dom';
import ContentPage from '../UI/ContentPage';

const faqs = [
  {
    q: 'How does DirectHome work?',
    a: 'Use the Construction Cost Estimator to plan a build with Nigerian prices. Property listings — owner to seeker, no agents — are launching next.',
  },
  {
    q: 'Do I need an account?',
    a: 'No for filling in the estimator. Unlocking a full report is ₦399 per build project. Accounts are free.',
  },
  {
    q: 'Are the calculators accurate?',
    a: 'The estimator uses city-tier material, labour, and fee rates. Treat it as a planning figure and confirm with contractors.',
  },
  {
    q: 'When can I list or search properties?',
    a: 'The marketplace is in progress. You can still create an account so you are ready when listings open.',
  },
  {
    q: 'How do I get in touch?',
    a: 'Use the Contact page, or email norwickprojects@gmail.com.',
  },
];

const FrequentlyAskedQuestions: React.FC = () => {
  return (
    <ContentPage
      meta={{
        title: 'FAQ — DirectHome',
        description: 'Frequently asked questions about DirectHome calculators, pricing, and the upcoming property marketplace.',
        path: '/faq',
      }}
      eyebrow="FAQ"
      title={
        <>
          Straight answers,{' '}
          <span className="italic text-courtyard-700">no agent-speak</span>
        </>
      }
      subtitle="The questions we get most about the tools and the marketplace launch."
    >
      <div className="space-y-4">
        {faqs.map((item) => (
          <article key={item.q} className="rounded-xl border border-charcoal-700/70 p-5">
            <h2 className="font-semibold text-stone-100 mb-2">{item.q}</h2>
            <p className="text-sm text-stone-400 leading-relaxed">{item.a}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <p className="text-stone-400 mb-4">Still have a question?</p>
        <Link
          to="/contact"
          className="inline-flex px-6 py-2.5 rounded-full bg-gold-500 text-charcoal-950 font-semibold hover:bg-gold-400"
        >
          Contact us
        </Link>
      </div>
    </ContentPage>
  );
};

export default FrequentlyAskedQuestions;
