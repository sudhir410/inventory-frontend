import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const CustomerCard = ({ customer, onToggleStatus }) => {
  const [showActions, setShowActions] = useState(false);

  const getCreditStatusColor = (customer) => {
    if (customer.outstandingAmount < 0) return 'text-blue-600'; // Overpaid (credit)
    if (customer.outstandingAmount === 0) return 'text-green-600';
    if (customer.creditLimit > 0 && customer.outstandingAmount > customer.creditLimit) {
      return 'text-red-600';
    }
    return 'text-yellow-600';
  };

  const getCreditStatusText = (customer) => {
    if (customer.outstandingAmount < 0) return 'Extra Payment'; // Overpaid
    if (customer.outstandingAmount === 0) return 'Clear';
    if (customer.outstandingAmount > 0) return 'Balance'; // Has outstanding
    return 'Clear';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Customer Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{customer.type} Customer</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <Link
                    to={`/customers/${customer._id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowActions(false)}
                  >
                    <Eye className="mr-3 h-4 w-4" />
                    View Details
                  </Link>
                  <Link
                    to={`/customers/${customer._id}/edit`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowActions(false)}
                  >
                    <Edit className="mr-3 h-4 w-4" />
                    Edit Customer
                  </Link>
                  <button
                    onClick={() => {
                      onToggleStatus(customer._id, customer.isActive);
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {customer.isActive ? (
                      <>
                        <ToggleRight className="mr-3 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="mr-3 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            {customer.phone}
          </div>
          {customer.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {customer.email}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {customer.address.city}, {customer.address.state}
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {customer.outstandingAmount < 0 ? 'Credit:' : 'Outstanding:'}
            </span>
            <span className={`text-sm font-medium ${getCreditStatusColor(customer)}`}>
              {customer.outstandingAmount < 0 
                ? `-₹${Math.abs(customer.outstandingAmount).toLocaleString()}`
                : `₹${customer.outstandingAmount.toLocaleString()}`}
            </span>
          </div>

          {customer.unallocatedPayments > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Unallocated Payment:</span>
              <span className="text-sm font-medium text-blue-600">
                ₹{customer.unallocatedPayments.toLocaleString()}
              </span>
            </div>
          )}

          {customer.adjustedOutstanding !== undefined && customer.adjustedOutstanding !== customer.outstandingAmount && (
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-sm font-medium text-gray-700">
                {customer.adjustedOutstanding < 0 ? 'Net Credit:' : 'Net Outstanding:'}
              </span>
              <span className={`text-sm font-bold ${
                customer.adjustedOutstanding < 0 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {customer.adjustedOutstanding < 0 
                  ? `-₹${Math.abs(customer.adjustedOutstanding).toLocaleString()}`
                  : `₹${customer.adjustedOutstanding.toLocaleString()}`}
              </span>
            </div>
          )}

          {customer.creditLimit > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Credit Limit:</span>
              <span className="text-sm font-medium text-gray-900">
                ₹{customer.creditLimit.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Purchase:</span>
            <span className="text-sm font-medium text-gray-900">
              ₹{customer.totalPurchase.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Payment Status:</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              customer.outstandingAmount < 0
                ? 'bg-blue-100 text-blue-800'
                : customer.outstandingAmount === 0
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {getCreditStatusText(customer)}
            </span>
          </div>

          {customer.lastPurchase && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Last Purchase:</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(customer.lastPurchase).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Link
                to={`/customers/${customer._id}`}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
              <Link
                to={`/customers/${customer._id}/edit`}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
