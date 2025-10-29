import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, icon: Icon, color, link, linkText }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`flex items-center justify-center h-8 w-8 rounded-md ${color} text-white`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {link && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link
              to={link}
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              {linkText}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
