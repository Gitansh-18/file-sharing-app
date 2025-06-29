import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Update the import path below to the correct location of FileStorageContext
import { useFileStorage } from '../contexts/FileStorageContext';




const Download: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { getFile } = useFileStorage();

  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileUrl, setFileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const file = await getFile(fileId || '');

        console.log("Fetched file from backend:", file); // ✅ Debug log

        if (!file || !file.id || !file.url) {
          console.warn("Invalid or missing file fields:", file);
          setError('Invalid file data received.');
          setIsLoading(false);
          return;
        }

        setFileName(file.name);
        setFileSize(file.size);
        setFileUrl(file.url);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching file:', error);
        setError('Failed to load file. Please try again.');
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [fileId, getFile]);

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
      <p className="mb-2">You're about to download a file shared with <span className="font-semibold text-blue-600">QRDrop</span></p>
      <div className="bg-white shadow-md rounded-lg p-6 mt-4 w-full max-w-md">
        <h2 className="text-xl font-semibold">{fileName}</h2>
        <p className="text-sm text-gray-600">Size: {(fileSize / 1024).toFixed(2)} KB</p>
        <a
          href={fileUrl}
          download={fileName}
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Download Now
        </a>
      </div>
    </div>
  );
};

export default Download;
