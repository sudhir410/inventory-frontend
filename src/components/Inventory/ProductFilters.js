import React from 'react';
import { X } from 'lucide-react';

const ProductFilters = ({ filters, onFiltersChange, categories }) => {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      stockStatus: '',
      isActive: true,
    });
  };

  const hasActiveFilters = filters.category || filters.stockStatus;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <div>
          <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Status
          </label>
          <select
            id="stockStatus"
            value={filters.stockStatus}
            onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Active Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="isActive"
                value="true"
                checked={filters.isActive === true}
                onChange={(e) => handleFilterChange('isActive', e.target.value === 'true')}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="isActive"
                value="false"
                checked={filters.isActive === false}
                onChange={(e) => handleFilterChange('isActive', e.target.value === 'true')}
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Inactive</span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Category: {filters.category}
              <button
                onClick={() => handleFilterChange('category', '')}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.stockStatus && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Stock: {filters.stockStatus === 'in' ? 'In Stock' : filters.stockStatus === 'low' ? 'Low Stock' : 'Out of Stock'}
              <button
                onClick={() => handleFilterChange('stockStatus', '')}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
