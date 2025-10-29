import React from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

const RecentActivity = ({ title, type, data }) => {
  const getLinkPath = (item) => {
    if (type === 'sales') {
      return `/sales/${item.id}`;
    } else if (type === 'payments') {
      return `/payments/${item.id}`;
    }
    return '#';
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {data.map((item) => (
          <div key={item.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.description}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {item.amount}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500">
                    {item.customer}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.time}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <Link
                  to={getLinkPath(item)}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-primary-600 hover:text-primary-900 hover:bg-primary-50 transition-colors duration-200"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <Link
          to={type === 'sales' ? '/sales' : '/payments'}
          className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
        >
          View all {title.toLowerCase()}
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity;
