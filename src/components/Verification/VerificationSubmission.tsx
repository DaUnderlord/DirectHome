import React from 'react';
import { 
  IconFileText, 
  IconCheck, 
  IconAlertCircle,
  IconShieldCheck
} from '@tabler/icons-react';
import { VerificationDocumentType } from '../../types/verification';

interface VerificationSubmissionProps {
  documents: {
    type: VerificationDocumentType;
    file: File | null;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress: number;
    url: string;
  }[];
  additionalInfo: string;
  termsAccepted: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const VerificationSubmission: React.FC<VerificationSubmissionProps> = ({
  documents,
  additionalInfo,
  termsAccepted,
  onChange
}) => {
  // Document type labels
  const getDocumentTypeLabel = (type: VerificationDocumentType): string => {
    switch (type) {
      case VerificationDocumentType.ID_CARD:
        return 'National ID Card';
      case VerificationDocumentType.PASSPORT:
        return 'Passport';
      case VerificationDocumentType.DRIVERS_LICENSE:
        return 'Driver\'s License';
      case VerificationDocumentType.UTILITY_BILL:
        return 'Utility Bill';
      case VerificationDocumentType.BANK_STATEMENT:
        return 'Bank Statement';
      case VerificationDocumentType.PROPERTY_DEED:
        return 'Property Deed/Title';
      case VerificationDocumentType.TENANCY_AGREEMENT:
        return 'Tenancy Agreement';
      case VerificationDocumentType.OTHER:
        return 'Other Document';
      default:
        return 'Document';
    }
  };
  
  // Group documents by category
  const identityDocs = documents.filter(doc => 
    [VerificationDocumentType.ID_CARD, VerificationDocumentType.PASSPORT, VerificationDocumentType.DRIVERS_LICENSE].includes(doc.type)
  );
  
  const addressDocs = documents.filter(doc => 
    [VerificationDocumentType.UTILITY_BILL, VerificationDocumentType.BANK_STATEMENT].includes(doc.type)
  );
  
  const propertyDocs = documents.filter(doc => 
    [VerificationDocumentType.PROPERTY_DEED, VerificationDocumentType.TENANCY_AGREEMENT].includes(doc.type)
  );
  
  const otherDocs = documents.filter(doc => 
    doc.type === VerificationDocumentType.OTHER
  );
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
      
      <div className="space-y-4">
        <h3 className="text-base font-medium text-gray-900">Uploaded Documents</h3>
        
        {documents.length === 0 ? (
          <div className="p-4 bg-yellow-50 rounded-md">
            <div className="flex items-start">
              <IconAlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                No documents have been uploaded. Please go back and upload the required documents.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {identityDocs.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Identity Documents</h4>
                <div className="space-y-2">
                  {identityDocs.map((doc, index) => (
                    <div 
                      key={`identity-${index}`} 
                      className="flex items-center p-3 border border-gray-200 rounded-md bg-gray-50"
                    >
                      <IconFileText size={16} className="text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">{getDocumentTypeLabel(doc.type)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {addressDocs.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Address Documents</h4>
                <div className="space-y-2">
                  {addressDocs.map((doc, index) => (
                    <div 
                      key={`address-${index}`} 
                      className="flex items-center p-3 border border-gray-200 rounded-md bg-gray-50"
                    >
                      <IconFileText size={16} className="text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">{getDocumentTypeLabel(doc.type)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {propertyDocs.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Property Documents</h4>
                <div className="space-y-2">
                  {propertyDocs.map((doc, index) => (
                    <div 
                      key={`property-${index}`} 
                      className="flex items-center p-3 border border-gray-200 rounded-md bg-gray-50"
                    >
                      <IconFileText size={16} className="text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">{getDocumentTypeLabel(doc.type)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {otherDocs.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Other Documents</h4>
                <div className="space-y-2">
                  {otherDocs.map((doc, index) => (
                    <div 
                      key={`other-${index}`} 
                      className="flex items-center p-3 border border-gray-200 rounded-md bg-gray-50"
                    >
                      <IconFileText size={16} className="text-gray-500 mr-3" />
                      <span className="text-sm text-gray-700">{getDocumentTypeLabel(doc.type)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="pt-4">
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Information (Optional)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={additionalInfo}
            onChange={onChange}
            rows={3}
            placeholder="Add any additional information that might help with the verification process"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={termsAccepted}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                I confirm that all information provided is accurate
              </label>
              <p className="text-gray-500">
                By submitting this verification request, I confirm that all documents and information provided are accurate and authentic. 
                I understand that providing false information may result in account suspension.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-green-50 rounded-md mt-4">
        <div className="flex items-start">
          <IconShieldCheck className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-green-800">What happens next?</h3>
            <p className="mt-1 text-sm text-green-700">
              After submission, our team will review your documents within 1-2 business days. 
              You'll receive a notification once the verification is complete. 
              You can check the status of your verification in your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSubmission;