import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconChevronDown, IconSearch } from '@tabler/icons-react';
import ContentPage from '../UI/ContentPage';

const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting started',
    questions: [
      {
        id: 'gs-1',
        question: 'How do I create an account?',
        answer:
          'Use Sign Up in the header. Fill in your details, verify your email, and you can save tools and, later, listings.',
      },
      {
        id: 'gs-2',
        question: 'Do I need an account to use the calculators?',
        answer:
          'No. You can fill in the Construction Cost Estimator and Rent Calculator without signing in. Unlocking a full report is ₦399 per tool, per session.',
      },
      {
        id: 'gs-3',
        question: 'Is creating an account free?',
        answer: 'Yes. Accounts are free. We charge ₦399 to unlock calculator results, and later for premium listing features.',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Calculators',
    questions: [
      {
        id: 'tools-1',
        question: 'What do the flagship tools cover?',
        answer:
          'The Construction Cost Estimator prices materials, labour, professional fees, permits, add-ons, contingency, and VAT for Nigerian cities. The Rent Calculator covers affordability, move-in costs, and property comparison.',
      },
      {
        id: 'tools-2',
        question: 'How accurate is the construction estimate?',
        answer:
          'It uses current Nigerian market prices by city tier and finish level. Always get contractor quotes — site conditions and material availability change the real number.',
      },
    ],
  },
  {
    id: 'listings',
    title: 'Listings',
    questions: [
      {
        id: 'list-1',
        question: 'Can I search for properties now?',
        answer:
          'The marketplace is launching soon. Use the calculators today to plan a build or a rent budget.',
      },
      {
        id: 'list-2',
        question: 'Will listing a property cost money?',
        answer:
          'Core listings are planned to be free, with optional paid placement when the marketplace goes live.',
      },
    ],
  },
];

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const filteredCategories = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          questions: category.questions.filter(
            (q) =>
              q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.questions.length > 0)
    : faqCategories;

  return (
    <ContentPage
      meta={{
        title: 'Help Center — DirectHome',
        description: 'Help with DirectHome construction and rent calculators, accounts, and the upcoming property marketplace.',
        path: '/help',
      }}
      eyebrow="Help"
      title={
        <>
          Answers before you{' '}
          <span className="italic text-courtyard-700">need support</span>
        </>
      }
      subtitle="Search common questions about the tools, accounts, and the listings launch."
    >
      <div className="relative mb-8">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
        <input
          type="text"
          placeholder="Search help topics…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-charcoal-950 border border-charcoal-600 text-stone-100 focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
        />
      </div>

      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <div key={category.id} className="rounded-xl border border-charcoal-700/70 overflow-hidden">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <h2 className="text-lg font-semibold text-stone-100">{category.title}</h2>
              <IconChevronDown
                size={18}
                className={`text-stone-500 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`}
              />
            </button>
            {expandedCategory === category.id && (
              <div className="border-t border-charcoal-700/70">
                {category.questions.map((q) => (
                  <div key={q.id} className="border-b border-charcoal-800 last:border-b-0">
                    <button
                      onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <h3 className="text-stone-200 pr-4">{q.question}</h3>
                      <IconChevronDown
                        size={16}
                        className={`text-stone-500 shrink-0 transition-transform ${expandedQuestion === q.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedQuestion === q.id && (
                      <p className="px-4 pb-4 text-sm text-stone-400 leading-relaxed">{q.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-gold-500/20 bg-gold-500/5 p-6 text-center">
        <h2 className="font-semibold text-stone-100 mb-2">Still stuck?</h2>
        <p className="text-stone-400 text-sm mb-4">Write us and we will sort it out.</p>
        <Link
          to="/contact"
          className="inline-flex px-6 py-2.5 rounded-full bg-gold-500 text-charcoal-950 font-semibold hover:bg-gold-400"
        >
          Contact support
        </Link>
      </div>
    </ContentPage>
  );
};

export default HelpPage;
