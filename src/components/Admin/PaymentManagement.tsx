import React, { useEffect, useMemo, useState } from 'react';
import { IconRefresh, IconSearch } from '@tabler/icons-react';
import { TOOL_LABELS, TOOL_REPORT_PRICE_NGN, type PaidToolId } from '../../constants/toolPricing';
import { fetchToolPayments, type ToolPaymentRecord } from '../../services/adminPaymentService';

type TabType = 'all' | PaidToolId;

const tabs: { id: TabType; label: string }[] = [
  { id: 'all', label: 'All payments' },
  { id: 'construction-estimator', label: 'Construction estimator' },
  { id: 'rent-calculator', label: 'Rent calculator' },
];

function formatNaira(amount: number) {
  return `₦${Number(amount || 0).toLocaleString('en-NG')}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function toolLabel(toolId: string) {
  return TOOL_LABELS[toolId as PaidToolId] || toolId;
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<ToolPaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const loadPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchToolPayments();
      if (!result.success) {
        setError(result.error || 'Could not load payments.');
        setPayments([]);
        return;
      }
      setPayments(result.payments);
      setWarning(result.warning || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load payments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return payments.filter((payment) => {
      if (activeTab !== 'all' && payment.tool_id !== activeTab) return false;
      if (!query) return true;
      return [
        payment.customer_name,
        payment.customer_email,
        payment.customer_phone,
        payment.tx_ref,
        payment.flutterwave_transaction_id,
        toolLabel(payment.tool_id),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [payments, activeTab, searchQuery]);

  const totalAmount = filtered.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">
            Tool report purchases — name, email, amount, and Flutterwave reference.
          </p>
        </div>
        <button
          type="button"
          onClick={loadPayments}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <IconRefresh size={18} className="mr-2" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Visible payments</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{filtered.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total collected</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatNaira(totalAmount)}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Report price</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatNaira(TOOL_REPORT_PRICE_NGN)}</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const count =
              tab.id === 'all'
                ? payments.length
                : payments.filter((payment) => payment.tool_id === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">{count}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="relative">
        <IconSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, phone, or transaction reference..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {warning && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {warning}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading payments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No tool payments yet.</p>
            <p className="mt-2 text-sm text-gray-500">
              Successful Flutterwave checkouts will appear here with the payer’s name and email.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tool
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((payment) => (
                  <tr key={payment.flutterwave_transaction_id || payment.tx_ref} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.customer_name || '—'}
                      </div>
                      <div className="text-sm text-gray-500">{payment.customer_email}</div>
                      {payment.customer_phone && (
                        <div className="text-sm text-gray-400">{payment.customer_phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {toolLabel(payment.tool_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatNaira(payment.amount)}</div>
                      <div className="text-sm text-gray-500">{payment.payment_type || payment.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'completed' || payment.status === 'successful'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 break-all">{payment.tx_ref}</div>
                      <div className="text-xs text-gray-400">ID {payment.flutterwave_transaction_id}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
