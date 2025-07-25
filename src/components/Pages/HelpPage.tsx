import React, { useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Mock FAQ data
  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      questions: [
        {
          id: 'gs-1',
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Sign Up" button in the top right corner of the homepage. Fill in your details, verify your email address, and you\'re good to go!'
        },
        {
          id: 'gs-2',
          question: 'What are the benefits of creating an account?',
          answer: 'Creating an account allows you to save favorite properties, contact property owners directly, schedule viewings, and receive notifications about new properties that match your criteria.'
        },
        {
          id: 'gs-3',
          question: 'Is it free to create an account?',
          answer: 'Yes, creating an account is completely free. We only charge fees for premium features and services.'
        }
      ]
    },
    {
      id: 'searching',
      title: 'Searching for Properties',
      questions: [
        {
          id: 'search-1',
          question: 'How do I search for properties?',
          answer: 'You can search for properties using the search bar on the homepage or by clicking on the "Search" button in the navigation menu. You can filter properties by location, price, number of bedrooms, and more.'
        },
        {
          id: 'search-2',
          question: 'Can I save my search criteria?',
          answer: 'Yes, if you have an account, you can save your search criteria and receive notifications when new properties that match your criteria are listed.'
        },
        {
          id: 'search-3',
          question: 'How do I filter search results?',
          answer: 'You can filter search results using the filter panel on the search page. You can filter by property type, price range, number of bedrooms and bathrooms, amenities, and more.'
        }
      ]
    },
    {
      id: 'listing',
      title: 'Listing a Property',
      questions: [
        {
          id: 'list-1',
          question: 'How do I list my property?',
          answer: 'To list your property, you need to create an account as a property owner. Once you\'re logged in, click on the "List Property" button in the navigation menu and follow the steps to create your listing.'
        },
        {
          id: 'list-2',
          question: 'Is there a fee for listing a property?',
          answer: 'Basic property listings are free. However, we offer premium listing options for a fee, which include featured placement, more photos, and other benefits.'
        },
        {
          id: 'list-3',
          question: 'How long does it take for my listing to be approved?',
          answer: 'Most listings are approved within 24-48 hours. We review all listings to ensure they meet our quality standards and guidelines.'
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  // Filter questions based on search query
  const filteredCategories = searchQuery
    ? faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqCategories;

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Help Center</h1>
        
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredCategories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
              >
                <h2 className="text-xl font-semibold text-gray-800">{category.title}</h2>
                {expandedCategory === category.id ? (
                  <IconChevronUp size={20} className="text-gray-600" />
                ) : (
                  <IconChevronDown size={20} className="text-gray-600" />
                )}
              </button>
              
              {expandedCategory === category.id && (
                <div className="border-t border-gray-200">
                  {category.questions.map(q => (
                    <div key={q.id} className="border-b border-gray-200 last:border-b-0">
                      <button
                        onClick={() => toggleQuestion(q.id)}
                        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                      >
                        <h3 className="text-lg font-medium text-gray-700">{q.question}</h3>
                        {expandedQuestion === q.id ? (
                          <IconChevronUp size={18} className="text-gray-600" />
                        ) : (
                          <IconChevronDown size={18} className="text-gray-600" />
                        )}
                      </button>
                      
                      {expandedQuestion === q.id && (
                        <div className="px-4 pb-4 pt-0">
                          <p className="text-gray-600">{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Contact Support */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-4">Our support team is here to help you.</p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;