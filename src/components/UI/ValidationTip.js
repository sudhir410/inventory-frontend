import React from 'react';
import { CheckCircle, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import Tooltip from './Tooltip';

const ValidationTip = ({
  type = 'info',
  message,
  field,
  suggestion,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`border rounded-md p-3 ${getTypeColor()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium">
              {field ? `${field} Validation` : 'Validation Tip'}
            </h5>
            {suggestion && (
              <Tooltip
                content={suggestion}
                type="info"
                position="top"
              >
                <HelpCircle className="h-4 w-4 cursor-help opacity-60 hover:opacity-100" />
              </Tooltip>
            )}
          </div>
          <p className="text-sm mt-1">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValidationTip;
