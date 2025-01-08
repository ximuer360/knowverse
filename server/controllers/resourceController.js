const db = require('../config/database');
const path = require('path');

// 添加一个辅助函数来处理文件路径
const getRelativePath = (absolutePath) => {
  if (!absolutePath) return null;
  // 将绝对路径转换为相对于 uploads 目录的路径
  const relativePath = path.relative(
    path.join(__dirname, '..'),
    absolutePath
  ).replace(/\\/g, '/');
  return relativePath;
};

exports.getAllResources = async (req, res) => {
  try {
    console.log('Fetching all resources...');
    const [resources] = await db.query(`
      SELECT r.*, c.name as category_name 
      FROM resources r 
      LEFT JOIN categories c ON r.category_id = c.id 
      ORDER BY r.created_at DESC
    `);
    console.log('Resources fetched:', resources);
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const [resources] = await db.query(
      `SELECT r.*, c.name as category_name 
       FROM resources r 
       LEFT JOIN categories c ON r.category_id = c.id 
       WHERE r.id = ?`,
      [req.params.id]
    );
    if (resources.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resources[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    console.log('Creating resource:', {
      body: req.body,
      files: req.files
    });

    const { title, description, category_id } = req.body;

    // 确保 category_id 是数字
    const parsedCategoryId = parseInt(category_id);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: 'Invalid category_id' });
    }

    // 处理文件路径
    const file_path = req.files?.file?.[0] ? getRelativePath(req.files.file[0].path) : null;
    const cover_image = req.files?.cover_image?.[0] ? getRelativePath(req.files.cover_image[0].path) : null;
    const thumbnail = req.thumbnailPath || null;

    // 检查分类是否存在
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [parsedCategoryId]
    );

    if (categories.length === 0) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const [result] = await db.query(
      'INSERT INTO resources (title, description, category_id, file_path, cover_image, thumbnail) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, parsedCategoryId, file_path, cover_image, thumbnail]
    );

    console.log('Insert result:', result);

    // 获取新创建的资源完整信息
    const [newResource] = await db.query(
      `SELECT r.*, c.name as category_name 
       FROM resources r 
       LEFT JOIN categories c ON r.category_id = c.id 
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Resource created successfully',
      resource: newResource[0]
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ 
      message: 'Error creating resource', 
      error: error.message,
      stack: error.stack
    });
  }
};

exports.searchResources = async (req, res) => {
  try {
    const { q } = req.query;
    const [resources] = await db.query(
      `SELECT r.*, c.name as category_name 
       FROM resources r 
       LEFT JOIN categories c ON r.category_id = c.id 
       WHERE r.title LIKE ? OR r.description LIKE ?
       ORDER BY r.created_at DESC`,
      [`%${q}%`, `%${q}%`]
    );
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id } = req.body;
    
    // 检查资源是否存在
    const [existingResource] = await db.query(
      'SELECT * FROM resources WHERE id = ?',
      [id]
    );

    if (existingResource.length === 0) {
      console.log('Resource not found:', id);
      return res.status(404).json({ message: `Resource with id ${id} not found` });
    }

    console.log('Updating resource:', {
      id,
      body: req.body,
      files: req.files,
      existingResource: existingResource[0]
    });

    // 确保 category_id 是数字
    const parsedCategoryId = parseInt(category_id);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: 'Invalid category_id' });
    }

    let query = 'UPDATE resources SET title = ?, description = ?, category_id = ?';
    let params = [title, description, parsedCategoryId];

    if (req.files?.file?.[0]) {
      const file_path = getRelativePath(req.files.file[0].path);
      query += ', file_path = ?';
      params.push(file_path);
    }

    if (req.files?.cover_image?.[0]) {
      const cover_image = getRelativePath(req.files.cover_image[0].path);
      query += ', cover_image = ?';
      params.push(cover_image);
    }

    query += ' WHERE id = ?';
    params.push(id);

    console.log('SQL Query:', query);
    console.log('SQL Params:', params);

    const [result] = await db.query(query, params);
    console.log('Update result:', result);

    // 获取更新后的资源信息
    const [updatedResource] = await db.query(
      `SELECT r.*, c.name as category_name 
       FROM resources r 
       LEFT JOIN categories c ON r.category_id = c.id 
       WHERE r.id = ?`,
      [id]
    );

    res.json({
      message: 'Resource updated successfully',
      resource: updatedResource[0]
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ 
      message: 'Error updating resource', 
      error: error.message,
      stack: error.stack
    });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM resources WHERE id = ?', [id]);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: error.message });
  }
}; 