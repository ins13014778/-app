<?php
/**
 * 修改密码API接口（简化版，无JWT认证）
 * POST /api/profile/change-password.php
 */

require_once dirname(__DIR__) . '/config/config.php';
require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/models/User.php';

// 只允许POST请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    apiResponse(405, '只允许POST请求', null, false);
}

try {
    // 获取请求数据
    $input = json_decode(file_get_contents('php://input'), true);

    // 验证必填字段
    if (empty($input['user_id'])) {
        apiResponse(HTTP_BAD_REQUEST, '缺少user_id参数', null, false);
    }

    if (empty($input['old_password']) || empty($input['new_password'])) {
        apiResponse(HTTP_BAD_REQUEST, '旧密码和新密码为必填项', null, false);
    }

    $userId = intval($input['user_id']);
    $oldPassword = $input['old_password'];
    $newPassword = $input['new_password'];

    // 验证新密码长度
    if (strlen($newPassword) < 6) {
        apiResponse(HTTP_BAD_REQUEST, '新密码长度不能少于6位', null, false);
    }

    if (strlen($newPassword) > 20) {
        apiResponse(HTTP_BAD_REQUEST, '新密码长度不能超过20位', null, false);
    }

    // 验证新旧密码是否相同
    if ($oldPassword === $newPassword) {
        apiResponse(HTTP_BAD_REQUEST, '新密码不能与旧密码相同', null, false);
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

    // 获取当前用户信息
    if (!$user->getUserById($userId)) {
        apiResponse(HTTP_NOT_FOUND, '用户不存在', null, false);
    }

    // 验证旧密码是否正确
    if (!$user->verifyPassword($oldPassword)) {
        logMessage("用户密码验证失败: {$user->username} (ID: {$user->id})", 'WARNING');
        apiResponse(HTTP_UNAUTHORIZED, '旧密码错误', null, false);
    }

    // 更新密码
    if ($user->updatePassword($newPassword)) {
        logMessage("用户密码更新成功: {$user->username} (ID: {$user->id})", 'INFO');

        $responseData = [
            'message' => '密码修改成功',
            'username' => $user->username
        ];

        apiResponse(HTTP_OK, '密码修改成功', $responseData);
    } else {
        logMessage("用户密码更新失败: ID {$userId}", 'ERROR');
        apiResponse(HTTP_INTERNAL_SERVER_ERROR, '密码修改失败，请稍后重试', null, false);
    }

} catch (Exception $e) {
    logMessage("修改密码接口异常: " . $e->getMessage(), 'ERROR');
    apiResponse(HTTP_INTERNAL_SERVER_ERROR, '服务器内部错误', null, false);
} finally {
    // 关闭数据库连接
    if (isset($database)) {
        $database->closeConnection();
    }
}
?>
