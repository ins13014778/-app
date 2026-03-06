<?php
/**
 * 数据库配置文件
 * 用于智慧农场监测应用的API接口
 */

class Database {
    // 数据库连接参数
    private $host = 'localhost';
    private $db_name = 'hm_zybbq_xyz';
    private $username = 'hm_zybbq_xyz';
    private $password = 'weMYKHRSJ6Pc91mG';
    private $charset = 'utf8mb4';
    
    public $conn;
    
    /**
     * 获取数据库连接
     * @return PDO|null
     */
    public function getConnection() {
        $this->conn = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $exception) {
            error_log("数据库连接错误: " . $exception->getMessage());
            return null;
        }
        
        return $this->conn;
    }
    
    /**
     * 关闭数据库连接
     */
    public function closeConnection() {
        $this->conn = null;
    }
}
?>