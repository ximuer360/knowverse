const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// 创建上传目录结构
const createUploadDirs = async () => {
  try {
    // 基础目录
    const baseUploadDirs = ['uploads/covers', 'uploads/files'];
    
    // 确保基础目录存在
    for (const dir of baseUploadDirs) {
      const fullPath = path.join(__dirname, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created base directory: ${fullPath}`);
      }
    }

    // 从数据库获取分类列表
    const db = require('./config/database');
    const [categories] = await db.query('SELECT id, name FROM categories');

    // 为每个分类创建对应的目录
    categories.forEach(category => {
      const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
      
      // 创建封面图片目录
      const coverDir = path.join(__dirname, 'uploads/covers', categorySlug);
      if (!fs.existsSync(coverDir)) {
        fs.mkdirSync(coverDir, { recursive: true });
        console.log(`Created cover directory: ${coverDir}`);
      }

      // 创建资源文件目录
      const fileDir = path.join(__dirname, 'uploads/files', categorySlug);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
        console.log(`Created file directory: ${fileDir}`);
      }
    });

    console.log('All upload directories created successfully');
  } catch (error) {
    console.error('Error creating upload directories:', error);
  }
};

// 在应用启动时创建目录
createUploadDirs();

const categoryRoutes = require('./routes/categories');
const resourceRoutes = require('./routes/resources');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/categories', categoryRoutes);
app.use('/api/resources', resourceRoutes);

const PORT = process.env.PORT || 5001;

// 添加错误处理
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
    app.listen(PORT + 1);
  } else {
    console.error('Server error:', err);
  }
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});