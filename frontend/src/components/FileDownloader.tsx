import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFileStorage } from '../contexts/FileStorageContext';

const Download: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { getFile } = useFileStorage();

  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const file = await getFile(fileId || '');
        if (!file || !file.id || !file.name) {
          setError('Invalid file data received.');
          setIsLoading(false);
          return;
        }
        setFileName(file.name);
        setFileSize(file.size);
        setIsLoading(false);
      } catch {
        setError('Failed to load file. Please try again.');
        setIsLoading(false);
      }
    };
    fetchFile();
  }, [fileId, getFile]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // Always use backend endpoint for download to ensure correct filename and binary
      const response = await fetch(`/api/download/${fileId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setIsDownloading(false);
    } catch {
      alert('Download failed. Please try again.');
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        <h2 className="text-xl font-semibold">File Not Available</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-3xl font-bold mb-4">Download File</h1>
      <p className="mb-2">
        You're about to download a file shared with{' '}
        <span className="font-semibold text-blue-600">QRDrop</span>
      </p>
      <div className="bg-white shadow-md rounded-lg p-6 mt-4 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold">{fileName}</h2>
        <p className="text-sm text-gray-600">
          Size: {(fileSize / 1024).toFixed(2)} KB
        </p>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isDownloading ? 'Downloading...' : `Download ${fileName}`}
        </button>
      </div>
    </div>
  );
};

export default Download;
