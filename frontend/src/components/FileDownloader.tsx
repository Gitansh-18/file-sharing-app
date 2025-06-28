import React, { useState, useEffect } from 'react';
import { Download, FileX, Loader2 } from 'lucide-react';
import { useFileStorage } from '../contexts/FileStorageContext';

interface FileDownloaderProps {
  fileId: string;
}

const FileDownloader: React.FC<FileDownloaderProps> = ({ fileId }) => {
  const { getFile } = useFileStorage();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const file = await getFile(fileId);
        console.log('Fetched file:', file); // Debug log

        if (!file) {
          setError('File not found. It may have expired or been removed.');
          setIsLoading(false);
          return;
        }

        setFileName(file.name);
        setFileSize(file.size);

        if (file.url) {
          setFileUrl(file.url);
        } else if (file.publicId) {
          // Add extension if you have it, otherwise default to pdf
          const ext = file.format || 'pdf';
          setFileUrl(`https://res.cloudinary.com/dqs4ywt5i/raw/upload/${file.publicId}.${ext}`);
        } else {
          setError('Invalid file data received.');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching file:', error);
        setError('Failed to load file. Please try again.');
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [fileId, getFile]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const downloadFile = () => {
    if (!fileUrl || !fileName) return;
    // To trigger download, open the file URL in new tab/window:
    window.open(fileUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading file...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileX className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">File Not Available</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Ready to Download</h2>
        <p className="text-gray-600">The file is ready for you to download</p>
      </div>

      <div className="border border-gray-200 rounded-md p-4 mb-6">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">File name:</span>
          <span className="font-medium truncate">{fileName}</span>
        </div>
        <div className="flex flex-col mt-2">
          <span className="text-sm text-gray-500">Size:</span>
          <span className="font-medium">{formatFileSize(fileSize)}</span>
        </div>
      </div>

      <button
        onClick={downloadFile}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
      >
        <Download className="h-5 w-5" />
        <span>Download File</span>
      </button>

      <p className="mt-4 text-xs text-center text-gray-500">
        By downloading, you accept responsibility for any risks associated with the file
      </p>
    </div>
  );
};

export default FileDownloader;
