<?php
/**
 * 用户信息API接口（简化版，无JWT认证）
 * GET /api/endpoints/profile.php?user_id={id} - 获取用户信息
 * PUT /api/endpoints/profile.php - 更新用户信息（body中包含user_id）
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';

// 获取用户ID（从URL参数或请求体）
$user_id = null;
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
} else {
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = isset($input['user_id']) ? intval($input['user_id']) : null;
}

if (!$user_id) {
    apiResponse(HTTP_BAD_REQUEST, '缺少user_id参数', null, false);
}

try {
    // 连接数据库
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        logMessage('数据库连接失败', 'ERROR');
        apiResponse(HTTP_INTERNAL_SERVER_ERROR, '数据库连接失败', null, false);
    }
    
    // 创建用户对象
    $user = new User($db);
    
    // 根据请求方法处理
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            // 获取用户信息
            if ($user->getUserById($user_id)) {
                $responseData = $user->getPublicInfo();
                apiResponse(HTTP_OK, '获取用户信息成功', $responseData);
            } else {
                apiResponse(HTTP_NOT_FOUND, '用户不存在', null, false);
            }
            break;
            
        case 'PUT':
        case 'POST':
            // 更新用户信息 (同时支持 PUT 和 POST 方法)
            // 注意: $input 已在第17行读取，php://input只能读取一次
            
            // 获取当前用户信息
            if (!$user->getUserById($user_id)) {
                apiResponse(HTTP_NOT_FOUND, '用户不存在', null, false);
            }
            
            // 准备更新SQL
            $updateFields = [];
            $params = [];
            
            // 检查可更新的字段
            if (isset($input['phone'])) {
                $updateFields[] = "phone = :phone";
                $params[':phone'] = htmlspecialchars(strip_tags($input['phone']));
            }
            
            if (isset($input['avatar'])) {
                $updateFields[] = "avatar = :avatar";
                $params[':avatar'] = htmlspecialchars(strip_tags($input['avatar']));
            }
            
            if (isset($input['bio'])) {
                $updateFields[] = "bio = :bio";
                $params[':bio'] = htmlspecialchars(strip_tags($input['bio']));
            }
            
            if (isset($input['user_mode']) && in_array($input['user_mode'], ['not_logged_in', 'guest', 'logged_in'])) {
                $updateFields[] = "user_mode = :user_mode";
                $params[':user_mode'] = $input['user_mode'];
            }
            
            if (empty($updateFields)) {
                apiResponse(HTTP_BAD_REQUEST, '没有可更新的字段', null, false);
            }
            
            // 执行更新
            $query = "UPDATE users SET " . implode(', ', $updateFields) . ", updated_at = CURRENT_TIMESTAMP WHERE id = :user_id";
            $params[':user_id'] = $user_id;
            
            $stmt = $db->prepare($query);
            
            if ($stmt->execute($params)) {
                // 获取更新后的用户信息
                $user->getUserById($user_id);
                $responseData = $user->getPublicInfo();
                
                logMessage("用户信息更新成功: {$user->username} (ID: {$user->id})", 'INFO');
                apiResponse(HTTP_OK, '用户信息更新成功', $responseData);
            } else {
                logMessage("用户信息更新失败: ID {$user_id}", 'ERROR');
                apiResponse(HTTP_INTERNAL_SERVER_ERROR, '更新失败', null, false);
            }
            break;
            
        default:
            apiResponse(405, '不支持的请求方法', null, false);
            break;
    }
    
} catch (Exception $e) {
    logMessage("用户信息接口异常: " . $e->getMessage(), 'ERROR');
    apiResponse(HTTP_INTERNAL_SERVER_ERROR, '服务器内部错误', null, false);
} finally {
    // 关闭数据库连接
    if (isset($database)) {
        $database->closeConnection();
    }
}
?>
