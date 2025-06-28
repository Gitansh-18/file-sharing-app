import React from 'react';
import { useParams } from 'react-router-dom';
import FileDownloader from '../components/FileDownloader';

const Download: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();

  if (!fileId) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Download Link</h1>
        <p className="text-gray-600">The download link is invalid or expired.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Download File</h1>
        <p className="text-gray-600">
          You're about to download a file shared with QRDrop
        </p>
      </div>
      
      <FileDownloader fileId={fileId} />
    </div>
  );
};

export default Download;