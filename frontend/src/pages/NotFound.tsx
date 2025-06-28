import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8 text-center">
      <FileQuestion className="h-20 w-20 text-blue-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;