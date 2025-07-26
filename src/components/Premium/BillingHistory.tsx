import React, { useEffect } from 'react';
import { 
  IconDownload, 
  IconReceipt, 
  IconCreditCard,
  IconCalendar,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconClock,
  IconRefresh
} from '@tabler/icons-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { TransactionStatus } from '../../types/subscription';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface BillingHistoryProps {
  userId: string;
  className?: string;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({
  userId,
  className = ''
}) => {
  const { 
    transactions, 
    billingHistory,
    fetchTransactions,
    fetchBillingHistory,
    retryFailedPayment,
    isLoading 
  } = useSubscriptionStore();

  useEffect(() => {
    fetchTransactions(userId);
    fetchBillingHistory(userId);
  }, [fetchTransactions, fetchBillingHistory, userId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return <IconCheck size={16} className="text-green-500" />;
      case TransactionStatus.PENDING:
        return <IconClock size={16} className="text-yellow-500" />;
      case TransactionStatus.PROCESSING:
        return <IconRefresh size={16} className="text-blue-500" />;
      case TransactionStatus.FAILED:
        return <IconX size={16} className="text-red-500" />;
      case TransactionStatus.CANCELLED:
        return <IconX size={16} className="text-gray-500" />;
      case TransactionStatus.REFUNDED:
        return <IconRefresh size={16} className="text-purple-500" />;
      default:
        return <IconAlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return 'text-green-600 bg-green-50';
      case TransactionStatus.PENDING:
        return 'text-yellow-600 bg-yellow-50';
      case TransactionStatus.PROCESSING:
        return 'text-blue-600 bg-blue-50';
      case TransactionStatus.FAILED:
        return 'text-red-600 bg-red-50';
      case TransactionStatus.CANCELLED:
        return 'text-gray-600 bg-gray-50';
      case TransactionStatus.REFUNDED:
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleRetryPayment = async (transactionId: string) => {
    await retryFailedPayment(transactionId);
    fetchTransactions(userId);
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!billingHistory) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="text-gray-400 mb-4">
          <IconReceipt size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Billing History</h3>
        <p className="text-gray-600 mb-4">
          Your billing history will appear here once you make a payment.
        </p>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Billing History</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center space-x-2"
        >
          <IconDownload size={16} />
          <span>Export</span>
        </Button>
      </div>

      {/* Upcoming charges */}
      {billingHistory.upcomingCharges.subscriptionRenewal && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <IconCalendar size={16} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Upcoming Renewal</h4>
                <p className="text-sm text-blue-700">
                  {billingHistory.upcomingCharges.subscriptionRenewal.description} on {formatDate(billingHistory.upcomingCharges.subscriptionRenewal.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-900">
                {formatPrice(billingHistory.upcomingCharges.subscriptionRenewal.amount, billingHistory.currency)}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2 text-xs bg-white"
              >
                Update Payment Method
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Payment methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
        {billingHistory.paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {billingHistory.paymentMethods.map((method) => (
              <Card key={method.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <IconCreditCard size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {method.type === 'card' ? (
                          <>
                            {method.metadata.brand} •••• {method.metadata.last4}
                          </>
                        ) : (
                          method.type.replace('_', ' ')
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {method.isDefault && 'Default • '}
                        {method.metadata.name}
                        {method.type === 'card' && method.metadata.expiryMonth && method.metadata.expiryYear && (
                          <> • Expires {method.metadata.expiryMonth}/{method.metadata.expiryYear}</>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    {!method.isDefault && (
                      <Button variant="outline" size="sm">Remove</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" className="w-full">Add Payment Method</Button>
          </div>
        ) : (
          <Card className="p-4 text-center">
            <p className="text-gray-600 mb-4">No payment methods added yet.</p>
            <Button>Add Payment Method</Button>
          </Card>
        )}
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
        {transactions.length > 0 ? (
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1">{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {transaction.status === TransactionStatus.COMPLETED && (
                        <a href="#" className="text-blue-600 hover:text-blue-900">
                          Receipt
                        </a>
                      )}
                      {transaction.status === TransactionStatus.FAILED && (
                        <button 
                          onClick={() => handleRetryPayment(transaction.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="p-4 text-center">
            <p className="text-gray-600">No transactions found.</p>
          </Card>
        )}
      </div>

      {/* Total spent */}
      <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
        <div className="text-gray-700">Total spent</div>
        <div className="text-xl font-bold text-gray-900">
          {formatPrice(billingHistory.totalSpent, billingHistory.currency)}
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;