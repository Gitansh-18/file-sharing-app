import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';

const Home: React.FC = () => {
  const [downloadCode, setDownloadCode] = useState('');
  const navigate = useNavigate();

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (downloadCode.trim()) {
      navigate(`/download/${downloadCode.trim()}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Files Instantly</h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Upload a file and get a QR code to share. Recipients can scan the code or enter the download ID to access your file.
        </p>
      </div>
      
      <div className="max-w-lg mx-auto">
        <FileUploader />
      </div>

      <div className="mt-8 max-w-lg mx-auto">
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Have a download code?</h2>
          <form onSubmit={handleCodeSubmit} className="flex gap-2">
            <input
              type="text"
              value={downloadCode}
              onChange={(e) => setDownloadCode(e.target.value)}
              placeholder="Enter your download code"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Download
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-8 max-w-lg mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">How it works</h2>
        <ol className="space-y-4">
          <li className="flex items-start">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mr-3">1</span>
            <div>
              <p className="text-gray-700">Upload any file (max 20MB)</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mr-3">2</span>
            <div>
              <p className="text-gray-700">Get a QR code and a unique download link</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mr-3">3</span>
            <div>
              <p className="text-gray-700">Share the QR code or link with your recipient</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mr-3">4</span>
            <div>
              <p className="text-gray-700">They can download the file instantly - no account required</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};
console.log(import.meta.env.VITE_TEST);


export default Home;