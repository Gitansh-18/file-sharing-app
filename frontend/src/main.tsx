import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { FileStorageProvider } from './contexts/FileStorageContext'; // ✅ make sure this path is correct

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <FileStorageProvider> {/* ✅ wrap App inside the provider */}
        <App />
      </FileStorageProvider>
    </StrictMode>
  );
}


