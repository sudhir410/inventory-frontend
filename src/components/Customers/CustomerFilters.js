import React from 'react';
import { X } from 'lucide-react';

const CustomerFilters = ({ filters, onFiltersChange, customerTypes }) => {
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: '',
      creditStatus: '',
      isActive: true,
    });
  };

  const hasActiveFilters = filters.type || filters.creditStatus;

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
        {/* Customer Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Type
          </label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Types</option>
            {customerTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Credit Status Filter */}
        <div>
          <label htmlFor="creditStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Credit Status
          </label>
          <select
            id="creditStatus"
            value={filters.creditStatus}
            onChange={(e) => handleFilterChange('creditStatus', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="clear">Clear</option>
            <option value="within_limit">Within Limit</option>
            <option value="over_limit">Over Limit</option>
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
          {filters.type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Type: {filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}
              <button
                onClick={() => handleFilterChange('type', '')}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.creditStatus && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Credit: {filters.creditStatus === 'clear' ? 'Clear' : filters.creditStatus === 'within_limit' ? 'Within Limit' : 'Over Limit'}
              <button
                onClick={() => handleFilterChange('creditStatus', '')}
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

export default CustomerFilters;
