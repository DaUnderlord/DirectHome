import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconCash,
  IconReceipt,
  IconAlertTriangle,
  IconCheck,
  IconDownload,
  IconBell,
  IconFilter,
  IconArrowLeft,
  IconPlus,
  IconTrendingUp,
  IconCalendar
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Container from '../UI/Container';
import { PaymentStatus } from '../../types/propertyOwner';

const PaymentsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    payments,
    expenses,
    financialSummary,
    isLoadingFinancials,
    fetchFinancials,
    sendPaymentReminder,
    addExpense
  } = usePropertyOwnerStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    propertyId: '',
    category: 'maintenance' as const,
    description: '',
    amount: 0,
    vendor: ''
  });

  useEffect(() => {
    fetchFinancials(user?.id || 'owner-1');
  }, [user?.id, fetchFinancials]);

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID: return 'bg-green-100 text-green-700';
      case PaymentStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case PaymentStatus.OVERDUE: return 'bg-red-100 text-red-700';
      case PaymentStatus.PARTIAL: return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddExpense = async () => {
    await addExpense({
      ...newExpense,
      date: new Date()
    });
    setShowExpenseModal(false);
    setNewExpense({
      propertyId: '',
      category: 'maintenance',
      description: '',
      amount: 0,
      vendor: ''
    });
  };

  if (isLoadingFinancials) {
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
              <h1 className="text-3xl font-bold text-gray-900">Payments & Finances</h1>
              <p className="text-gray-600 mt-1">Track rent payments and expenses</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => setShowExpenseModal(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <IconPlus size={18} className="mr-2" />
                Add Expense
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <IconDownload size={18} className="mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        {financialSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <IconCash size={24} />
                <IconTrendingUp size={20} />
              </div>
              <p className="text-green-100 text-sm">Total Collected</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.totalRentCollected)}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <IconAlertTriangle size={24} />
              </div>
              <p className="text-orange-100 text-sm">Outstanding</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.totalOutstanding)}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <IconReceipt size={24} />
              </div>
              <p className="text-red-100 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.totalExpenses)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <IconTrendingUp size={24} />
              </div>
              <p className="text-blue-100 text-sm">Net Income</p>
              <p className="text-2xl font-bold">{formatCurrency(financialSummary.netIncome)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <IconCheck size={24} />
              </div>
              <p className="text-purple-100 text-sm">Occupancy Rate</p>
              <p className="text-2xl font-bold">{financialSummary.occupancyRate}%</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Rent Payments</h2>
                <div className="flex items-center space-x-2">
                  <IconFilter size={18} className="text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as typeof filter)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {filteredPayments.length === 0 ? (
                <div className="p-12 text-center">
                  <IconCash size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payments</h3>
                  <p className="text-gray-500">Payment records will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{payment.propertyTitle}</h3>
                          <p className="text-sm text-gray-500">{payment.tenantName}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-sm">
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <span className="ml-2 font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                          </div>
                          <div className="flex items-center">
                            <IconCalendar size={14} className="text-gray-400 mr-1" />
                            <span className="text-gray-500">Due:</span>
                            <span className="ml-1 text-gray-700">{format(new Date(payment.dueDate), 'MMM d, yyyy')}</span>
                          </div>
                          {payment.paidDate && (
                            <div className="flex items-center">
                              <IconCheck size={14} className="text-green-500 mr-1" />
                              <span className="text-green-600">Paid {format(new Date(payment.paidDate), 'MMM d')}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {payment.status === PaymentStatus.PENDING || payment.status === PaymentStatus.OVERDUE ? (
                            <button
                              onClick={() => sendPaymentReminder(payment.id)}
                              className="flex items-center px-3 py-1 text-sm border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50"
                            >
                              <IconBell size={14} className="mr-1" />
                              Remind
                            </button>
                          ) : null}
                          {payment.receiptUrl && (
                            <button className="flex items-center px-3 py-1 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
                              <IconDownload size={14} className="mr-1" />
                              Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expenses */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
              </div>

              {expenses.length === 0 ? (
                <div className="p-8 text-center">
                  <IconReceipt size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No expenses recorded</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {expenses.slice(0, 5).map((expense) => (
                    <div key={expense.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{expense.description}</span>
                        <span className="text-red-600 font-semibold">-{formatCurrency(expense.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 capitalize">{expense.category}</span>
                        <span className="text-gray-400">{format(new Date(expense.date), 'MMM d')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add New Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Expense</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as typeof prev.category }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="repairs">Repairs</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="utilities">Utilities</option>
                  <option value="insurance">Insurance</option>
                  <option value="taxes">Taxes</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., AC Repair"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  value={newExpense.amount || ''}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor (Optional)</label>
                <input
                  type="text"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, vendor: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., ABC Repairs Ltd"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExpenseModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                disabled={!newExpense.description || !newExpense.amount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagement;
