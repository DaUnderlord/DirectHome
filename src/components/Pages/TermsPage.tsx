import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-8 py-8">
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
            To access certain features of our platform, you may be required to register for an account. You agree to provide accurate,
            current, and complete information during the registration process and to update such information to keep it accurate,
            current, and complete.
          </p>
          <p className="mb-4">
            You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify
            us immediately of any unauthorized use of your account or any other breach of security.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">3. Property Listings</h2>
          <p className="mb-4">
            Property owners are solely responsible for the accuracy and completeness of their listings. DirectHome does not verify
            the accuracy of listings, though we reserve the right to review, reject, or remove any listing at our discretion.
          </p>
          <p className="mb-4">
            By posting a property listing, you represent and warrant that you have the right to list the property and that all
            information provided is accurate, complete, and not misleading.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">4. User Conduct</h2>
          <p className="mb-4">
            You agree not to use our platform to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Post false, misleading, or fraudulent content</li>
            <li>Harass, abuse, or harm another person</li>
            <li>Send spam or other unsolicited messages</li>
            <li>Impersonate another person or entity</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Interfere with the proper functioning of the platform</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">5. Fees and Payments</h2>
          <p className="mb-4">
            Some features of our platform may require payment of fees. All fees are non-refundable unless otherwise specified.
            We reserve the right to change our fees at any time with notice to users.
          </p>
          <p className="mb-4">
            DirectHome is not responsible for any transactions between users. We recommend using secure payment methods and
            following our safety guidelines for all transactions.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">6. Intellectual Property</h2>
          <p className="mb-4">
            The content, organization, graphics, design, and other matters related to our platform are protected under applicable
            copyrights, trademarks, and other proprietary rights. Copying, redistribution, use, or publication of any such content
            or any part of our platform is prohibited without our express permission.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">7. Limitation of Liability</h2>
          <p className="mb-4">
            DirectHome is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, and hereby
            disclaim all warranties, including without limitation, implied warranties of merchantability, fitness for a particular
            purpose, or non-infringement.
          </p>
          <p className="mb-4">
            In no event shall DirectHome be liable for any damages (including, without limitation, damages for loss of data or profit,
            or due to business interruption) arising out of the use or inability to use our platform, even if we have been notified
            of the possibility of such damages.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">8. Indemnification</h2>
          <p className="mb-4">
            You agree to indemnify and hold harmless DirectHome, its affiliates, officers, directors, employees, and agents from and
            against any claims, liabilities, damages, losses, and expenses, including without limitation reasonable attorney's fees,
            arising out of or in any way connected with your access to or use of our platform, your violation of these Terms, or your
            violation of any rights of another.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">9. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without
            regard to its conflict of law provisions.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">10. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the
            updated Terms on our platform. Your continued use of our platform after such changes constitutes your acceptance of
            the new Terms.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">11. Contact Information</h2>
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
};

export default TermsPage;