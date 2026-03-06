<?php
/**
 * 用户模型类
 * 处理用户相关的数据库操作
 */

require_once __DIR__ . '/../config/database.php';

class User {
    private $conn;
    private $table_name = "users";
    
    // 用户属性
    public $id;
    public $username;
    public $email;
    public $phone;
    public $password;
    public $avatar;
    public $bio;
    public $user_mode;
    public $is_active;
    public $created_at;
    public $updated_at;
    public $last_login;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * 创建用户表的SQL语句
     */
    public function createTable() {
        $query = "CREATE TABLE IF NOT EXISTS " . $this->table_name . " (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            phone VARCHAR(20) DEFAULT NULL,
            password VARCHAR(255) NOT NULL,
            avatar VARCHAR(255) DEFAULT '👤',
            bio VARCHAR(500) DEFAULT '智慧农业用户',
            user_mode ENUM('not_logged_in', 'guest', 'logged_in') DEFAULT 'not_logged_in',
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL DEFAULT NULL,
            INDEX idx_username (username),
            INDEX idx_email (email),
            INDEX idx_phone (phone)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        try {
            $stmt = $this->conn->prepare($query);
            return $stmt->execute();
        } catch(PDOException $exception) {
            error_log("创建用户表失败: " . $exception->getMessage());
            return false;
        }
    }
    
    /**
     * 用户注册
     * @return bool
     */
    public function register() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET username=:username, email=:email, phone=:phone, 
                      password=:password, avatar=:avatar, bio=:bio";
        
        $stmt = $this->conn->prepare($query);
        
        // 清理数据
        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);
        $this->avatar = htmlspecialchars(strip_tags($this->avatar));
        $this->bio = htmlspecialchars(strip_tags($this->bio));
        
        // 绑定参数
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":avatar", $this->avatar);
        $stmt->bindParam(":bio", $this->bio);
        
        try {
            if($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }
            return false;
        } catch(PDOException $exception) {
            error_log("用户注册失败: " . $exception->getMessage());
            return false;
        }
    }
    
    /**
     * 用户登录验证
     * @param string $login 用户名或邮箱
     * @param string $password 密码
     * @return bool
     */
    public function login($login, $password) {
        $query = "SELECT id, username, email, phone, password, avatar, bio, user_mode, is_active, last_login
                  FROM " . $this->table_name . " 
                  WHERE (username = :login1 OR email = :login2) AND is_active = 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":login1", $login);
        $stmt->bindParam(":login2", $login);
        
        try {
            $stmt->execute();
            
            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if(password_verify($password, $row['password'])) {
                    // 设置用户属性
                    $this->id = $row['id'];
                    $this->username = $row['username'];
                    $this->email = $row['email'];
                    $this->phone = $row['phone'];
                    $this->avatar = $row['avatar'];
                    $this->bio = $row['bio'];
                    $this->user_mode = $row['user_mode'];
                    $this->is_active = $row['is_active'];
                    $this->last_login = $row['last_login'];
                    
                    // 更新最后登录时间
                    $this->updateLastLogin();
                    
                    return true;
                }
            }
            return false;
        } catch(PDOException $exception) {
            error_log("用户登录失败: " . $exception->getMessage());
            return false;
        }
    }
    
    /**
     * 检查用户名是否存在
     * @param string $username
     * @return bool
     */
    public function usernameExists($username) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE username = :username";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
    
    /**
     * 检查邮箱是否存在
     * @param string $email
     * @return bool
     */
    public function emailExists($email) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
    
    /**
     * 根据ID获取用户信息
     * @param int $id
     * @return bool
     */
    public function getUserById($id) {
        $query = "SELECT id, username, email, phone, avatar, bio, user_mode, is_active, created_at, last_login
                  FROM " . $this->table_name . " 
                  WHERE id = :id AND is_active = 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        
        try {
            $stmt->execute();
            
            if($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                $this->id = $row['id'];
                $this->username = $row['username'];
                $this->email = $row['email'];
                $this->phone = $row['phone'];
                $this->avatar = $row['avatar'];
                $this->bio = $row['bio'];
                $this->user_mode = $row['user_mode'];
                $this->is_active = $row['is_active'];
                $this->created_at = $row['created_at'];
                $this->last_login = $row['last_login'];
                
                return true;
            }
            return false;
        } catch(PDOException $exception) {
            error_log("获取用户信息失败: " . $exception->getMessage());
            return false;
        }
    }
    
    /**
     * 更新用户模式
     * @param string $mode
     * @return bool
     */
    public function updateUserMode($mode) {
        $query = "UPDATE " . $this->table_name . " 
                  SET user_mode = :mode, updated_at = CURRENT_TIMESTAMP 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":mode", $mode);
        $stmt->bindParam(":id", $this->id);
        
        try {
            return $stmt->execute();
        } catch(PDOException $exception) {
            error_log("更新用户模式失败: " . $exception->getMessage());
            return false;
        }
    }
    
    /**
     * 更新最后登录时间
     * @return bool
     */
    private function updateLastLogin() {
        $query = "UPDATE " . $this->table_name . " 
                  SET last_login = CURRENT_TIMESTAMP, user_mode = 'logged_in' 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        
        try {
            return $stmt->execute();
        } catch(PDOException $exception) {
            error_log("更新最后登录时间失败: " . $exception->getMessage());
            return false;
        }
    }
    
    /**
     * 获取用户公开信息（不包含敏感数据）
     * @return array
     */
    public function getPublicInfo() {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'bio' => $this->bio,
            'user_mode' => $this->user_mode,
            'created_at' => $this->created_at,
            'last_login' => $this->last_login
        ];
    }
    
    /**
     * 验证密码是否正确
     * @param string $password 明文密码
     * @return bool
     */
    public function verifyPassword($password) {
        // 需要先加载用户的密码哈希值
        $query = "SELECT password FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        
        try {
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                return password_verify($password, $row['password']);
            }
            return false;
        } catch (PDOException $exception) {
            error_log("验证密码失败: " . $exception->getMessage());
            return false;
        }
    }
    
    /**
     * 更新用户密码
     * @param string $newPassword 新密码（明文）
     * @return bool
     */
    public function updatePassword($newPassword) {
        // 对新密码进行加密
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        $query = "UPDATE " . $this->table_name . " 
                  SET password = :password, updated_at = CURRENT_TIMESTAMP 
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":password", $hashedPassword);
        $stmt->bindParam(":id", $this->id);
        
        try {
            return $stmt->execute();
        } catch (PDOException $exception) {
            error_log("更新密码失败: " . $exception->getMessage());
            return false;
        }
    }
}
?>