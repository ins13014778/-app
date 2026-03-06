<?php
/**
 * 用户登录API接口（简化版，无JWT认证）
 * POST /api/endpoints/login.php
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
    if (empty($input['login']) || empty($input['password'])) {
        apiResponse(HTTP_BAD_REQUEST, '用户名/邮箱和密码为必填项', null, false);
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
    
    // 执行登录验证
    if ($user->login($input['login'], $input['password'])) {
        // 记录登录日志
        logMessage("用户登录成功: {$user->username} (ID: {$user->id})", 'INFO');
        
        // 返回成功响应（无JWT token）
        $responseData = [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'user_mode' => 'logged_in',
                'last_login' => $user->last_login,
                'is_admin' => $user->is_admin ?? 0
            ]
        ];
        
        apiResponse(HTTP_OK, '登录成功', $responseData);
        
    } else {
        // 记录登录失败日志
        logMessage("用户登录失败: {$input['login']}", 'WARNING');
        apiResponse(HTTP_UNAUTHORIZED, '用户名/邮箱或密码错误', null, false);
    }
    
} catch (Exception $e) {
    logMessage("登录接口异常: " . $e->getMessage(), 'ERROR');
    apiResponse(HTTP_INTERNAL_SERVER_ERROR, '服务器内部错误', null, false);
} finally {
    // 关闭数据库连接
    if (isset($database)) {
        $database->closeConnection();
    }
}
?>
