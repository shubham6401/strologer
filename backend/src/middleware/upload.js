const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer memory storage (allows checking buffer or streaming to Cloudinary or disk)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedMimeTypes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter,
});

/**
 * Uploads a file buffer to Cloudinary (if configured) or writes to local disk
 * @param {Object} file - Express file object with buffer
 * @param {string} folder - Destination folder name (e.g. 'qr-codes', 'screenshots', 'profiles')
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToStorage = async (file, folder = 'astrology') => {
  if (!file) throw new Error('No file provided');

  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `strologer/${folder}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // If running on Vercel or Serverless (read-only filesystem), store as self-contained Base64 Data URI
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const mime = file.mimetype || 'image/png';
    const base64Data = file.buffer.toString('base64');
    return {
      url: `data:${mime};base64,${base64Data}`,
      publicId: `${folder}-${Date.now()}`,
    };
  }

  // Fallback: Local disk storage (or data URI if disk is read-only)
  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const filename = `${folder}-${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return {
      url: `/uploads/${filename}`,
      publicId: filename,
    };
  } catch (diskErr) {
    console.warn('[Storage] Disk write failed, falling back to Base64 Data URI:', diskErr.message);
    const mime = file.mimetype || 'image/png';
    const base64Data = file.buffer.toString('base64');
    return {
      url: `data:${mime};base64,${base64Data}`,
      publicId: `${folder}-${Date.now()}`,
    };
  }
};

module.exports = {
  upload,
  uploadToStorage,
};

