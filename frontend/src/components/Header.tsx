import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition">
            <QrCode className="h-8 w-8" />
            <span className="font-bold text-xl tracking-tight">QRDrop</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Share a File
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;