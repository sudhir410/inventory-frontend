import React from 'react';
import Tooltip from './Tooltip';

const HelpTooltip = ({
  content,
  type = 'info',
  position = 'top',
  className = '',
  children
}) => {
  return (
    <Tooltip
      content={content}
      type={type}
      position={position}
      className={className}
    >
      {children || (
        <div className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 hover:bg-gray-200 cursor-help">
          <span className="text-xs font-medium text-gray-600">?</span>
        </div>
      )}
    </Tooltip>
  );
};

export default HelpTooltip;
