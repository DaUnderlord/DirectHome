import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconTool,
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconUser,
  IconFilter,
  IconArrowLeft,
  IconPlus
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Container from '../UI/Container';
import { MaintenanceStatus, MaintenancePriority } from '../../types/propertyOwner';

const MaintenanceManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    maintenanceRequests,
    isLoadingMaintenance,
    fetchMaintenanceRequests,
    updateMaintenanceStatus,
    assignMaintenance
  } = usePropertyOwnerStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    fetchMaintenanceRequests(user?.id || 'owner-1');
  }, [user?.id, fetchMaintenanceRequests]);

  const filteredRequests = maintenanceRequests.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const handleAssign = async () => {
    if (assignModal && assignee.trim()) {
      await assignMaintenance(assignModal, assignee);
      setAssignModal(null);
      setAssignee('');
    }
  };

  const getPriorityColor = (priority: MaintenancePriority) => {
    switch (priority) {
      case MaintenancePriority.URGENT: return 'bg-red-100 text-red-700 border-red-200';
      case MaintenancePriority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case MaintenancePriority.MEDIUM: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case MaintenancePriority.LOW: return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case MaintenanceStatus.ASSIGNED: return 'bg-blue-100 text-blue-700';
      case MaintenanceStatus.IN_PROGRESS: return 'bg-purple-100 text-purple-700';
      case MaintenanceStatus.COMPLETED: return 'bg-green-100 text-green-700';
      case MaintenanceStatus.CANCELLED: return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoadingMaintenance) {
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
              <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
              <p className="text-gray-600 mt-1">Track and manage property maintenance</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <IconFilter size={20} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {maintenanceRequests.filter(m => m.status === MaintenanceStatus.PENDING).length}
                </p>
              </div>
              <IconClock size={24} className="text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {maintenanceRequests.filter(m => m.status === MaintenanceStatus.IN_PROGRESS || m.status === MaintenanceStatus.ASSIGNED).length}
                </p>
              </div>
              <IconTool size={24} className="text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {maintenanceRequests.filter(m => m.status === MaintenanceStatus.COMPLETED).length}
                </p>
              </div>
              <IconCheck size={24} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Urgent</p>
                <p className="text-2xl font-bold text-red-600">
                  {maintenanceRequests.filter(m => m.priority === MaintenancePriority.URGENT && m.status !== MaintenanceStatus.COMPLETED).length}
                </p>
              </div>
              <IconAlertTriangle size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <IconTool size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests</h3>
              <p className="text-gray-500">Maintenance requests from tenants will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-gray-900">{request.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                              {request.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{request.propertyTitle}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4">{request.description}</p>

                      {/* Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {request.tenantName && (
                          <div className="flex items-center text-gray-500">
                            <IconUser size={16} className="mr-1" />
                            {request.tenantName}
                          </div>
                        )}
                        <div className="flex items-center text-gray-500">
                          <IconClock size={16} className="mr-1" />
                          {format(new Date(request.createdAt), 'MMM d, yyyy')}
                        </div>
                        {request.assignedTo && (
                          <div className="flex items-center text-blue-600">
                            <IconTool size={16} className="mr-1" />
                            Assigned to: {request.assignedTo}
                          </div>
                        )}
                        {request.estimatedCost && (
                          <div className="text-gray-700">
                            Est. Cost: <span className="font-medium">{formatCurrency(request.estimatedCost)}</span>
                          </div>
                        )}
                        {request.actualCost && (
                          <div className="text-green-600">
                            Actual: <span className="font-medium">{formatCurrency(request.actualCost)}</span>
                          </div>
                        )}
                      </div>

                      {/* Images */}
                      {request.images && request.images.length > 0 && (
                        <div className="flex gap-2 mt-4">
                          {request.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`Issue ${i + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 lg:ml-6">
                      {request.status === MaintenanceStatus.PENDING && (
                        <>
                          <button
                            onClick={() => setAssignModal(request.id)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <IconUser size={16} className="mr-1" />
                            Assign
                          </button>
                          <button
                            onClick={() => updateMaintenanceStatus(request.id, MaintenanceStatus.IN_PROGRESS)}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            <IconTool size={16} className="mr-1" />
                            Start Work
                          </button>
                        </>
                      )}
                      {(request.status === MaintenanceStatus.ASSIGNED || request.status === MaintenanceStatus.IN_PROGRESS) && (
                        <button
                          onClick={() => updateMaintenanceStatus(request.id, MaintenanceStatus.COMPLETED)}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <IconCheck size={16} className="mr-1" />
                          Mark Complete
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

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Assign to Worker</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Worker/Artisan Name or Company
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., ABC Repairs Ltd"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setAssignModal(null);
                  setAssignee('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!assignee.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceManagement;
