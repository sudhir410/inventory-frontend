import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from '../../features/customers/customerSlice';
import { getSales } from '../../features/sales/saleSlice';
import { createPayment, updatePayment, getPayment } from '../../features/payments/paymentSlice';
import { ArrowLeft, Save, X, Plus, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const customers = useSelector((state) => state.customers.customers || []);
  const sales = useSelector((state) => state.sales.sales || []);
  const { payment: currentPayment } = useSelector((state) => state.payments);
  
  const [formData, setFormData] = useState({
    customer: searchParams.get('customer') || '',
    amount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: '',
    notes: '',
    sales: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [pendingSales, setPendingSales] = useState([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all customers
    dispatch(getCustomers({ page: 1, limit: 100, isActive: true }));
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && id) {
      const fetchPaymentData = async () => {
        try {
          setInitialLoading(true);
          await dispatch(getPayment(id)).unwrap();
        } catch (error) {
          console.error('Error fetching payment:', error);
          toast.error('Failed to load payment data');
          navigate('/payments');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchPaymentData();
    }
  }, [isEdit, id, dispatch, navigate]);

  useEffect(() => {
    if (isEdit && currentPayment && currentPayment._id === id) {
      setFormData({
        customer: currentPayment.customer?._id || currentPayment.customer || '',
        amount: currentPayment.amount || '',
        paymentMethod: currentPayment.paymentMethod || 'cash',
        paymentDate: currentPayment.paymentDate 
          ? new Date(currentPayment.paymentDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        reference: currentPayment.reference || '',
        notes: currentPayment.notes || '',
        sales: currentPayment.sales?.map(s => ({
          sale: s.sale?._id || s.sale,
          amount: s.amount
        })) || [],
      });
    }
  }, [currentPayment, isEdit, id]);

  useEffect(() => {
    // Fetch pending sales for selected customer
    if (formData.customer) {
      dispatch(getSales({ customer: formData.customer, page: 1, limit: 100 }));
    }
  }, [formData.customer, dispatch]);

  useEffect(() => {
    // Filter sales with outstanding balance
    if (sales && sales.length > 0) {
      const filteredSales = sales.filter(sale => 
        sale.customer?._id === formData.customer && 
        (sale.balance > 0 || sale.total > (sale.paid || 0))
      );
      setPendingSales(filteredSales);
    } else {
      setPendingSales([]);
    }
  }, [sales, formData.customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Reset sales allocation when customer changes
    if (name === 'customer') {
      setFormData(prev => ({ ...prev, sales: [] }));
    }
  };

  const handleSaleAllocation = (saleId, amount) => {
    const allocationAmount = parseFloat(amount) || 0;

    setFormData(prev => {
      const existingAllocationIndex = prev.sales.findIndex(s => s.sale === saleId);

      let updatedSales;
      if (allocationAmount > 0) {
        if (existingAllocationIndex >= 0) {
          updatedSales = prev.sales.map((s, index) =>
            index === existingAllocationIndex ? { ...s, amount: allocationAmount } : s
          );
        } else {
          updatedSales = [...prev.sales, { sale: saleId, amount: allocationAmount }];
        }
      } else {
        updatedSales = prev.sales.filter(s => s.sale !== saleId);
      }

      return { ...prev, sales: updatedSales };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer) newErrors.customer = 'Customer is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        sales: formData.sales.filter(s => s.amount > 0),
      };

      if (isEdit) {
        await dispatch(updatePayment({ id, paymentData })).unwrap();
        toast.success('Payment updated successfully!');
      } else {
        await dispatch(createPayment(paymentData)).unwrap();
        toast.success('Payment recorded successfully!');
      }
      navigate('/payments');
    } catch (error) {
      console.error('Error saving payment:', error);
      const errorMessage = error.message || `Failed to ${isEdit ? 'update' : 'create'} payment`;
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const totalAllocated = formData.sales.reduce((sum, s) => sum + s.amount, 0);
  const remainingAmount = parseFloat(formData.amount) - totalAllocated;

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
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Payment' : 'Record Payment'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Update payment transaction' : 'Record a new payment transaction'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Payment Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Customer *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                    className={`w-full text-left px-3 py-2 border ${
                      errors.customer ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  >
                    {formData.customer
                      ? customers.find(c => c._id === formData.customer)?.name
                      : 'Select a customer'}
                  </button>

                  {showCustomerSearch && (
                    <div className="absolute z-50 mt-1 w-full bg-white shadow-2xl max-h-80 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border-2 border-primary-200">
                      <div className="sticky top-0 bg-white p-2 border-b z-10">
                        <input
                          type="text"
                          placeholder="Search customers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          autoFocus
                        />
                      </div>
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <button
                            key={customer._id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, customer: customer._id }));
                              setShowCustomerSearch(false);
                              setSearchTerm('');
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-primary-50 transition-colors"
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                            {customer.outstandingAmount > 0 && (
                              <div className="text-xs text-red-600">
                                Outstanding: ₹{customer.outstandingAmount.toLocaleString()}
                              </div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No customers found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer}</p>}
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Payment Amount * (₹)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="0.00"
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit">Credit</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                  Payment Date
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                  Reference (Optional)
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Transaction ID, Cheque number, etc."
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter any notes about this payment"
                />
              </div>
            </div>
          </div>

          {/* Sales Allocation */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Allocation</h2>

            {formData.customer && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Select sales to allocate this payment to:</p>
              </div>
            )}

            {pendingSales.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No pending sales for this customer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSales.map((sale) => (
                  <div key={sale._id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-gray-900">{sale.invoiceNumber}</div>
                        <div className="text-sm text-gray-600">
                          Total: ₹{sale.total.toLocaleString()} | Balance: ₹{sale.balance.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <input
                          type="number"
                          min="0"
                          max={sale.balance}
                          step="0.01"
                          placeholder="0.00"
                          onChange={(e) => handleSaleAllocation(sale._id, e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Allocation Summary */}
                <div className="border-t pt-4 bg-white rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Payment Amount:</span>
                      <span className="font-medium">₹{parseFloat(formData.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Allocated:</span>
                      <span className="font-medium">₹{totalAllocated.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className={`font-medium ${remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{remainingAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {remainingAmount < 0 && (
                    <p className="text-xs text-red-600 mt-2">
                      Warning: Allocated amount exceeds payment amount
                    </p>
                  )}
                  {remainingAmount > 0 && (
                    <p className="text-xs text-yellow-600 mt-2">
                      Note: ₹{remainingAmount.toFixed(2)} will remain unallocated
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/payments"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? (isEdit ? 'Updating...' : 'Recording...') : (isEdit ? 'Update Payment' : 'Record Payment')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
