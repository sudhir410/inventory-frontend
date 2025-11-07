import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomer, createCustomer, updateCustomer } from '../../features/customers/customerSlice';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, X, User, Phone, Mail, MapPin, CreditCard, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import HelpTooltip from '../UI/HelpTooltip';

const CustomerForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { customer: currentCustomer, loading: customerLoading } = useSelector((state) => state.customers);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },
    type: 'retail',
    gstNumber: '',
    panNumber: '',
    creditLimit: '',
    notes: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  // Fetch customer data for editing
  useEffect(() => {
    if (isEdit && id) {
      const fetchCustomerData = async () => {
        try {
          await dispatch(getCustomer(id)).unwrap();
        } catch (error) {
          console.error('Error fetching customer:', error);
          toast.error('Failed to load customer data');
          navigate('/customers');
        }
      };
      fetchCustomerData();
    }
  }, [isEdit, id, dispatch, navigate]);

  // Populate form when customer data is loaded
  useEffect(() => {
    if (isEdit && currentCustomer && currentCustomer._id === id) {
      setFormData({
        name: currentCustomer.name || '',
        email: currentCustomer.email || '',
        phone: currentCustomer.phone || '',
        address: {
          street: currentCustomer.address?.street || '',
          city: currentCustomer.address?.city || '',
          state: currentCustomer.address?.state || '',
          zipCode: currentCustomer.address?.zipCode || '',
          country: currentCustomer.address?.country || 'India',
        },
        type: currentCustomer.type || 'retail',
        gstNumber: currentCustomer.gstNumber || '',
        panNumber: currentCustomer.panNumber || '',
        creditLimit: currentCustomer.creditLimit?.toString() || '',
        notes: currentCustomer.notes || '',
        isActive: currentCustomer.isActive !== undefined ? currentCustomer.isActive : true,
      });
      setInitialLoading(false);
    } else if (!isEdit) {
      setInitialLoading(false);
    }
  }, [currentCustomer, id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Only name is required
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    
    // Optional field validations (only validate format if provided)
    if (formData.email && formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.gstNumber && formData.gstNumber.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = 'Please enter a valid GST number';
    }
    if (formData.panNumber && formData.panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'Please enter a valid PAN number';
    }
    if (formData.creditLimit && parseFloat(formData.creditLimit) < 0) {
      newErrors.creditLimit = 'Credit limit cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const customerData = {
        ...formData,
        creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : 0,
      };

      if (isEdit) {
        await dispatch(updateCustomer({ id, customerData })).unwrap();
        toast.success('Customer updated successfully!');
      } else {
        await dispatch(createCustomer(customerData)).unwrap();
        toast.success('Customer created successfully!');
      }
      
      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      
      // Extract error message from backend
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} customer`;
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.errors && Array.isArray(error.errors)) {
        // Handle validation errors from backend
        errorMessage = error.errors.map(e => e.msg || e.message).join(', ');
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const customerTypes = [
    { value: 'retail', label: 'Retail Customer' },
    { value: 'wholesale', label: 'Wholesale Customer' },
    { value: 'business', label: 'Business Customer' },
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
  ];

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
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
              to="/customers"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Customer' : 'Add New Customer'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Update customer information' : 'Add a new customer to your database'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  type="button"
                  onClick={() => setErrors(prev => ({ ...prev, submit: '' }))}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="Enter customer's full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Customer Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {customerTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Address Information
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors['address.city'] ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    placeholder="Enter city"
                  />
                  {errors['address.city'] && <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>}
                </div>

                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <select
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors['address.state'] ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors['address.state'] && <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter ZIP code"
                  />
                </div>

                <div>
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    id="address.country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Business Information</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                    GST Number
                  </label>
                  <HelpTooltip
                    content="15-character alphanumeric code issued by the government for tax purposes. Format: 22AAAAA0000A1Z5. Leave blank if customer doesn't have GST registration."
                    type="info"
                    position="top"
                  >
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  </HelpTooltip>
                </div>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.gstNumber ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="22AAAAA0000A1Z5"
                />
                {errors.gstNumber && <p className="mt-1 text-sm text-red-600">{errors.gstNumber}</p>}
              </div>

              <div>
                <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
                  PAN Number
                </label>
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.panNumber ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="AAAAA0000A"
                />
                {errors.panNumber && <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>}
              </div>

              <div>
                <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700">
                  Credit Limit (₹)
                </label>
                <input
                  type="number"
                  id="creditLimit"
                  name="creditLimit"
                  min="0"
                  step="100"
                  value={formData.creditLimit}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.creditLimit ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="0"
                />
                {errors.creditLimit && <p className="mt-1 text-sm text-red-600">{errors.creditLimit}</p>}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter any additional notes about the customer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange({
                      target: { name: 'isActive', value: e.target.checked }
                    })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active Customer
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/customers"
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
              {loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
