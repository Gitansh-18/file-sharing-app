import React, { createContext, useContext, useMemo, useCallback } from 'react';

interface StoredFile {
  format: string;
  url: any;
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

// Backend API base
const API_BASE_URL = 'https://file-sharing-backend-d4ri.onrender.com';

export const FileStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Removed unused files state

  const clearExpiredFiles = useCallback(() => {
    // No local storage expiration logic needed now
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.id; // unique file ID for sharing
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Upload failed. Please try again.');
    }
  }, []);

  const getFile = useCallback(async (id: string): Promise<StoredFile | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/file/${id}`);
      if (!response.ok) {
        console.error("Fetch failed:", response.statusText);
        return null;
      }

      const data = await response.json();

      return {
        id: data.id,
        name: data.name,
        size: data.size,
        type: data.type,
        publicId: data.publicId,
        createdAt: new Date(data.createdAt).getTime(),
      };
    } catch (error) {
      console.error('Backend fetch error:', error);
      return null;
    }
  }, []);

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
