import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers, createCustomer } from '../../features/customers/customerSlice';
import { getProducts } from '../../features/products/productSlice';
import { createSale, updateSale, getSale } from '../../features/sales/saleSlice';
import { ArrowLeft, Save, X, Plus, Trash2, Search, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const SaleForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers || []);
  const products = useSelector((state) => state.products.products || []);
  const { sale: currentSale, loading: saleLoading } = useSelector((state) => state.sales);
  
  const [formData, setFormData] = useState({
    customer: '',
    items: [
      {
        product: '',
        quantity: 1,
        price: 0,
        discount: 0,
        total: 0,
      },
    ],
    discount: 0,
    tax: 0,
    paymentMethod: 'cash',
    paid: 0,
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [activeProductDropdown, setActiveProductDropdown] = useState(null); // Track which row's dropdown is open
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    // Fetch customers and products from API
    dispatch(getCustomers({ page: 1, limit: 100, isActive: true }));
    dispatch(getProducts({ page: 1, limit: 200, isActive: true })); // Increased limit for more products
  }, [dispatch]);

  // Fetch sale data for editing
  useEffect(() => {
    if (isEdit && id) {
      const fetchSaleData = async () => {
        try {
          await dispatch(getSale(id)).unwrap();
        } catch (error) {
          console.error('Error fetching sale:', error);
          toast.error('Failed to load sale data');
          navigate('/sales');
        }
      };
      fetchSaleData();
    }
  }, [isEdit, id, dispatch, navigate]);

  // Populate form when sale data is loaded
  useEffect(() => {
    if (isEdit && currentSale && currentSale._id === id) {
      setFormData({
        customer: currentSale.customer?._id || currentSale.customer || '',
        items: currentSale.items.map(item => ({
          product: item.product?._id || item.product || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
          discount: item.discount || 0,
          total: item.total || 0,
        })),
        discount: currentSale.discount || 0,
        tax: currentSale.tax || 0,
        paymentMethod: currentSale.paymentMethod || 'cash',
        paid: currentSale.paid || 0,
        notes: currentSale.notes || '',
        subtotal: currentSale.subtotal || 0,
        total: currentSale.total || 0,
        balance: currentSale.balance || 0,
      });
      setInitialLoading(false);
    } else if (!isEdit) {
      setInitialLoading(false);
    }
  }, [currentSale, id, isEdit]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.discount, formData.tax, formData.paid]);


  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = Number(formData.discount) || 0;
    const taxAmount = Number(formData.tax) || 0;
    const paidAmount = Number(formData.paid) || 0;
    const total = subtotal - discountAmount + taxAmount;
    const balance = total - paidAmount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      total,
      balance,
    }));
  };

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
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];

    if (field === 'product') {
      if (value === '') {
        // Clear product selection
        updatedItems[index] = {
          ...updatedItems[index],
          product: '',
          price: 0,
          total: 0,
        };
      } else {
        const product = products.find(p => p._id === value);
        if (product) {
          updatedItems[index] = {
            ...updatedItems[index],
            product: product._id,
            price: product.price?.selling || 0,
            total: (updatedItems[index].quantity || 1) * (product.price?.selling || 0),
          };
        }
      }
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: parseFloat(value) || 0,
      };

      if (field === 'quantity' || field === 'price' || field === 'discount') {
        const item = updatedItems[index];
        item.total = (item.quantity * item.price) - (item.discount || 0);
      }
    }

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product: '',
          quantity: 1,
          price: 0,
          discount: 0,
          total: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    
    // If removing the last item, add a new empty item
    if (updatedItems.length === 0) {
      updatedItems.push({
        product: '',
        quantity: 1,
        price: 0,
        discount: 0,
        total: 0,
      });
    }
    
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer) newErrors.customer = 'Customer is required';

    const hasValidItems = formData.items.some(item =>
      item.product && item.quantity > 0 && item.price > 0
    );

    if (!hasValidItems) newErrors.items = 'At least one valid item is required';

    if (formData.paid < 0) newErrors.paid = 'Paid amount cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateNewCustomer = async () => {
    try {
      if (!newCustomerData.name.trim()) {
        toast.error('Customer name is required');
        return;
      }

      const result = await dispatch(createCustomer(newCustomerData)).unwrap();
      
      // Set the newly created customer as selected
      setFormData(prev => ({ ...prev, customer: result.data.customer._id }));
      
      // Reset and close modal
      setNewCustomerData({ name: '', phone: '', email: '', address: '' });
      setShowNewCustomerModal(false);
      setShowCustomerSearch(false);
      
      // Refresh customer list
      dispatch(getCustomers({ page: 1, limit: 100, isActive: true }));
      
      toast.success(`Customer "${result.data.customer.name}" created successfully!`);
    } catch (error) {
      toast.error(error.message || 'Failed to create customer');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const saleData = {
        ...formData,
        items: formData.items.filter(item => item.product),
      };

      if (isEdit) {
        await dispatch(updateSale({ id, saleData })).unwrap();
        toast.success('Sale updated successfully!');
      } else {
        await dispatch(createSale(saleData)).unwrap();
        toast.success('Sale created successfully!');
      }
      navigate('/sales');
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} sale:`, error);
      const errorMessage = error.message || `Failed to ${isEdit ? 'update' : 'create'} sale`;
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading spinner while fetching sale data
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
              to="/sales"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sales
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Sale' : 'New Sale'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Update sales transaction' : 'Create a new sales transaction'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Customer Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>

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
                  <div className="absolute z-50 mt-1 w-full bg-white shadow-2xl rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border-2 border-primary-200" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <div className="sticky top-0 bg-white p-2 border-b z-10">
                      <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCustomerModal(true);
                          setShowCustomerSearch(false);
                        }}
                        className="mt-2 w-full inline-flex items-center justify-center px-3 py-2 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add New Customer
                      </button>
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
                          className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{customer.phone}</div>
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
          </div>

          {/* Sale Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sale Information</h2>

            <div className="space-y-4">
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
                <label htmlFor="paid" className="block text-sm font-medium text-gray-700">
                  Amount Paid
                </label>
                <input
                  type="number"
                  id="paid"
                  name="paid"
                  min="0"
                  step="0.01"
                  value={formData.paid}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.paid ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="0.00"
                />
                {errors.paid && <p className="mt-1 text-sm text-red-600">{errors.paid}</p>}
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
                  placeholder="Enter any notes about this sale"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>

          {errors.items && <p className="mb-4 text-sm text-red-600">{errors.items}</p>}

          <div className="overflow-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="relative">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProductDropdown(activeProductDropdown === index ? null : index);
                              setSearchTerm('');
                            }}
                            className="flex-1 text-left px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          >
                            {item.product
                              ? products.find(p => p._id === item.product)?.name
                              : 'Select product'}
                          </button>
                          {item.product && (
                            <button
                              type="button"
                              onClick={() => {
                                handleItemChange(index, 'product', '');
                                setActiveProductDropdown(null);
                              }}
                              className="px-2 py-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Clear selection"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        {activeProductDropdown === index && (
                          <div className="absolute z-50 mt-1 w-full min-w-max bg-white shadow-2xl rounded-md text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border-2 border-primary-200" style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden', minHeight: '300px' }}>
                            <div className="sticky top-0 bg-white p-2 border-b z-10">
                              <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                autoFocus
                              />
                              <div className="mt-1 text-xs text-gray-500 text-center">
                                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                              {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                  <button
                                    key={product._id}
                                    type="button"
                                    onClick={() => {
                                      handleItemChange(index, 'product', product._id);
                                      setActiveProductDropdown(null);
                                      setSearchTerm('');
                                    }}
                                    className="w-full text-left px-4 py-4 hover:bg-primary-50 transition-colors border-b border-gray-100 last:border-b-0 block"
                                  >
                                    <div className="font-medium text-gray-900 truncate">{product.name}</div>
                                    <div className="text-sm text-gray-500 mt-1 truncate">
                                      SKU: {product.sku} | Price: ₹{product.price?.selling || 0} | Stock: {product.stock?.current || 0}
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-8 text-gray-500 text-center">
                                  No products found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      ₹{item.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Charges</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="tax" className="block text-sm font-medium text-gray-700">
                    Tax (₹)
                  </label>
                  <input
                    type="number"
                    id="tax"
                    name="tax"
                    min="0"
                    step="0.01"
                    value={formData.tax}
                    onChange={handleInputChange}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Summary</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">₹{(Number(formData.subtotal) || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="text-sm font-medium text-red-600">-₹{(Number(formData.discount) || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tax:</span>
                  <span className="text-sm font-medium text-green-600">+₹{(Number(formData.tax) || 0).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">₹{(Number(formData.total) || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Paid:</span>
                  <span className="text-sm font-medium">₹{(Number(formData.paid) || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Balance:</span>
                  <span className={`text-sm font-medium ${
                    (Number(formData.balance) || 0) < -0.01 
                      ? 'text-blue-600' 
                      : (Number(formData.balance) || 0) > 0.01 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {(Number(formData.balance) || 0) < 0 
                      ? `-₹${Math.abs(Number(formData.balance) || 0).toFixed(2)}` 
                      : `₹${(Number(formData.balance) || 0).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Status:</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    (Number(formData.balance) || 0) < -0.01
                      ? 'bg-blue-100 text-blue-800'
                      : Math.abs(Number(formData.balance) || 0) < 0.01
                      ? 'bg-green-100 text-green-800'
                      : (Number(formData.paid) || 0) > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(Number(formData.balance) || 0) < -0.01
                      ? 'Overpaid'
                      : Math.abs(Number(formData.balance) || 0) < 0.01
                      ? 'Paid'
                      : (Number(formData.paid) || 0) > 0
                      ? 'Partial'
                      : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/sales"
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
              {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Sale' : 'Create Sale')}
            </button>
          </div>
        </div>
      </form>

      {/* New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowNewCustomerModal(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserPlus className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Customer
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="newCustomerName" className="block text-sm font-medium text-gray-700">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          id="newCustomerName"
                          name="name"
                          value={newCustomerData.name}
                          onChange={handleNewCustomerChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div>
                        <label htmlFor="newCustomerPhone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="newCustomerPhone"
                          name="phone"
                          value={newCustomerData.phone}
                          onChange={handleNewCustomerChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <label htmlFor="newCustomerEmail" className="block text-sm font-medium text-gray-700">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          id="newCustomerEmail"
                          name="email"
                          value={newCustomerData.email}
                          onChange={handleNewCustomerChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="customer@example.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="newCustomerAddress" className="block text-sm font-medium text-gray-700">
                          Address (Optional)
                        </label>
                        <textarea
                          id="newCustomerAddress"
                          name="address"
                          rows={3}
                          value={newCustomerData.address}
                          onChange={handleNewCustomerChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Enter customer address"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateNewCustomer}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Create Customer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCustomerModal(false);
                    setNewCustomerData({ name: '', phone: '', email: '', address: '' });
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleForm;
