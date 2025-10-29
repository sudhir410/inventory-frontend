import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSale } from '../../features/sales/saleSlice';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Printer, Download, Eye, CreditCard } from 'lucide-react';

const SaleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sale, loading } = useSelector((state) => state.sales);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        await dispatch(getSale(id)).unwrap();
      } catch (error) {
        console.error('Error fetching sale details:', error);
        toast.error('Failed to load sale details');
        navigate('/sales');
      }
    };

    fetchSale();
  }, [dispatch, id, navigate]);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overpaid':
        return 'bg-blue-100 text-blue-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="bg-white shadow rounded-lg p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">Sale not found</h3>
        <p className="text-gray-500">The sale you're looking for doesn't exist.</p>
        <Link
          to="/sales"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Back to Sales
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/sales"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sales
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sale Details</h1>
              <p className="text-gray-600">Invoice: {sale.invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <Link
              to={`/sales/${sale._id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Invoice */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Invoice Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-gray-600">{sale.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-medium text-gray-900">
                {new Date(sale.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bill To</h3>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">{sale.customer.name}</p>
                {sale.customer.email && <p>{sale.customer.email}</p>}
                {sale.customer.phone && <p>{sale.customer.phone}</p>}
                {sale.customer.address && (
                  <p>
                    {sale.customer.address.street && <>{sale.customer.address.street}<br /></>}
                    {sale.customer.address.city && `${sale.customer.address.city}, `}
                    {sale.customer.address.state && `${sale.customer.address.state} `}
                    {sale.customer.address.zipCode}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sale Information</h3>
              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium capitalize">{sale.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(sale.paymentStatus)}`}>
                    {sale.paymentStatus.charAt(0).toUpperCase() + sale.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="px-6 py-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sale.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.product.sku}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ₹{item.discount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    ₹{item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{sale.subtotal.toFixed(2)}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Discount:</span>
                    <span>-₹{sale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-green-600">
                  <span>Tax:</span>
                  <span>₹{sale.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{sale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Paid:</span>
                  <span>₹{sale.paid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Balance:</span>
                  <span className={sale.balance > 0 ? 'text-red-600' : 'text-green-600'}>
                    ₹{sale.balance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {sale.notes && (
          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
            <p className="text-sm text-gray-600">{sale.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <p>Created by: {sale.createdBy?.name || 'N/A'}</p>
              <p>Created at: {new Date(sale.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p>Thank you for your business!</p>
              <p>Hardware Shop Inventory Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {sale.balance > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Outstanding Payment</h3>
              <p className="text-gray-600">
                This sale has an outstanding balance of ₹{sale.balance.toFixed(2)}
              </p>
            </div>
            <Link
              to={`/payments/new?customer=${sale.customer._id}&sale=${sale._id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Record Payment
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleDetails;
