import React from 'react';

const CareersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Careers</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Join Our Team</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We're always looking for talented individuals to join our team. If you're passionate about real estate, 
            technology, and making a difference, we'd love to hear from you.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Why Work With Us?</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Opportunity to work on innovative solutions for the real estate industry</li>
            <li>Collaborative and inclusive work environment</li>
            <li>Competitive compensation and benefits</li>
            <li>Professional development and growth opportunities</li>
            <li>Flexible work arrangements</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Open Positions</h2>
          <p className="text-gray-600 mb-6">
            We currently don't have any open positions, but we're always interested in meeting talented people. 
            Send your resume to <a href="mailto:careers@realestate.com" className="text-blue-600 hover:underline">careers@realestate.com</a> 
            and we'll keep you in mind for future opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;