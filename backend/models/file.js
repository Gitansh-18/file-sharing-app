const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  publicId: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // 24 hours
});

// ✅ EXPORT this model for use in routes
module.exports = mongoose.model('File', FileSchema);
