import React, { useState } from 'react';
import { Info, AlertTriangle, XCircle, CheckCircle, HelpCircle } from 'lucide-react';

const Tooltip = ({
  children,
  content,
  type = 'info',
  position = 'top',
  className = '',
  showIcon = true
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'success':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-900 text-white';
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div className={`absolute z-50 px-3 py-2 text-sm rounded-lg shadow-lg ${getPositionClasses()} ${getTypeStyles()}`}>
          {showIcon && (
            <div className="flex items-center mb-1">
              {getIcon()}
              <span className="ml-2 font-medium">Help</span>
            </div>
          )}
          <div className="text-xs leading-relaxed">
            {content}
          </div>
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 ${getTypeStyles().replace('text-white', '').trim()} transform rotate-45`}
            style={{
              [position === 'top' ? 'top' : position === 'bottom' ? 'bottom' : position === 'left' ? 'left' : 'right']: '-4px',
              [position === 'top' || position === 'bottom' ? 'left' : 'top']: '50%',
              transform: position === 'top' || position === 'bottom'
                ? 'translateX(-50%) rotate(45deg)'
                : 'translateY(-50%) rotate(45deg)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
