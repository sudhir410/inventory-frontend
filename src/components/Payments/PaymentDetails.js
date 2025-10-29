import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPayment } from '../../features/payments/paymentSlice';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Phone,
  Mail,
  FileText,
  DollarSign,
  Receipt,
  CheckCircle,
  Plus,
  Edit,
} from 'lucide-react';

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { payment, loading } = useSelector((state) => state.payments);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        await dispatch(getPayment(id)).unwrap();
      } catch (error) {
        console.error('Error fetching payment:', error);
        toast.error('Failed to load payment details');
        navigate('/payments');
      }
    };

    fetchPayment();
  }, [dispatch, id, navigate]);

  if (loading || !payment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'upi':
        return 'bg-purple-100 text-purple-800';
      case 'bank_transfer':
        return 'bg-indigo-100 text-indigo-800';
      case 'credit':
        return 'bg-yellow-100 text-yellow-800';
      case 'cheque':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/payments"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payments
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{payment.receiptNumber}</h1>
              <p className="text-gray-600">Payment Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                payment.status
              )}`}
            >
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
            <Link
              to={`/payments/${payment._id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Payment
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment & Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Receipt Number</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{payment.receiptNumber}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Payment Amount</label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(payment.amount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Payment Method</label>
                <span
                  className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(
                    payment.paymentMethod
                  )}`}
                >
                  {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Payment Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {payment.reference && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Reference Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{payment.reference}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Recorded On</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {payment.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-500">Notes</label>
                <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{payment.notes}</p>
              </div>
            )}
          </div>

          {/* Customer Information */}
          {payment.customer && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h2>
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {payment.customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <Link
                    to={`/customers/${payment.customer._id}`}
                    className="text-lg font-medium text-gray-900 hover:text-primary-600"
                  >
                    {payment.customer.name}
                  </Link>
                  <p className="text-sm text-gray-500 capitalize">{payment.customer.type} Customer</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payment.customer.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                    <div className="mt-1 flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {payment.customer.phone}
                    </div>
                  </div>
                )}

                {payment.customer.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email Address</label>
                    <div className="mt-1 flex items-center text-sm text-gray-900">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {payment.customer.email}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sales Allocation */}
          {payment.sales && payment.sales.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                Sales Allocation
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sale Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Allocated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payment.sales.map((allocation) => (
                      <tr key={allocation._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/sales/${allocation.sale._id}`}
                            className="text-sm font-medium text-primary-600 hover:text-primary-900"
                          >
                            {allocation.sale.invoiceNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(allocation.sale.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(allocation.sale.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(allocation.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Summary
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Payment Amount</label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(payment.amount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Total Allocated</label>
                <p className="mt-1 text-xl font-semibold text-green-600">
                  {formatCurrency(payment.totalAllocated || 0)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Remaining Amount
                </label>
                <p
                  className={`mt-1 text-xl font-semibold ${
                    payment.remainingAmount > 0 ? 'text-yellow-600' : 'text-gray-900'
                  }`}
                >
                  {formatCurrency(payment.remainingAmount || 0)}
                </p>
                {payment.remainingAmount > 0 && (
                  <p className="mt-1 text-xs text-gray-500">Unallocated amount</p>
                )}
              </div>

              {payment.remainingAmount === 0 && payment.totalAllocated > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <div className="text-sm text-green-700">
                      Fully allocated to {payment.sales.length} sale(s)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {payment.customer && (
                <Link
                  to={`/customers/${payment.customer._id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <User className="h-4 w-4 mr-2" />
                  View Customer
                </Link>
              )}
              <Link
                to="/payments/new"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Payment
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;

