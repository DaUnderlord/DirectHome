import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePropertyOwnerStore } from '../../store/propertyOwnerStore';
import {
  IconCash,
  IconReceipt,
  IconDownload,
  IconFilter,
  IconArrowLeft,
  IconPlus,
  IconHome,
  IconCalendar,
  IconCheck,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import Container from '../UI/Container';
import { PaymentStatus } from '../../types/propertyOwner';
import NumberField, { toolSelectClass, toolInputClass } from '../UI/NumberField';

const PaymentsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    properties,
    payments,
    expenses,
    financialSummary,
    isLoadingFinancials,
    fetchFinancials,
    fetchProperties,
    sendPaymentReminder,
    addExpense,
  } = usePropertyOwnerStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    propertyId: '',
    category: 'maintenance' as const,
    description: '',
    amount: 0,
    vendor: '',
  });

  useEffect(() => {
    if (!user?.id) return;
    void fetchFinancials(user.id);
    void fetchProperties(user.id);
  }, [user?.id, fetchFinancials, fetchProperties]);

  const askingRent = useMemo(
    () => properties.reduce((sum, property) => sum + (property.pricing?.rentPrice || 0), 0),
    [properties]
  );
  const liveCount = properties.filter((property) => property.status === 'active').length;

  const filteredPayments = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusClass = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-courtyard-700 text-paper-50';
      case PaymentStatus.PENDING:
        return 'bg-paper-200 text-brass-600';
      case PaymentStatus.OVERDUE:
        return 'bg-paper-200 text-laterite-600';
      default:
        return 'bg-paper-200 text-ink-700';
    }
  };

  const handleAddExpense = async () => {
    await addExpense({
      ...newExpense,
      date: new Date(),
    });
    setShowExpenseModal(false);
    setNewExpense({
      propertyId: '',
      category: 'maintenance',
      description: '',
      amount: 0,
      vendor: '',
    });
  };

  const exportListings = () => {
    const header = 'Title,Status,Asking Price,Address';
    const rows = properties.map((property) =>
      [
        `"${(property.basicInfo.title || '').replace(/"/g, '""')}"`,
        property.status,
        property.pricing?.rentPrice || 0,
        `"${(property.location.fullAddress || '').replace(/"/g, '""')}"`,
      ].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'directhome-listings.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoadingFinancials) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-courtyard-700 mx-auto mb-4" />
          <p className="text-ink-600">Loading finances…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100 py-6 sm:py-8 overflow-x-hidden">
      <Container size="xl" className="min-w-0">
        <button
          type="button"
          onClick={() => navigate('/owner')}
          className="flex items-center text-ink-600 hover:text-ink-950 mb-4 text-sm"
        >
          <IconArrowLeft size={18} stroke={1.5} className="mr-2 shrink-0" />
          Back to dashboard
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-courtyard-700 font-semibold mb-2">
              Owner tools
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-950">
              Payments & Finances
            </h1>
            <p className="text-ink-600 mt-2 text-sm max-w-xl">
              Asking prices from your listings. DirectHome is not collecting rent yet — tenant
              payment records will appear here when marketplace payouts launch.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center justify-center px-4 py-2.5 min-h-11 bg-paper-50 border border-paper-300 text-ink-800"
            >
              <IconPlus size={16} className="mr-2" />
              Add expense
            </button>
            <button
              type="button"
              onClick={exportListings}
              className="flex items-center justify-center px-4 py-2.5 min-h-11 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600"
            >
              <IconDownload size={16} className="mr-2" />
              Export listings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-courtyard-700 text-paper-50 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wide text-paper-200">Asking rent</p>
            <p className="font-display text-2xl sm:text-3xl font-semibold mt-1 break-words">
              {formatCurrency(askingRent)}
            </p>
            <p className="text-xs text-paper-200 mt-2">From {properties.length} listing{properties.length === 1 ? '' : 's'}</p>
          </div>
          <div className="bg-paper-50 border border-paper-200 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wide text-ink-500">Rent collected</p>
            <p className="font-display text-2xl sm:text-3xl font-semibold text-ink-950 mt-1">
              {formatCurrency(financialSummary?.totalRentCollected || 0)}
            </p>
          </div>
          <div className="bg-paper-50 border border-paper-200 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wide text-ink-500">Outstanding</p>
            <p className="font-display text-2xl sm:text-3xl font-semibold text-ink-950 mt-1">
              {formatCurrency(financialSummary?.totalOutstanding || 0)}
            </p>
          </div>
          <div className="bg-paper-50 border border-paper-200 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-wide text-ink-500">Live listings</p>
            <p className="font-display text-2xl sm:text-3xl font-semibold text-courtyard-700 mt-1">
              {liveCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-paper-50 border border-paper-200 min-w-0">
            <div className="p-4 sm:p-5 border-b border-paper-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-ink-950">Rent payments</h2>
              <label className="flex items-center gap-2 text-sm text-ink-600">
                <IconFilter size={16} stroke={1.5} />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                  className="min-h-10 px-3 bg-paper-50 border border-paper-300 text-ink-950"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </label>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <IconCash size={40} stroke={1.25} className="mx-auto text-paper-300 mb-3" />
                <h3 className="font-display text-lg font-semibold text-ink-950 mb-2">No rent payments yet</h3>
                <p className="text-ink-600 text-sm max-w-md mx-auto">
                  Tenant payouts are not collected on DirectHome yet. When marketplace rent
                  collection launches, receipts will appear in this list.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-paper-200">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <h3 className="font-medium text-ink-950 break-words">{payment.propertyTitle}</h3>
                        <p className="text-sm text-ink-500">{payment.tenantName}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-medium shrink-0 ${getStatusClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <span className="font-semibold text-ink-950">{formatCurrency(payment.amount)}</span>
                      <span className="inline-flex items-center text-ink-600">
                        <IconCalendar size={14} className="mr-1" />
                        Due {format(new Date(payment.dueDate), 'MMM d, yyyy')}
                      </span>
                      {payment.paidDate && (
                        <span className="inline-flex items-center text-courtyard-700">
                          <IconCheck size={14} className="mr-1" />
                          Paid {format(new Date(payment.paidDate), 'MMM d')}
                        </span>
                      )}
                      {(payment.status === PaymentStatus.PENDING || payment.status === PaymentStatus.OVERDUE) && (
                        <button
                          type="button"
                          onClick={() => sendPaymentReminder(payment.id)}
                          className="text-courtyard-700 hover:text-courtyard-600 font-medium"
                        >
                          Send reminder
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 min-w-0">
            <div className="bg-paper-50 border border-paper-200">
              <div className="p-4 sm:p-5 border-b border-paper-200">
                <h2 className="font-display text-lg font-semibold text-ink-950">Your listings</h2>
              </div>
              {properties.length === 0 ? (
                <div className="p-6 text-center">
                  <IconHome size={32} stroke={1.25} className="mx-auto text-paper-300 mb-2" />
                  <p className="text-sm text-ink-600 mb-3">Add a listing to track asking rent here.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/owner/properties/new')}
                    className="text-sm text-courtyard-700 font-medium"
                  >
                    Add property
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-paper-200">
                  {properties.map((property) => (
                    <li key={property.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/owner/properties/${property.id}`)}
                        className="w-full text-left p-4 hover:bg-paper-100"
                      >
                        <p className="font-medium text-ink-950 truncate">{property.basicInfo.title || 'Untitled'}</p>
                        <p className="text-sm text-ink-600 mt-1">
                          {formatCurrency(property.pricing?.rentPrice || 0)}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-paper-50 border border-paper-200">
              <div className="p-4 sm:p-5 border-b border-paper-200 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink-950">Expenses</h2>
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(true)}
                  className="text-sm text-courtyard-700 font-medium"
                >
                  Add
                </button>
              </div>
              {expenses.length === 0 ? (
                <div className="p-6 text-center">
                  <IconReceipt size={32} stroke={1.25} className="mx-auto text-paper-300 mb-2" />
                  <p className="text-sm text-ink-600">No expenses recorded</p>
                </div>
              ) : (
                <div className="divide-y divide-paper-200">
                  {expenses.slice(0, 6).map((expense) => (
                    <div key={expense.id} className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-ink-950 truncate">{expense.description}</span>
                        <span className="text-laterite-600 font-semibold shrink-0">
                          -{formatCurrency(expense.amount)}
                        </span>
                      </div>
                      <p className="text-xs text-ink-500 mt-1 capitalize">
                        {expense.category} · {format(new Date(expense.date), 'MMM d')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      {showExpenseModal && (
        <div className="fixed inset-0 bg-ink-950/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-paper-50 w-full sm:max-w-md sm:border border-paper-200 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl font-semibold text-ink-950 mb-4">Add expense</h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-ink-800">
                Category
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, category: e.target.value as typeof prev.category }))
                  }
                  className={`${toolSelectClass} mt-1`}
                >
                  <option value="repairs">Repairs</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="utilities">Utilities</option>
                  <option value="insurance">Insurance</option>
                  <option value="taxes">Taxes</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-ink-800">
                Description
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
                  className={`${toolInputClass} mt-1`}
                  placeholder="e.g., Generator service"
                />
              </label>
              <NumberField
                label="Amount"
                prefix="₦"
                value={newExpense.amount}
                min={0}
                onChange={(amount) => setNewExpense((prev) => ({ ...prev, amount }))}
              />
              <label className="block text-sm font-medium text-ink-800">
                Vendor (optional)
                <input
                  type="text"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, vendor: e.target.value }))}
                  className={`${toolInputClass} mt-1`}
                  placeholder="e.g., ABC Repairs"
                />
              </label>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="px-4 py-2.5 min-h-11 border border-paper-300 text-ink-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExpense}
                disabled={!newExpense.description || !newExpense.amount}
                className="px-4 py-2.5 min-h-11 bg-courtyard-700 text-paper-50 hover:bg-courtyard-600 disabled:opacity-50"
              >
                Save expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagement;
