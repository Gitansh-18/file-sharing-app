import React, { useState } from 'react';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://file-sharing-backend-d4ri.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Upload success! File ID: ${data.fileId}`);
      } else {
        setMessage(data.error || 'Upload failed');
      }
    } catch {
      setMessage('Upload failed');
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
      <p>{message}</p>
    </form>
  );
};

export default Upload;
