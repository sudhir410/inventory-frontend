import React, { useState } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import Tooltip from './Tooltip';

const ErrorTooltip = ({ error, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!error) return children;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <Tooltip
        content={error}
        type="error"
        position="top"
        showIcon={true}
      >
        <div className="absolute -top-1 -right-1">
          <AlertTriangle className="h-4 w-4 text-red-500 cursor-help" />
        </div>
      </Tooltip>
    </div>
  );
};

export default ErrorTooltip;
