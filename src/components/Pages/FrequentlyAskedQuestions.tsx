import React from 'react';

const FrequentlyAskedQuestions: React.FC = () => {
  return (
    <div className="container mx-auto px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-800">How does this platform work?</h2>
            <p className="mt-2 text-gray-600">
              Our platform connects property seekers directly with property owners.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-800">Is it free to use this platform?</h2>
            <p className="mt-2 text-gray-600">
              Yes, basic use of our platform is free for both property seekers and owners.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-800">How do I know if a property is legitimate?</h2>
            <p className="mt-2 text-gray-600">
              We verify all property owners and listings on our platform to ensure legitimacy.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-800">Can I list multiple properties?</h2>
            <p className="mt-2 text-gray-600">
              Yes, you can list multiple properties on our platform.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-800">How do I schedule a property viewing?</h2>
            <p className="mt-2 text-gray-600">
              To schedule a viewing, navigate to the property listing page and click on the Schedule Viewing button.
            </p>
          </div>
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

export default FrequentlyAskedQuestions;