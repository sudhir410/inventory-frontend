import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, X, Plus, Trash2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct, getProduct } from '../../features/products/productSlice';
import { HelpTooltip, ValidationTip } from '../UI';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { categories: reduxCategories, product: currentProduct, loading: productLoading } = useSelector((state) => state.products);
  const isEdit = Boolean(id);
  
  // Fallback categories if Redux categories are not loaded
  const categories = reduxCategories && reduxCategories.length > 0 
    ? reduxCategories 
    : ['Building Materials', 'Paints', 'Hardware', 'Electrical', 'Tools', 'Plumbing', 'Tiles', 'Sanitary'];

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    description: '',
    unit: 'piece',
    price: {
      purchase: '',
      selling: '',
      mrp: '',
    },
    stock: {
      current: '',
      minimum: '',
      maximum: '',
    },
    supplier: '',
    location: '',
    barcode: '',
    image: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  // Fetch product data when editing
  useEffect(() => {
    if (isEdit && id) {
      dispatch(getProduct(id));
    }
  }, [id, isEdit, dispatch]);

  // Populate form when product data is loaded
  useEffect(() => {
    if (isEdit && currentProduct && currentProduct._id === id) {
      setFormData({
        name: currentProduct.name || '',
        sku: currentProduct.sku || '',
        category: currentProduct.category || '',
        brand: currentProduct.brand || '',
        description: currentProduct.description || '',
        unit: currentProduct.unit || 'piece',
        price: {
          purchase: currentProduct.price?.purchase?.toString() || '',
          selling: currentProduct.price?.selling?.toString() || '',
          mrp: currentProduct.price?.mrp?.toString() || '',
        },
        stock: {
          current: currentProduct.stock?.current?.toString() || '',
          minimum: currentProduct.stock?.minimum?.toString() || '',
          maximum: currentProduct.stock?.maximum?.toString() || '',
        },
        supplier: currentProduct.supplier || '',
        location: currentProduct.location || '',
        barcode: currentProduct.barcode || '',
        image: currentProduct.image || '',
        isActive: currentProduct.isActive !== undefined ? currentProduct.isActive : true,
      });
      setInitialLoading(false);
    } else if (!isEdit) {
      setInitialLoading(false);
    }
  }, [currentProduct, id, isEdit]);

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

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    // SKU and prices are now optional
    // Parse numbers for comparison
    const mrp = parseFloat(formData.price.mrp);
    const selling = parseFloat(formData.price.selling);
    const currentStock = parseInt(formData.stock.current);
    const minimumStock = parseInt(formData.stock.minimum);
    
    if (formData.price.mrp && formData.price.selling && mrp <= selling) {
      newErrors['price.mrp'] = 'MRP must be greater than selling price';
    }
    if (formData.stock.minimum && formData.stock.current && currentStock < minimumStock) {
      newErrors['stock.current'] = 'Current stock cannot be less than minimum stock';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: {
          purchase: parseFloat(formData.price.purchase) || 0,
          selling: parseFloat(formData.price.selling) || 0,
          mrp: formData.price.mrp ? parseFloat(formData.price.mrp) : undefined,
        },
        stock: {
          current: parseInt(formData.stock.current) || 0,
          minimum: parseInt(formData.stock.minimum) || 0,
          maximum: formData.stock.maximum ? parseInt(formData.stock.maximum) : undefined,
        },
      };

      if (isEdit) {
        await dispatch(updateProduct({ id, productData })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success('Product created successfully!');
      }

      navigate('/inventory/products');
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Display error message
      let errorMessage = 'Failed to save product';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors.map(e => e.msg).join(', ');
      }
      
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const units = [
    'piece',
    'kg',
    'meter',
    'liter',
    'box',
    'packet',
    'set',
    'pair',
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
              to="/inventory/products"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600">
                {isEdit ? 'Update product information' : 'Create a new product in your inventory'}
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <HelpTooltip
                    content="Enter the full name of the product as it should appear in your inventory. This name will be visible to customers and staff."
                    type="info"
                    position="top"
                  >
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  </HelpTooltip>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="Enter product name (optional)"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <HelpTooltip
                    content="Stock Keeping Unit - A unique identifier for this product. Use letters and numbers only (e.g., CEM-001, STL-002). Must be unique across all products."
                    type="info"
                    position="top"
                  >
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  </HelpTooltip>
                </div>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.sku ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="Enter SKU"
                />
                {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="price.purchase" className="block text-sm font-medium text-gray-700">
                  Purchase Price (₹)
                </label>
                <input
                  type="number"
                  id="price.purchase"
                  name="price.purchase"
                  step="0.01"
                  min="0"
                  value={formData.price.purchase}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors['price.purchase'] ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="0.00"
                />
                {errors['price.purchase'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['price.purchase']}</p>
                )}
              </div>

              <div>
                <label htmlFor="price.selling" className="block text-sm font-medium text-gray-700">
                  Selling Price (₹)
                </label>
                <input
                  type="number"
                  id="price.selling"
                  name="price.selling"
                  step="0.01"
                  min="0"
                  value={formData.price.selling}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors['price.selling'] ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="0.00"
                />
                {errors['price.selling'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['price.selling']}</p>
                )}
              </div>

              <div>
                <label htmlFor="price.mrp" className="block text-sm font-medium text-gray-700">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  id="price.mrp"
                  name="price.mrp"
                  step="0.01"
                  min="0"
                  value={formData.price.mrp}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors['price.mrp'] ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="0.00"
                />
                {errors['price.mrp'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['price.mrp']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Stock Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="stock.current" className="block text-sm font-medium text-gray-700">
                  Current Stock
                </label>
                <input
                  type="number"
                  id="stock.current"
                  name="stock.current"
                  min="0"
                  value={formData.stock.current}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors['stock.current'] ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="0"
                />
                {errors['stock.current'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['stock.current']}</p>
                )}
              </div>

              <div>
                <label htmlFor="stock.minimum" className="block text-sm font-medium text-gray-700">
                  Minimum Stock Level
                </label>
                <input
                  type="number"
                  id="stock.minimum"
                  name="stock.minimum"
                  min="0"
                  value={formData.stock.minimum}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="stock.maximum" className="block text-sm font-medium text-gray-700">
                  Maximum Stock Level
                </label>
                <input
                  type="number"
                  id="stock.maximum"
                  name="stock.maximum"
                  min="0"
                  value={formData.stock.maximum}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <input
                  type="text"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter supplier name"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Storage Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter storage location"
                />
              </div>

              <div>
                <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                  Barcode
                </label>
                <input
                  type="text"
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter barcode"
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
                    Active Product
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Tips */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Validation Tips</h2>
          <div className="space-y-3">
            <ValidationTip
              type="info"
              field="SKU"
              message="Stock Keeping Unit must be unique across all products. Use only letters and numbers (e.g., CEM-001, STL-002)."
              suggestion="Make sure the SKU doesn't already exist in your inventory to avoid duplicates."
            />
            <ValidationTip
              type="info"
              field="Pricing"
              message="Purchase price should be what you pay the supplier, selling price is what you charge customers."
              suggestion="Set realistic prices that ensure profitability while remaining competitive."
            />
            <ValidationTip
              type="warning"
              field="Stock Levels"
              message="Minimum stock level helps you get alerts when inventory runs low."
              suggestion="Set minimum stock to 10-20% of your typical order quantity for that product."
            />
            <ValidationTip
              type="info"
              field="Categories"
              message="Choose the most appropriate category for easy product organization and search."
              suggestion="You can manage categories in the Inventory > Categories section."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/inventory/products"
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
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
