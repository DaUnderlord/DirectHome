import React from 'react';
import ToolShell from '../UI/ToolShell';
import RentCalculator from '../RentCalculator/RentCalculator';
import plateRent from '../../assets/plate-rent.png';

const ESTIMATOR_FAQ = [
  {
    question: 'How accurate is the rent affordability check?',
    answer:
      'It uses the common 30% rule — your rent should not exceed 30% of gross monthly income — plus Nigerian-specific move-in costs like agency fees and caution deposits.',
  },
  {
    question: 'Do I need an account?',
    answer: 'No. You can fill in both tools without signing in. Unlocking results is ₦399 per tool, per session.',
  },
  {
    question: 'Can I compare multiple properties?',
    answer:
      'Yes. Use the Property Comparison tab to weigh rent, fees, and amenities side by side before you decide.',
  },
  {
    question: 'Does this include Lagos agency fees?',
    answer:
      'The Property Cost tab includes agency commission, legal fees, caution deposit, and service charges typical in Nigerian rentals.',
  },
];

const RentCalculatorPage: React.FC = () => {
  return (
    <ToolShell
      meta={{
        title: 'Rent Calculator Nigeria — Affordability & Move-in Costs',
        description:
          'Rent calculator for Nigeria. Check affordability, total move-in costs, agency fees, and compare properties before you sign a lease. Unlock results for ₦399.',
        path: '/calculator',
      }}
      eyebrow="₦399 to unlock results"
      heroTitle={
        <>
          Rent Calculator for{' '}
          <span className="italic text-courtyard-700">Nigeria</span>
        </>
      }
      heroSubtitle="Know what you can afford, what move-in really costs, and how properties stack up — before you pay an agent."
      heroImage={plateRent}
      faq={ESTIMATOR_FAQ}
    >
      <RentCalculator variant="light" />
    </ToolShell>
  );
};

export default RentCalculatorPage;
