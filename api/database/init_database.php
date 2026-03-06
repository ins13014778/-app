<?php
/**
 * 数据库初始化脚本
 * 自动创建数据库和表结构
 * 运行方式: php init_database.php
 */

require_once __DIR__ . '/../config/database.php';

echo "========================================\n";
echo "智慧农场数据库初始化工具\n";
echo "========================================\n\n";

try {
    // 连接数据库
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        die("错误: 无法连接到数据库服务器\n");
    }
    
    echo "✓ 数据库连接成功\n\n";
    
    // 创建用户表
    echo "正在创建用户表...\n";
    $createUsersTable = "CREATE TABLE IF NOT EXISTS `users` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表'";
    
    $stmt = $conn->prepare($createUsersTable);
    if ($stmt->execute()) {
        echo "✓ 用户表创建成功\n\n";
    } else {
        echo "✗ 用户表创建失败\n\n";
    }
    
    // 检查是否已有测试数据
    $checkQuery = "SELECT COUNT(*) as count FROM users WHERE username = 'testuser'";
    $stmt = $conn->query($checkQuery);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($row['count'] == 0) {
        echo "正在插入测试数据...\n";
        // 插入测试用户（密码: test123）
        $insertTest = "INSERT INTO `users` (`username`, `email`, `phone`, `password`, `avatar`, `bio`) 
        VALUES ('testuser', 'test@example.com', '13800138000', :password, '👨‍🌾', '智慧农场测试用户')";
        
        $stmt = $conn->prepare($insertTest);
        $hashedPassword = password_hash('test123', PASSWORD_DEFAULT);
        $stmt->bindParam(':password', $hashedPassword);
        
        if ($stmt->execute()) {
            echo "✓ 测试用户创建成功\n";
            echo "  用户名: testuser\n";
            echo "  密码: test123\n";
            echo "  邮箱: test@example.com\n\n";
        }
    } else {
        echo "⚠ 测试用户已存在，跳过插入\n\n";
    }
    
    // 显示表信息
    echo "========================================\n";
    echo "数据库表结构:\n";
    echo "========================================\n";
    $stmt = $conn->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        printf("%-15s %-20s %s\n", 
            $column['Field'], 
            $column['Type'], 
            $column['Null'] == 'NO' ? 'NOT NULL' : 'NULL'
        );
    }
    
    echo "\n========================================\n";
    echo "✓ 数据库初始化完成！\n";
    echo "========================================\n\n";
    
    echo "测试登录信息:\n";
    echo "用户名: testuser\n";
    echo "密码: test123\n\n";
    
    $database->closeConnection();
    
} catch (Exception $e) {
    echo "✗ 错误: " . $e->getMessage() . "\n";
    exit(1);
}
?>

