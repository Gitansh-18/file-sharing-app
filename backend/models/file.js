const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  publicId: { type: String, required: true },
  url: { type: String, required: true }, // Store the Cloudinary URL
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // expire after 24 hours
});

module.exports = mongoose.model('File', FileSchema);

