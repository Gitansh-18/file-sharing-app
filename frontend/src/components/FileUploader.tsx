// FileUploader.tsx
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileX, Loader2, AlertCircle } from 'lucide-react';
import { useFileStorage } from '../contexts/FileStorageContext';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const FileUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadFile } = useFileStorage();
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);

    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 20MB.');
      return;
    }

    try {
      setIsUploading(true);
      const fileId = await uploadFile(file);
      navigate(`/success/${fileId}`);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  }, [uploadFile, navigate]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: isUploading
  });

  const getBorderColor = () => {
    if (isDragAccept) return 'border-green-500';
    if (isDragReject) return 'border-red-500';
    if (isDragActive) return 'border-blue-500';
    return 'border-gray-300';
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps({
          className: `dropzone flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out ${getBorderColor()} ${
            isDragActive ? 'bg-blue-50' : 'bg-white'
          } ${isUploading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`
        })}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center text-gray-600">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm">Uploading your file...</p>
          </div>
        ) : isDragReject ? (
          <div className="flex flex-col items-center text-red-500">
            <FileX className="h-10 w-10" />
            <p className="mt-2 text-sm">Only one file can be uploaded at a time</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-600">
            <Upload className={`h-10 w-10 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="mt-2 text-sm font-medium">
              Drag and drop your file here, or click to select
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Upload any file (max 20MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center justify-center text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
