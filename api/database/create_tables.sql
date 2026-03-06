-- ============================================
-- 智慧农场监测应用 - 数据库表结构
-- 创建时间: 2024
-- 数据库: smart_farm_db
-- 字符集: utf8mb4
-- ============================================

-- 1. 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS smart_farm_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE smart_farm_db;

-- 2. 创建用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱地址',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '加密密码',
  `avatar` VARCHAR(255) DEFAULT '👤' COMMENT '用户头像',
  `bio` VARCHAR(500) DEFAULT '智慧农业用户' COMMENT '个人简介',
  `user_mode` ENUM('not_logged_in', 'guest', 'logged_in') DEFAULT 'not_logged_in' COMMENT '用户模式',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '账号是否激活',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login` TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
  
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 3. 创建登录日志表（可选，用于安全审计）
CREATE TABLE IF NOT EXISTS `login_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
  `user_id` INT UNSIGNED DEFAULT NULL COMMENT '用户ID',
  `username` VARCHAR(50) DEFAULT NULL COMMENT '登录用户名',
  `login_type` ENUM('success', 'failed') NOT NULL COMMENT '登录类型',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理',
  `login_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_login_time` (`login_time`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表';

-- 4. 插入测试数据（可选）
-- 注意：密码是 'test123' 的bcrypt加密结果
INSERT INTO `users` (`username`, `email`, `phone`, `password`, `avatar`, `bio`) 
VALUES 
  ('testuser', 'test@example.com', '13800138000', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '👨‍🌾', '智慧农场测试用户'),
  ('admin', 'admin@smartfarm.com', '13900139000', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '👨‍💼', '系统管理员')
ON DUPLICATE KEY UPDATE username=username;

-- 5. 显示表结构
DESCRIBE users;
DESCRIBE login_logs;

-- 6. 显示创建结果
SELECT 'Database and tables created successfully!' AS status;

