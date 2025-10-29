import React, { useEffect, useState } from 'react';
import ErrorDisplay from './ErrorDisplay';

const DevHelper = () => {
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Parse ESLint output and extract errors/warnings
    // This would typically come from a build process or development server
    const mockErrors = [
      {
        file: 'src/components/Users/Users.js',
        line: 17,
        column: 6,
        message: "Identifier 'Users' has already been declared",
        rule: 'no-redeclare',
        type: 'error',
        suggestion: 'Rename the component or the imported icon to avoid naming conflicts'
      },
      {
        file: 'src/components/Users/Users.js',
        line: 28,
        column: 6,
        message: "React Hook useEffect has a missing dependency: 'fetchUsers'",
        rule: 'react-hooks/exhaustive-deps',
        type: 'warning',
        suggestion: "Add 'fetchUsers' to the dependency array or move the function inside useEffect"
      }
    ];

    const mockWarnings = [
      {
        file: 'src/components/Sales/Sales.js',
        line: 10,
        column: 3,
        message: "'MoreHorizontal' is defined but never used",
        rule: 'no-unused-vars',
        type: 'warning',
        suggestion: "Remove the unused import or use the component in your JSX"
      }
    ];

    // In a real implementation, this would parse actual ESLint output
    if (process.env.NODE_ENV === 'development') {
      setErrors(mockErrors);
      setWarnings(mockWarnings);
      setIsVisible(true);
    }
  }, []);

  if (!isVisible || (errors.length === 0 && warnings.length === 0)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <ErrorDisplay
        errors={errors}
        warnings={warnings}
        title="Development Helper"
        className="shadow-lg"
      />
    </div>
  );
};

export default DevHelper;
