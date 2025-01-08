-- 删除已存在的数据库（如果需要重新创建）
DROP DATABASE IF EXISTS knowverse;

-- 创建数据库
CREATE DATABASE knowverse DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE knowverse;

-- 创建分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建资源表
CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    --thumbnail VARCHAR(255),
    file_path VARCHAR(255),
    category_id INT,
    views INT DEFAULT 0,
    downloads INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入测试分类数据
INSERT INTO categories (name, description) VALUES
('AI开发', 'AI相关的开发资源'),
('前端开发', '前端开发相关资源'),
('后端开发', '后端开发相关资源'),
('语言学习', '编程语言学习资源');

-- 插入测试资源数据
INSERT INTO resources (title, description, category_id, views, downloads) VALUES
('AI实战精英课', 'ChatGPT AI实战教程，一起抓住AI风口的机会', 1, 2770, 156),
('React完全指南', 'React入门到精通的完整教程', 2, 1580, 89),
('Node.js实战', 'Node.js后端开发实战教程', 3, 980, 45),
('Python基础教程', 'Python编程语言入门教程', 4, 2100, 134); 

ALTER TABLE resources ADD COLUMN thumbnail VARCHAR(255) AFTER cover_image; 