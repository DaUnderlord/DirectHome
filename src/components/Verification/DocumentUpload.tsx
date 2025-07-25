import React, { useState, useRef } from 'react';
import { 
  IconUpload, 
  IconFileText, 
  IconTrash, 
  IconX, 
  IconCheck,
  IconLoader,
  IconAlertCircle
} from '@tabler/icons-react';
import { VerificationDocumentType } from '../../types/verification';

interface DocumentUploadProps {
  documents: {
    type: VerificationDocumentType;
    file: File | null;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress: number;
    url: string;
  }[];
  onUpload: (type: VerificationDocumentType, file: File) => void;
  onRemove: (type: VerificationDocumentType) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  documents, 
  onUpload, 
  onRemove 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<VerificationDocumentType>(VerificationDocumentType.ID_CARD);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Document type options
  const documentTypes = [
    { value: VerificationDocumentType.ID_CARD, label: 'National ID Card' },
    { value: VerificationDocumentType.PASSPORT, label: 'Passport' },
    { value: VerificationDocumentType.DRIVERS_LICENSE, label: 'Driver\'s License' },
    { value: VerificationDocumentType.UTILITY_BILL, label: 'Utility Bill' },
    { value: VerificationDocumentType.BANK_STATEMENT, label: 'Bank Statement' },
    { value: VerificationDocumentType.PROPERTY_DEED, label: 'Property Deed/Title' },
    { value: VerificationDocumentType.TENANCY_AGREEMENT, label: 'Tenancy Agreement' },
    { value: VerificationDocumentType.OTHER, label: 'Other Document' }
  ];
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };
  
  // Process the file
  const handleFile = (file: File) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please select a smaller file.');
      return;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPG, PNG, or PDF file.');
      return;
    }
    
    // Upload the file
    onUpload(selectedDocType, file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Get document status icon
  const getStatusIcon = (status: 'pending' | 'uploading' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return <IconFileText size={16} className="text-gray-500" />;
      case 'uploading':
        return <IconLoader size={16} className="text-blue-500 animate-spin" />;
      case 'success':
        return <IconCheck size={16} className="text-green-500" />;
      case 'error':
        return <IconAlertCircle size={16} className="text-red-500" />;
      default:
        return <IconFileText size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
            Document Type
          </label>
          <select
            id="documentType"
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value as VerificationDocumentType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
          />
          
          <div className="flex flex-col items-center">
            <IconUpload size={36} className="text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, or PDF (max 5MB)
            </p>
          </div>
        </div>
      </div>
      
      {documents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</h3>
          
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div 
                key={`${doc.type}-${index}`} 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
              >
                <div className="flex items-center">
                  {getStatusIcon(doc.status)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {documentTypes.find(t => t.value === doc.type)?.label || 'Document'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.file?.name} ({formatFileSize(doc.file?.size || 0)})
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {doc.status === 'uploading' && (
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-3">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${doc.progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(doc.type);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4 bg-blue-50 rounded-md mt-4">
        <div className="flex items-start">
          <IconCheck className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Document Requirements</h3>
            <ul className="mt-1 text-sm text-blue-700 list-disc pl-5 space-y-1">
              <li>Upload at least one identity document and one address document</li>
              <li>Property owners should also upload proof of ownership</li>
              <li>All documents must be clear and readable</li>
              <li>Documents should be recent (within the last 3 months for utility bills/statements)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;