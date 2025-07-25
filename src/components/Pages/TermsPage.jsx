import React from 'react';

function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms and Conditions</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            Welcome to DirectHome. These Terms and Conditions govern your use of our platform and services.
            By accessing or using DirectHome, you agree to be bound by these Terms. Please read them carefully.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
            If you do not agree to these Terms, please do not use our platform.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">2. User Accounts</h2>
          <p className="mb-4">
            To access certain features of our platform, you may be required to register for an account.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">3. Property Listings</h2>
          <p className="mb-4">
            Property owners are solely responsible for the accuracy and completeness of their listings.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">4. User Conduct</h2>
          <p className="mb-4">
            You agree not to use our platform to post false or misleading content.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">5. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at support@directhome.ng.
          </p>
          
          <p className="mt-8 text-sm text-gray-600">
            Last updated: July 15, 2025
          </p>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;