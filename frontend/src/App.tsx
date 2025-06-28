import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FileStorageProvider } from './contexts/FileStorageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import UploadSuccess from './pages/UploadSuccess';
import Download from './pages/Download';
import NotFound from './pages/NotFound';

function App() {
  return (
    <FileStorageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="success/:fileId" element={<UploadSuccess />} />
            <Route path="download/:fileId" element={<Download />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </FileStorageProvider>
  );
}

export default App;