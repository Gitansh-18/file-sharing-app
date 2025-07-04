const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const cloudinary = require('cloudinary').v2;
const File = require('./models/file');
const path = require('path');
const axios = require('axios');
const streamifier = require('streamifier'); // npm install streamifier

// Load environment variables
require('dotenv').config({ path: __dirname + '/.env' });

console.log('Environment variables:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'loaded' : 'missing',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'loaded' : 'missing'
});

// Setup Express
const app = express();
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Route
app.post('/api/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file;
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext);
    const id = nanoid(10);
    const publicId = `files/${baseName}-${id}${ext}`;

    // Upload using streamifier to ensure correct binary upload
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: publicId,
      },
      async (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          return res.status(500).json({ error: 'Upload failed' });
        }
        const fileData = new File({
          id,
          name: file.name,
          size: file.size,
          type: file.mimetype,
          publicId: result.public_id,
          url: result.secure_url,
          createdAt: Date.now(),
        });
        await fileData.save();
        res.json({
          id,
          url: result.secure_url,
          name: file.name,
        });
      }
    );
    streamifier.createReadStream(file.data).pipe(uploadStream);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Download Route (returns Cloudinary URL with original filename)
app.get('/api/file/:id', async (req, res) => {
  try {
    const file = await File.findOne({ id: req.params.id });
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Use the original filename in the download URL
    const encodedName = encodeURIComponent(file.name);
    const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/fl_attachment:${encodedName}/${file.publicId}`;
    res.json({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url,
      createdAt: file.createdAt
    });
  } catch (err) {
    console.error('Fetch file error:', err);
    res.status(500).json({ error: 'Error retrieving file' });
  }
});

// Download Route (streams file from Cloudinary)
app.get('/api/download/:id', async (req, res) => {
  try {
    const file = await File.findOne({ id: req.params.id });
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Cloudinary direct file URL
    const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${file.publicId}`;

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', file.type);

    // Stream from Cloudinary to client
    const response = await axios({
      method: 'get',
      url: cloudinaryUrl,
      responseType: 'stream'
    });

    response.data.pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
