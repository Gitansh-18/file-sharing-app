import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { useFileStorage } from '../contexts/FileStorageContext';

const UploadSuccess: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { getFile } = useFileStorage();
  const [loading, setLoading] = useState(true);
  const [fileExists, setFileExists] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const checkFile = async () => {
      if (!fileId) return;

      const file = await getFile(fileId);
      if (file) {
        setFileExists(true);
        setFileName(file.name);
      }
      setLoading(false);
    };

    checkFile();
  }, [fileId, getFile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!fileId || !fileExists) {
    return <Navigate to="/" replace />;
  }

  const downloadUrl = `${window.location.origin}/download/${fileId}`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">File Uploaded Successfully!</h1>
        <p className="text-green-600 font-medium">{fileName}</p>
        <p className="text-gray-600 mt-2">
          Share this QR code or link with anyone who needs to download your file
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <QRCodeDisplay url={downloadUrl} downloadCode={fileId} />
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Share the download code</h2>
        <div className="bg-gray-100 px-4 py-3 rounded-md inline-block">
          <p className="font-mono text-lg select-all">{fileId}</p>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Recipients can manually enter this code to download the file
        </p>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          This file will automatically expire after 24 hours
        </p>
      </div>
    </div>
  );
};

export default UploadSuccess;