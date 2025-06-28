import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { nanoid } from 'nanoid';

interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  publicId: string;
  createdAt: number;
}

interface FileStorageContextType {
  uploadFile: (file: File) => Promise<string>;
  getFile: (id: string) => Promise<StoredFile | null>;
  clearExpiredFiles: () => void;
}

const FileStorageContext = createContext<FileStorageContextType | undefined>(undefined);

const FILE_EXPIRY = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'qrdrop-files';

const CLOUDINARY_CLOUD_NAME = 'dqs4ywt5i';
const CLOUDINARY_UPLOAD_PRESET = 'unsigned_qrdrop';
const CLOUDINARY_API_KEY = '493336741586619';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`;

export const FileStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<Record<string, StoredFile>>(() => {
    try {
      const storedFiles = localStorage.getItem(STORAGE_KEY);
      return storedFiles ? JSON.parse(storedFiles) : {};
    } catch (error) {
      console.error('Failed to load files from localStorage:', error);
      return {};
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch (error) {
      console.error('Failed to save files to localStorage:', error);
    }
  }, [files]);

  const clearExpiredFiles = useCallback(() => {
    const now = Date.now();
    const updatedFiles = { ...files };
    let hasExpired = false;

    Object.keys(updatedFiles).forEach((id) => {
      if (now - updatedFiles[id].createdAt > FILE_EXPIRY) {
        delete updatedFiles[id];
        hasExpired = true;
      }
    });

    if (hasExpired) {
      setFiles(updatedFiles);
    }
  }, [files]);

  React.useEffect(() => {
    clearExpiredFiles();
    const interval = setInterval(clearExpiredFiles, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [clearExpiredFiles]);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.public_id) {
        throw new Error('Invalid response from Cloudinary');
      }

      const id = nanoid(10);
      
      const fileData: StoredFile = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        publicId: data.public_id,
        createdAt: Date.now(),
      };

      setFiles((prevFiles) => ({
        ...prevFiles,
        [id]: fileData,
      }));

      return id;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Please check your internet connection');
      }
      throw error;
    }
  }, []);

  const getFile = useCallback(async (id: string): Promise<StoredFile | null> => {
    const file = files[id];
    if (!file) return null;

    if (Date.now() - file.createdAt > FILE_EXPIRY) {
      setFiles((prevFiles) => {
        const newFiles = { ...prevFiles };
        delete newFiles[id];
        return newFiles;
      });
      return null;
    }

    return file;
  }, [files]);

  const value = useMemo(() => ({
    uploadFile,
    getFile,
    clearExpiredFiles,
  }), [uploadFile, getFile, clearExpiredFiles]);

  return (
    <FileStorageContext.Provider value={value}>
      {children}
    </FileStorageContext.Provider>
  );
};

export const useFileStorage = (): FileStorageContextType => {
  const context = useContext(FileStorageContext);
  if (context === undefined) {
    throw new Error('useFileStorage must be used within a FileStorageProvider');
  }
  return context;
};