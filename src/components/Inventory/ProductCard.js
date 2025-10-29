import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Package,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const ProductCard = ({ product, onDelete, onToggleStatus }) => {
  const [showActions, setShowActions] = useState(false);

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusIcon = (status) => {
    switch (status) {
      case 'In Stock':
        return <Package className="h-4 w-4" />;
      case 'Low Stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Out of Stock':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Product Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">{product.sku}</p>
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
                    to={`/inventory/products/${product._id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowActions(false)}
                  >
                    <Eye className="mr-3 h-4 w-4" />
                    View Details
                  </Link>
                  <Link
                    to={`/inventory/products/${product._id}/edit`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowActions(false)}
                  >
                    <Edit className="mr-3 h-4 w-4" />
                    Edit Product
                  </Link>
                  <button
                    onClick={() => {
                      onToggleStatus(product._id, product.isActive);
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {product.isActive ? (
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
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={() => {
                      onDelete(product._id);
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                  >
                    <Trash2 className="mr-3 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Category:</span>
            <span className="text-sm font-medium text-gray-900">{product.category}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Brand:</span>
            <span className="text-sm font-medium text-gray-900">{product.brand || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Unit:</span>
            <span className="text-sm font-medium text-gray-900 capitalize">{product.unit}</span>
          </div>

          {/* Price Information */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Purchase:</span>
              <span className="text-sm font-medium text-gray-900">₹{product.price.purchase}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Selling:</span>
              <span className="text-lg font-bold text-primary-600">₹{product.price.selling}</span>
            </div>
            {product.price.mrp && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">MRP:</span>
                <span className="text-sm font-medium text-gray-500 line-through">₹{product.price.mrp}</span>
              </div>
            )}
          </div>

          {/* Stock Information */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Current Stock:</span>
              <span className="text-lg font-bold text-gray-900">{product.stock.current}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Min Stock:</span>
              <span className="text-sm font-medium text-gray-600">{product.stock.minimum}</span>
            </div>
            {product.stock.maximum && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Max Stock:</span>
                <span className="text-sm font-medium text-gray-600">{product.stock.maximum}</span>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status:</span>
              <div className="flex items-center">
                {getStockStatusIcon(product.stockStatus)}
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(
                    product.stockStatus
                  )}`}
                >
                  {product.stockStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Profit Margin */}
          {product.price.purchase && product.price.selling && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Profit Margin:</span>
                <span className="text-sm font-medium text-green-600">
                  {((product.price.selling - product.price.purchase) / product.price.purchase * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Link
                to={`/inventory/products/${product._id}`}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
              <Link
                to={`/inventory/products/${product._id}/edit`}
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

export default ProductCard;
