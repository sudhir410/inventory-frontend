import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit,
  Eye,
  Phone,
  Mail,
  Shield,
  UserCheck,
  Users as UsersIcon,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const UserCard = ({ user, onToggleStatus }) => {
  const [showActions, setShowActions] = useState(false);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'manager':
        return <UserCheck className="h-4 w-4" />;
      case 'employee':
        return <UsersIcon className="h-4 w-4" />;
      default:
        return <UsersIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* User Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
              <div className="flex items-center mt-1">
                {getRoleIcon(user.role)}
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
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
                    to={`/users/${user._id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowActions(false)}
                  >
                    <Eye className="mr-3 h-4 w-4" />
                    View Details
                  </Link>
                  <Link
                    to={`/users/${user._id}/edit`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowActions(false)}
                  >
                    <Edit className="mr-3 h-4 w-4" />
                    Edit User
                  </Link>
                  <button
                    onClick={() => {
                      onToggleStatus(user._id, user.isActive);
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {user.isActive ? (
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
          {user.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {user.email}
            </div>
          )}
          {user.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {user.phone}
            </div>
          )}
        </div>

        {/* Status & Activity Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status:</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {user.lastLogin && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Last Login:</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(user.lastLogin).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Link
                to={`/users/${user._id}`}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
              <Link
                to={`/users/${user._id}/edit`}
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

export default UserCard;

