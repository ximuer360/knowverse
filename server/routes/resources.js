const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const resourceController = require('../controllers/resourceController');

// 配置文件上传
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const db = require('../config/database');
      const categoryId = req.body.category_id;
      const [categories] = await db.query('SELECT name FROM categories WHERE id = ?', [categoryId]);
      
      if (categories.length === 0) {
        return cb(new Error('Category not found'));
      }

      const categorySlug = categories[0].name.toLowerCase().replace(/\s+/g, '-');
      const baseDir = file.fieldname === 'cover_image' ? 'uploads/covers' : 'uploads/files';
      const uploadDir = path.join(__dirname, '..', baseDir, categorySlug);

      // 如果是封面图片，创建缩略图目录
      if (file.fieldname === 'cover_image') {
        const thumbDir = path.join(uploadDir, 'thumbnails');
        if (!fs.existsSync(thumbDir)) {
          fs.mkdirSync(thumbDir, { recursive: true });
        }
      }

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'cover_image') {
      // 只允许图片文件
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('只允许上传图片文件！'));
      }
    } else if (file.fieldname === 'file') {
      // 允许的文件类型
      const allowedTypes = ['.pdf', '.doc', '.docx', '.zip', '.rar'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedTypes.includes(ext)) {
        return cb(new Error('不支持的文件类型！'));
      }
    }
    cb(null, true);
  }
});

const uploadFields = upload.fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]);

// 添加错误处理中间件
const handleUpload = (req, res, next) => {
  uploadFields(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ 
        message: 'File upload error', 
        error: err.message 
      });
    }
    next();
  });
};

// 添加请求日志中间件
const logRequest = (req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  console.log('Request Body:', req.body);
  console.log('Request Params:', req.params);
  next();
};

// 图片处理中间件
const processImage = async (req, res, next) => {
  try {
    if (!req.files?.cover_image?.[0]) return next();

    const file = req.files.cover_image[0];
    const dir = path.dirname(file.path);
    const filename = path.basename(file.path);
    const thumbDir = path.join(dir, 'thumbnails');
    const thumbPath = path.join(thumbDir, filename);

    // 生成缩略图
    await sharp(file.path)
      .resize(357, 214, {
        fit: 'cover',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(thumbPath);

    req.thumbnailPath = path.relative(path.join(__dirname, '..'), thumbPath).replace(/\\/g, '/');
  } catch (error) {
    console.error('Error processing image:', error);
  }
  next();
};

router.get('/', resourceController.getAllResources);
router.get('/search', resourceController.searchResources);
router.get('/:id', resourceController.getResourceById);
router.post('/', uploadFields, processImage, resourceController.createResource);
router.put('/:id', logRequest, handleUpload, processImage, resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

module.exports = router; 