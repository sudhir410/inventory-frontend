import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomer } from '../../features/customers/customerSlice';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  Edit,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle,
} from 'lucide-react';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    customer, 
    customerSales,
    customerPayments,
    salesStats,
    paymentStats,
    overallStatus,
    statusMessage,
    loading 
  } = useSelector((state) => state.customers);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        await dispatch(getCustomer(id)).unwrap();
      } catch (error) {
        console.error('Error fetching customer:', error);
        toast.error('Failed to load customer details');
        navigate('/customers');
      }
    };

    fetchCustomer();
  }, [dispatch, id, navigate]);

  if (loading || !customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (!customer.isActive) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  };

  const getCreditStatusColor = () => {
    const outstanding = salesStats ? salesStats.totalOutstanding : customer.outstandingAmount;
    if (outstanding < 0) return 'text-blue-600'; // Customer has credit
    if (outstanding === 0) return 'text-green-600';
    if (customer.creditLimit > 0 && outstanding > customer.creditLimit) {
      return 'text-red-600'; // Over credit limit
    }
    return 'text-yellow-600'; // Has outstanding but within limit
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
              to="/customers"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <p className="text-gray-600">Customer Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor()}`}
            >
              {customer.isActive ? 'Active' : 'Inactive'}
            </span>
            <Link
              to={`/customers/${customer._id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Customer
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{customer.name}</p>
              </div>

              {customer.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {customer.phone}
                  </div>
                </div>
              )}

              {customer.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email Address</label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {customer.email}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Customer Type</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{customer.type}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {customer.address && (customer.address.street || customer.address.city || customer.address.state) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address Information
              </h2>
              <div className="text-sm text-gray-900">
                {customer.address.street && <p>{customer.address.street}</p>}
                <p>
                  {customer.address.city && `${customer.address.city}, `}
                  {customer.address.state && `${customer.address.state} `}
                  {customer.address.zipCode}
                </p>
                {customer.address.country && <p>{customer.address.country}</p>}
              </div>
            </div>
          )}

          {/* Tax & Financial Information */}
          {(customer.gstNumber || customer.panNumber) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Tax & Financial Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.gstNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">GST Number</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{customer.gstNumber}</p>
                  </div>
                )}

                {customer.panNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">PAN Number</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{customer.panNumber}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {customer.notes && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financial Summary
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Total Purchase</label>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {salesStats ? formatCurrency(salesStats.totalAmount || 0) : formatCurrency(customer.totalPurchase || 0)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {(salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) < 0 ? 'Credit Balance' : 'Outstanding Amount'}
                </label>
                <p className={`mt-1 text-2xl font-bold ${getCreditStatusColor()}`}>
                  {salesStats ? (
                    salesStats.totalOutstanding < 0
                      ? formatCurrency(Math.abs(salesStats.totalOutstanding))
                      : formatCurrency(salesStats.totalOutstanding || 0)
                  ) : (
                    customer.outstandingAmount < 0
                      ? formatCurrency(Math.abs(customer.outstandingAmount))
                      : formatCurrency(customer.outstandingAmount || 0)
                  )}
                </p>
                {(salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) < 0 && (
                  <p className="mt-1 text-xs text-gray-500">Customer has overpaid (credit)</p>
                )}
              </div>

              {customer.creditLimit > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Credit Limit</label>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {formatCurrency(customer.creditLimit)}
                  </p>
                  {((salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) > 0) && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Credit Used</span>
                        <span>
                          {(((salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) / customer.creditLimit) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) > customer.creditLimit
                              ? 'bg-red-600'
                              : (salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) > customer.creditLimit * 0.8
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              ((salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) / customer.creditLimit) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {((salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) > 0) && customer.creditLimit > 0 && ((salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) > customer.creditLimit) && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <div className="text-sm text-red-700">
                      Customer has exceeded credit limit by{' '}
                      {formatCurrency((salesStats ? salesStats.totalOutstanding : customer.outstandingAmount) - customer.creditLimit)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Activity
            </h2>
            <div className="space-y-3">
              {customer.lastPurchase && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Purchase</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(customer.lastPurchase).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Customer Since</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {customer.dateOfBirth && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(customer.dateOfBirth).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to={`/sales/new?customer=${customer._id}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Create New Sale
              </Link>
              <Link
                to={`/payments/new?customer=${customer._id}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Payment Status Banner */}
      {salesStats && (
        <div className={`rounded-lg p-6 ${
          overallStatus === 'clear' 
            ? 'bg-green-50 border border-green-200' 
            : overallStatus === 'credit'
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {overallStatus === 'clear' && (
                <div className="flex-shrink-0 text-green-600">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}
              {overallStatus === 'credit' && (
                <DollarSign className="h-8 w-8 text-blue-600" />
              )}
              {overallStatus === 'outstanding' && (
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              )}
              <div className="ml-4">
                <h3 className={`text-lg font-semibold ${
                  overallStatus === 'clear' 
                    ? 'text-green-900' 
                    : overallStatus === 'credit'
                    ? 'text-blue-900'
                    : 'text-yellow-900'
                }`}>
                  {statusMessage}
                </h3>
                <p className={`text-sm ${
                  overallStatus === 'clear' 
                    ? 'text-green-700' 
                    : overallStatus === 'credit'
                    ? 'text-blue-700'
                    : 'text-yellow-700'
                }`}>
                  {salesStats.totalSales} total sales, {salesStats.paidSales} paid, {salesStats.pendingSales} pending
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(salesStats.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sales & Payments Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              className="w-1/2 py-4 px-1 text-center border-b-2 border-primary-500 font-medium text-sm text-primary-600"
            >
              Sales ({customerSales?.length || 0})
            </button>
            <button
              className="w-1/2 py-4 px-1 text-center border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Payments ({customerPayments?.length || 0})
            </button>
          </nav>
        </div>

        {/* Sales List */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">All Sales</h3>
          {customerSales && customerSales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customerSales.map((sale) => (
                    <tr key={sale._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sale.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(sale.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(sale.paid)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        sale.balance < 0 ? 'text-blue-600' : sale.balance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {sale.balance < 0 ? `-${formatCurrency(Math.abs(sale.balance))}` : formatCurrency(sale.balance)}
                        {sale.balance < 0 && <span className="ml-1 text-xs">(Credit)</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          sale.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : sale.paymentStatus === 'overpaid'
                            ? 'bg-blue-100 text-blue-800'
                            : sale.paymentStatus === 'partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sale.paymentStatus.charAt(0).toUpperCase() + sale.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link
                          to={`/sales/${sale._id}`}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          View
                        </Link>
                        <Link
                          to={`/sales/${sale._id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No sales found for this customer</p>
          )}

          {/* Sales Summary */}
          {salesStats && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-xl font-bold text-gray-900">{salesStats.totalSales}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Paid Sales</p>
                <p className="text-xl font-bold text-green-900">{salesStats.paidSales}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Pending Sales</p>
                <p className="text-xl font-bold text-yellow-900">{salesStats.pendingSales}</p>
              </div>
              <div className={`p-4 rounded-lg ${
                salesStats.totalOutstanding < 0 ? 'bg-blue-50' : 'bg-red-50'
              }`}>
                <p className={`text-sm ${
                  salesStats.totalOutstanding < 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {salesStats.totalOutstanding < 0 ? 'Total Credit' : 'Total Outstanding'}
                </p>
                <p className={`text-xl font-bold ${
                  salesStats.totalOutstanding < 0 ? 'text-blue-900' : 'text-red-900'
                }`}>
                  {formatCurrency(Math.abs(salesStats.totalOutstanding))}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Payments List */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">All Payments</h3>
          {customerPayments && customerPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocated To
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customerPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.receiptNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {payment.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {payment.sales && payment.sales.length > 0 ? (
                          <div>
                            {payment.sales.map((allocation, idx) => (
                              <div key={idx}>
                                {allocation.sale?.invoiceNumber || 'Unknown'}: {formatCurrency(allocation.amount)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          'Unallocated'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No payments found for this customer</p>
          )}

          {/* Payment Summary */}
          {paymentStats && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-xl font-bold text-gray-900">{paymentStats.totalPayments}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Amount Received</p>
                <p className="text-xl font-bold text-green-900">{formatCurrency(paymentStats.totalAmount)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;

