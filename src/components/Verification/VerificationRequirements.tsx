import React from 'react';
import { 
  IconShieldCheck, 
  IconFileText, 
  IconHome, 
  IconId, 
  IconMapPin, 
  IconClock,
  IconInfoCircle
} from '@tabler/icons-react';

const VerificationRequirements: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Verification Requirements</h2>
      
      <div className="p-4 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <IconInfoCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Why verification is important</h3>
            <p className="mt-1 text-sm text-blue-700">
              Verification helps build trust between property owners and seekers. 
              Verified owners receive a trust badge, higher visibility in search results, 
              and access to premium features.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <IconId className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-base font-medium text-gray-900">Identity Verification</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Provide one of the following government-issued ID documents:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
              <li>National ID Card</li>
              <li>International Passport</li>
              <li>Driver's License</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <IconMapPin className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-base font-medium text-gray-900">Address Verification</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Provide one of the following documents showing your current address:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
              <li>Utility Bill (not older than 3 months)</li>
              <li>Bank Statement (not older than 3 months)</li>
              <li>Government-issued document with address</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <IconHome className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-base font-medium text-gray-900">Property Ownership</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              For property owners, provide one of the following:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
              <li>Property Deed or Title</li>
              <li>Property Tax Receipt</li>
              <li>Rental Agreement (if you're a property manager)</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <IconFileText className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-base font-medium text-gray-900">Document Requirements</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
              <li>Clear, readable images or scans</li>
              <li>All four corners visible</li>
              <li>File formats: JPG, PNG, or PDF</li>
              <li>Maximum file size: 5MB per document</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Verification Process</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium mt-0.5 mr-3">
              1
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900">Document Submission</h4>
              <p className="text-sm text-gray-600">
                Upload the required documents in the next step.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium mt-0.5 mr-3">
              2
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900">Review Process</h4>
              <p className="text-sm text-gray-600">
                Our team will review your documents within 1-2 business days.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium mt-0.5 mr-3">
              3
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900">Verification Status</h4>
              <p className="text-sm text-gray-600">
                You'll be notified via email and in-app notification once verification is complete.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium mt-0.5 mr-3">
              4
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900">Start Listing</h4>
              <p className="text-sm text-gray-600">
                Once verified, you can immediately start listing your properties.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-50 rounded-md mt-6">
        <div className="flex items-start">
          <IconClock className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Processing Time</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Verification typically takes 1-2 business days. You'll be able to track the status of your verification in your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequirements;