import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            At DirectHome, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Create an account or user profile</li>
            <li>List a property</li>
            <li>Contact other users through our messaging system</li>
            <li>Submit feedback, questions, or comments</li>
            <li>Subscribe to our newsletter or marketing communications</li>
            <li>Participate in surveys, contests, or promotions</li>
          </ul>
          
          <p className="mb-4">
            The types of information we may collect include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Personal identifiers (name, email address, phone number)</li>
            <li>Account credentials</li>
            <li>Profile information</li>
            <li>Property information</li>
            <li>Payment information</li>
            <li>Communications and correspondence</li>
            <li>Device and usage information</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">2. How We Use Your Information</h2>
          <p className="mb-4">
            We may use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our platform</li>
            <li>Process transactions and send related information</li>
            <li>Send administrative messages, updates, and security alerts</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Facilitate communication between users</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            <li>Personalize your experience</li>
            <li>Send promotional communications</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">3. Information Sharing and Disclosure</h2>
          <p className="mb-4">
            We may share your information in the following situations:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>With Other Users:</strong> When you list a property or contact another user, certain information is shared to facilitate the interaction.</li>
            <li><strong>Service Providers:</strong> We may share information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities.</li>
            <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
            <li><strong>With Your Consent:</strong> We may share information with third parties when we have your consent to do so.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">5. Your Rights and Choices</h2>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate or incomplete information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction of processing of your personal information</li>
            <li>Data portability</li>
            <li>Objection to processing of your personal information</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">6. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">7. Children's Privacy</h2>
          <p className="mb-4">
            Our platform is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">8. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">9. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-4">
            Email: privacy@directhome.ng<br />
            Address: 123 Main Street, Lagos, Nigeria
          </p>
          
          <p className="mt-8 text-sm text-gray-600">
            Last Updated: July 15, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;