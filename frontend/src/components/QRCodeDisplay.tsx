import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Copy, Check, Download } from 'lucide-react';

interface QRCodeDisplayProps {
  url: string;
  downloadCode: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url, downloadCode }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      // Download PNG
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrdrop-${downloadCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <QRCode
          id="qr-code"
          value={url}
          size={200}
          level="H"
          className="mx-auto"
        />
      </div>
      
      <div className="mt-5 w-full">
        <div className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded shadow-sm">
          <span className="text-gray-700 font-medium select-all text-sm truncate max-w-[200px] md:max-w-[400px]">
            {url}
          </span>
          <button
            onClick={copyToClipboard}
            className="ml-2 p-2 text-gray-500 hover:text-blue-500 transition-colors"
            aria-label="Copy link to clipboard"
          >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={downloadQRCode}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download QR Code</span>
          </button>
        </div>
        
        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            Files are automatically deleted after 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;