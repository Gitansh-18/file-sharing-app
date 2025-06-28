import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Link to="/" className="text-gray-500 hover:text-blue-600 transition">
              Home
            </Link>
            <a 
              href="#" 
              className="text-gray-500 hover:text-blue-600 transition"
              onClick={(e) => {
                e.preventDefault();
                alert('Privacy policy would go here');
              }}
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-blue-600 transition"
              onClick={(e) => {
                e.preventDefault();
                alert('Terms of service would go here');
              }}
            >
              Terms
            </a>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <span>© {new Date().getFullYear()} QRDrop</span>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;