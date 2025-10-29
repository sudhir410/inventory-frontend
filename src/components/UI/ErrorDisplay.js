import React, { useState } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp, Code, Info } from 'lucide-react';
import Tooltip from './Tooltip';

const ErrorDisplay = ({
  errors = [],
  warnings = [],
  title = "Development Tips",
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showErrors, setShowErrors] = useState(true);
  const [showWarnings, setShowWarnings] = useState(true);

  const totalIssues = errors.length + warnings.length;

  if (totalIssues === 0) return null;

  const getErrorIcon = (type) => {
    return type === 'error' ? (
      <X className="h-4 w-4 text-red-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
    );
  };

  const getErrorColor = (type) => {
    return type === 'error' ? 'text-red-700' : 'text-yellow-700';
  };

  const getErrorBgColor = (type) => {
    return type === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
  };

  const getErrorTypeName = (type) => {
    return type === 'error' ? 'Error' : 'Warning';
  };

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 rounded-t-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Code className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            <div className="flex items-center space-x-2">
              {errors.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {errors.length} Errors
                </span>
              )}
              {warnings.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {warnings.length} Warnings
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip
              content="Click to expand and see detailed error information"
              type="info"
              position="left"
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Errors Section */}
          {errors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <X className="h-4 w-4 text-red-500 mr-2" />
                  Errors ({errors.length})
                </h4>
                <button
                  onClick={() => setShowErrors(!showErrors)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {showErrors ? 'Hide' : 'Show'}
                </button>
              </div>

              {showErrors && (
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div
                      key={index}
                      className={`border rounded-md p-3 ${getErrorBgColor('error')}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {getErrorIcon('error')}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-sm font-medium ${getErrorColor('error')}`}>
                              {error.rule || getErrorTypeName('error')}
                            </h5>
                            <Tooltip
                              content={`Line ${error.line || 'N/A'}:${error.column || 'N/A'} in ${error.file || 'unknown file'}`}
                              type="info"
                              position="top"
                            >
                              <span className="text-xs text-gray-500 cursor-help">
                                {error.file || 'Unknown file'}
                              </span>
                            </Tooltip>
                          </div>
                          <p className={`text-sm mt-1 ${getErrorColor('error')}`}>
                            {error.message}
                          </p>
                          {error.suggestion && (
                            <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                              <p className="text-xs text-gray-600 font-medium">Suggestion:</p>
                              <p className="text-xs text-gray-700">{error.suggestion}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Warnings Section */}
          {warnings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                  Warnings ({warnings.length})
                </h4>
                <button
                  onClick={() => setShowWarnings(!showWarnings)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {showWarnings ? 'Hide' : 'Show'}
                </button>
              </div>

              {showWarnings && (
                <div className="space-y-2">
                  {warnings.map((warning, index) => (
                    <div
                      key={index}
                      className={`border rounded-md p-3 ${getErrorBgColor('warning')}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {getErrorIcon('warning')}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-sm font-medium ${getErrorColor('warning')}`}>
                              {warning.rule || getErrorTypeName('warning')}
                            </h5>
                            <Tooltip
                              content={`Line ${warning.line || 'N/A'}:${warning.column || 'N/A'} in ${warning.file || 'unknown file'}`}
                              type="info"
                              position="top"
                            >
                              <span className="text-xs text-gray-500 cursor-help">
                                {warning.file || 'Unknown file'}
                              </span>
                            </Tooltip>
                          </div>
                          <p className={`text-sm mt-1 ${getErrorColor('warning')}`}>
                            {warning.message}
                          </p>
                          {warning.suggestion && (
                            <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                              <p className="text-xs text-gray-600 font-medium">Suggestion:</p>
                              <p className="text-xs text-gray-700">{warning.suggestion}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                Total: {totalIssues} issue{totalIssues !== 1 ? 's' : ''}
                {errors.length > 0 && warnings.length > 0 && ` (${errors.length} errors, ${warnings.length} warnings)`}
              </div>
              <div className="flex items-center space-x-2">
                <Tooltip
                  content="These are development-time warnings and errors. They don't affect the functionality but should be addressed for better code quality."
                  type="info"
                  position="top"
                >
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </Tooltip>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setShowErrors(true);
                    setShowWarnings(true);
                  }}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
