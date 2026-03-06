<?php
/**
 * 用户注册API接口（简化版，无JWT认证）
 * POST /api/endpoints/register.php
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';

// 只允许POST请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    apiResponse(405, '只允许POST请求', null, false);
}

try {
    // 获取请求数据
    $input = json_decode(file_get_contents('php://input'), true);
    
    // 验证必填字段
    if (empty($input['username']) || empty($input['email']) || empty($input['password'])) {
        apiResponse(HTTP_BAD_REQUEST, '用户名、邮箱和密码为必填项', null, false);
    }
    
    // 验证数据格式
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        apiResponse(HTTP_BAD_REQUEST, '邮箱格式不正确', null, false);
    }
    
    if (strlen($input['password']) < 6) {
        apiResponse(HTTP_BAD_REQUEST, '密码长度至少6位', null, false);
    }
    
    if (strlen($input['username']) < 3 || strlen($input['username']) > 50) {
        apiResponse(HTTP_BAD_REQUEST, '用户名长度应在3-50个字符之间', null, false);
    }
    
    // 验证用户名格式（只允许字母、数字、下划线）
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $input['username'])) {
        apiResponse(HTTP_BAD_REQUEST, '用户名只能包含字母、数字和下划线', null, false);
    }
    
    // 连接数据库
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        logMessage('数据库连接失败', 'ERROR');
        apiResponse(HTTP_INTERNAL_SERVER_ERROR, '数据库连接失败', null, false);
    }
    
    // 创建用户对象
    $user = new User($db);
    
    // 确保用户表存在
    $user->createTable();
    
    // 检查用户名是否已存在
    if ($user->usernameExists($input['username'])) {
        apiResponse(HTTP_CONFLICT, '用户名已存在', null, false);
    }
    
    // 检查邮箱是否已存在
    if ($user->emailExists($input['email'])) {
        apiResponse(HTTP_CONFLICT, '邮箱已被注册', null, false);
    }
    
    // 设置用户属性
    $user->username = $input['username'];
    $user->email = $input['email'];
    $user->phone = $input['phone'] ?? null;
    $user->password = $input['password'];
    $user->avatar = $input['avatar'] ?? '👤';
    $user->bio = $input['bio'] ?? '智慧农业用户';
    
    // 执行注册
    if ($user->register()) {
        // 记录日志
        logMessage("用户注册成功: {$user->username} (ID: {$user->id})", 'INFO');
        
        // 返回成功响应（无JWT token）
        $responseData = [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'user_mode' => 'logged_in'
            ]
        ];
        
        apiResponse(HTTP_CREATED, '注册成功', $responseData);
        
    } else {
        logMessage("用户注册失败: {$input['username']}", 'ERROR');
        apiResponse(HTTP_INTERNAL_SERVER_ERROR, '注册失败，请稍后重试', null, false);
    }
    
} catch (Exception $e) {
    logMessage("注册接口异常: " . $e->getMessage(), 'ERROR');
    apiResponse(HTTP_INTERNAL_SERVER_ERROR, '服务器内部错误', null, false);
} finally {
    // 关闭数据库连接
    if (isset($database)) {
        $database->closeConnection();
    }
}
?>
