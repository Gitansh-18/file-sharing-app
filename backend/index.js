const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const cloudinary = require('cloudinary').v2;
const File = require('./models/file');

// Load environment variables
console.log('Does .env exist?', fs.existsSync(__dirname + '/.env'));
console.log('Raw .env content:', fs.readFileSync(__dirname + '/.env', 'utf8'));

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
console.log('Mongo URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
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
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'raw',
      public_id: `files/${nanoid(10)}`,
    });

    const id = nanoid(10);
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

    const shareableLink = `${req.protocol}://${req.get('host')}/api/file/${id}`;

    res.json({
      id,
      name: file.name,
      url: result.secure_url,
      shareableLink,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Download Route
app.get('/api/file/:id', async (req, res) => {
  try {
    const file = await File.findOne({ id: req.params.id });
    if (!file) return res.status(404).json({ error: 'File not found' });

    res.json({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.url || `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${file.publicId}`,
      createdAt: file.createdAt,
    });
  } catch (err) {
    console.error('Fetch file error:', err);
    res.status(500).json({ error: 'Error retrieving file' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

