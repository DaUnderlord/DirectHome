import React, { useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FaqPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'How does this platform work?',
      answer: "Our platform connects property seekers directly with property owners, eliminating the need for agents or middlemen. Property owners can list their properties, and seekers can search for properties that meet their criteria. Once they find a property they're interested in, they can contact the owner directly through our messaging system."
    },
    {
      id: 'faq-2',
      question: 'Is it free to use this platform?',
      answer: "Yes, basic use of our platform is free for both property seekers and owners. We offer premium features for property owners who want to enhance their listings and reach more potential tenants or buyers."
    },
    {
      id: 'faq-3',
      question: 'How do I know if a property is legitimate?',
      answer: "We verify all property owners and listings on our platform to ensure legitimacy. Look for the \"Verified\" badge on property listings. Additionally, we recommend scheduling a viewing before making any payments or signing agreements."
    },
    {
      id: 'faq-4',
      question: 'Can I list multiple properties?',
      answer: "Yes, you can list multiple properties on our platform. Each property will have its own listing page and can be managed separately from your dashboard."
    },
    {
      id: 'faq-5',
      question: 'How do I schedule a property viewing?',
      answer: "To schedule a viewing, navigate to the property listing page and click on the \"Schedule Viewing\" button. You'll be able to select a date and time that works for you, and the property owner will receive a notification of your request."
    },
    {
      id: 'faq-6',
      question: 'What payment methods are accepted?',
      answer: "We support various payment methods including credit/debit cards, bank transfers, and mobile money. For property transactions, we recommend using secure payment methods and following our safety guidelines."
    },
    {
      id: 'faq-7',
      question: 'How do I report a problem with a property or user?',
      answer: "If you encounter any issues with a property listing or another user, please use the \"Report\" button on the relevant page or contact our support team directly through the Contact page."
    },
    {
      id: 'faq-8',
      question: 'Can I delete my account?',
      answer: "Yes, you can delete your account at any time from your account settings. Please note that this action is irreversible and will remove all your data from our platform."
    },
    {
      id: 'faq-9',
      question: 'How long does it take for my property listing to be approved?',
      answer: "Most property listings are approved within 24-48 hours. We review all listings to ensure they meet our quality standards and guidelines."
    },
    {
      id: 'faq-10',
      question: 'What happens after I find a property I want to rent or buy?',
      answer: "After finding a property you're interested in, you can contact the owner directly through our messaging system to ask questions or schedule a viewing. If you decide to proceed, you can negotiate terms directly with the owner. We recommend using our document templates for agreements and following our safety guidelines for payments."
    }
  ];

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
                onClick={() => toggleFaq(faq.id)}
              >
                <h2 className="text-lg font-medium text-gray-800">{faq.question}</h2>
                {expandedId === faq.id ? (
                  <IconChevronUp className="text-gray-600" size={20} />
                ) : (
                  <IconChevronDown className="text-gray-600" size={20} />
                )}
              </button>
              {expandedId === faq.id && (
                <div className="p-4 pt-0 border-t border-gray-100">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;