import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconUsers,
  IconFileText,
  IconCheck,
  IconX,
  IconEye,
  IconDownload,
  IconFilter,
  IconArrowLeft,
  IconPhone,
  IconMail,
  IconBriefcase,
  IconCurrencyNaira,
  IconShieldCheck
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Container from '../UI/Container';
import { ApplicationStatus, TenantApplication } from '../../types/propertyOwner';

const ApplicationsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    applications,
    isLoadingApplications,
    fetchApplications,
    updateApplicationStatus,
    generateContract
  } = usePropertyOwnerStore();

  const [filter, setFilter] = useState<'all' | 'submitted' | 'under_review' | 'approved' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<TenantApplication | null>(null);
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);

  useEffect(() => {
    fetchApplications(user?.id || 'owner-1');
  }, [user?.id, fetchApplications]);

  const filteredApplications = applications.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const handleGenerateContract = async (applicationId: string) => {
    setIsGeneratingContract(true);
    await generateContract(applicationId);
    setIsGeneratingContract(false);
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.SUBMITTED: return 'bg-yellow-100 text-yellow-700';
      case ApplicationStatus.UNDER_REVIEW: return 'bg-blue-100 text-blue-700';
      case ApplicationStatus.DOCUMENTS_REQUESTED: return 'bg-purple-100 text-purple-700';
      case ApplicationStatus.APPROVED: return 'bg-green-100 text-green-700';
      case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-700';
      case ApplicationStatus.WITHDRAWN: return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoadingApplications) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/owner')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <IconArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenant Applications</h1>
              <p className="text-gray-600 mt-1">Review and manage tenant applications</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <IconFilter size={20} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Applications</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-600">
              {applications.filter(a => a.status === ApplicationStatus.SUBMITTED || a.status === ApplicationStatus.UNDER_REVIEW).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {applications.filter(a => a.status === ApplicationStatus.APPROVED).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {applications.filter(a => a.status === ApplicationStatus.REJECTED).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center">
              <IconUsers size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications</h3>
              <p className="text-gray-500">Tenant applications will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredApplications.map((application) => (
                <div key={application.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{application.applicantName}</h3>
                          <p className="text-sm text-gray-500">{application.propertyTitle}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                            {application.status.replace(/_/g, ' ')}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getVerificationBadge(application.verificationStatus)}`}>
                            <IconShieldCheck size={14} className="mr-1" />
                            {application.verificationStatus}
                          </span>
                        </div>
                      </div>

                      {/* Contact & Employment */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm">
                          <IconPhone size={16} className="text-gray-400 mr-2" />
                          <a href={`tel:${application.applicantPhone}`} className="text-blue-600 hover:underline">
                            {application.applicantPhone}
                          </a>
                        </div>
                        <div className="flex items-center text-sm">
                          <IconMail size={16} className="text-gray-400 mr-2" />
                          <a href={`mailto:${application.applicantEmail}`} className="text-blue-600 hover:underline">
                            {application.applicantEmail}
                          </a>
                        </div>
                        <div className="flex items-center text-sm">
                          <IconBriefcase size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-700">{application.occupation}</span>
                        </div>
                        {application.monthlyIncome && (
                          <div className="flex items-center text-sm">
                            <IconCurrencyNaira size={16} className="text-gray-400 mr-2" />
                            <span className="text-gray-700">
                              {new Intl.NumberFormat('en-NG').format(application.monthlyIncome)}/month
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Documents */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Documents ({application.documents.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {application.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                                doc.verified ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <IconFileText size={16} className="mr-2" />
                              {doc.name}
                              {doc.verified && <IconCheck size={14} className="ml-2" />}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Guarantor */}
                      {application.guarantor && (
                        <div className="p-4 bg-gray-50 rounded-lg mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Guarantor Information</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Name:</span>
                              <span className="ml-2 text-gray-900">{application.guarantor.name}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Relationship:</span>
                              <span className="ml-2 text-gray-900">{application.guarantor.relationship}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Phone:</span>
                              <span className="ml-2 text-gray-900">{application.guarantor.phone}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contract Status */}
                      {application.status === ApplicationStatus.APPROVED && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-2">Contract Status</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={application.contractGenerated ? 'text-green-600' : 'text-gray-500'}>
                              {application.contractGenerated ? '✓' : '○'} Generated
                            </span>
                            <span className={application.contractSignedByTenant ? 'text-green-600' : 'text-gray-500'}>
                              {application.contractSignedByTenant ? '✓' : '○'} Tenant Signed
                            </span>
                            <span className={application.contractSignedByOwner ? 'text-green-600' : 'text-gray-500'}>
                              {application.contractSignedByOwner ? '✓' : '○'} Owner Signed
                            </span>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-4">
                        Applied on {format(new Date(application.createdAt), 'MMMM d, yyyy')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-6">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        <IconEye size={16} className="mr-1" />
                        View Details
                      </button>
                      
                      {(application.status === ApplicationStatus.SUBMITTED || application.status === ApplicationStatus.UNDER_REVIEW) && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(application.id, ApplicationStatus.APPROVED)}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            <IconCheck size={16} className="mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application.id, ApplicationStatus.REJECTED)}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <IconX size={16} className="mr-1" />
                            Reject
                          </button>
                        </>
                      )}

                      {application.status === ApplicationStatus.APPROVED && !application.contractGenerated && (
                        <button
                          onClick={() => handleGenerateContract(application.id)}
                          disabled={isGeneratingContract}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <IconFileText size={16} className="mr-1" />
                          {isGeneratingContract ? 'Generating...' : 'Generate Contract'}
                        </button>
                      )}

                      {application.contractGenerated && (
                        <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                          <IconDownload size={16} className="mr-1" />
                          Download Contract
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ApplicationsManagement;
