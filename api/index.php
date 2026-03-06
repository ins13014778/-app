<?php
/**
 * 智慧农场监测应用 API 主入口
 * 统一路由处理
 */

require_once __DIR__ . '/config/config.php';

// 获取请求路径
$request_uri = $_SERVER['REQUEST_URI'];
$script_name = $_SERVER['SCRIPT_NAME'];
$path = str_replace(dirname($script_name), '', $request_uri);
$path = trim($path, '/');

// 移除查询参数
if (($pos = strpos($path, '?')) !== false) {
    $path = substr($path, 0, $pos);
}

// 路由映射
$routes = [
    'api/register' => 'endpoints/register.php',
    'api/login' => 'endpoints/login.php',
    'api/profile' => 'endpoints/profile.php',
    'register' => 'endpoints/register.php',
    'login' => 'endpoints/login.php',
    'profile' => 'endpoints/profile.php',
    // 传感器数据路由
    'api/sensor_data/endpoints/upload' => 'sensor_data/endpoints/upload.php',
    'api/sensor_data/endpoints/batch_upload' => 'sensor_data/endpoints/batch_upload.php',
    'api/sensor_data/endpoints/query' => 'sensor_data/endpoints/query.php',
    'api/sensor_data/endpoints/latest' => 'sensor_data/endpoints/latest.php',
    'api/sensor_data/endpoints/stats' => 'sensor_data/endpoints/stats.php',
    'sensor_data/endpoints/upload' => 'sensor_data/endpoints/upload.php',
    'sensor_data/endpoints/batch_upload' => 'sensor_data/endpoints/batch_upload.php',
    'sensor_data/endpoints/query' => 'sensor_data/endpoints/query.php',
    'sensor_data/endpoints/latest' => 'sensor_data/endpoints/latest.php',
    'sensor_data/endpoints/stats' => 'sensor_data/endpoints/stats.php',
    // 修改密码路由
    'api/profile/change-password' => 'profile/change-password.php',
    'profile/change-password' => 'profile/change-password.php',
    // 推送消息路由（巴法云）
    'api/push-message' => 'endpoints/push_message.php',
    'push-message' => 'endpoints/push_message.php',
    // 获取消息路由（巴法云）
    'api/get-message' => 'endpoints/get_message.php',
    'get-message' => 'endpoints/get_message.php'
    ,
    // 设备数据与控制（v1）
    'api/device/v1/data/raw' => 'device_v1/endpoints/data_raw.php',
    'api/device/v1/data/processed' => 'device_v1/endpoints/data_processed.php',
    'api/device/v1/status' => 'device_v1/endpoints/status.php',
    'api/device/v1/command' => 'device_v1/endpoints/command.php',
    'device/v1/data/raw' => 'device_v1/endpoints/data_raw.php',
    'device/v1/data/processed' => 'device_v1/endpoints/data_processed.php',
    'device/v1/status' => 'device_v1/endpoints/status.php',
    'device/v1/command' => 'device_v1/endpoints/command.php'
];

// 记录API访问日志
logMessage("API访问: {$_SERVER['REQUEST_METHOD']} /{$path} - IP: {$_SERVER['REMOTE_ADDR']}", 'INFO');

// 路由处理
if (empty($path) || $path === 'api') {
    // API根路径，返回API信息
    $apiInfo = [
        'name' => '智慧厨房检测系统API',
        'version' => API_VERSION,
        'description' => '为鸿蒙应用提供用户认证和数据管理服务',
        'endpoints' => [
            'POST /api/register' => '用户注册',
            'POST /api/login' => '用户登录',
            'GET /api/profile?user_id={id}' => '获取用户信息',
            'PUT /api/profile' => '更新用户信息（body中包含user_id）',
            'POST /api/profile/change-password' => '修改密码（body中包含user_id）',
            'POST /api/sensor_data/endpoints/upload.php' => '上传传感器数据',
            'POST /api/sensor_data/endpoints/batch_upload.php' => '批量上传传感器数据',
            'GET /api/sensor_data/endpoints/query.php' => '查询传感器数据',
            'GET /api/sensor_data/endpoints/latest.php' => '获取最新传感器数据',
            'GET /api/sensor_data/endpoints/stats.php' => '传感器数据统计'
            ,
            'POST /api/device/v1/data/raw' => '原始设备数据上报',
            'GET /api/device/v1/data/raw?device_id={id}&start_time&end_time&limit&offset&latest=1' => '原始设备数据查询',
            'POST /api/device/v1/data/processed' => '处理后设备数据上报',
            'GET /api/device/v1/data/processed?device_id={id}&start_time&end_time&limit&offset&latest=1' => '处理后设备数据查询',
            'GET /api/device/v1/status?device_id={id}' => '设备状态查询',
            'POST /api/device/v1/command' => '设备控制指令'
        ],
        'authentication' => 'None (JWT已移除)',
        'content_type' => 'application/json',
        'server_time' => date('Y-m-d H:i:s'),
        'timezone' => date_default_timezone_get()
    ];
    
    apiResponse(HTTP_OK, 'API服务正常运行', $apiInfo);
    
} elseif (isset($routes[$path])) {
    // 路由到对应的端点文件
    $endpoint_file = __DIR__ . '/' . $routes[$path];
    
    if (file_exists($endpoint_file)) {
        require_once $endpoint_file;
    } else {
        logMessage("端点文件不存在: {$endpoint_file}", 'ERROR');
        apiResponse(HTTP_INTERNAL_SERVER_ERROR, '服务器配置错误', null, false);
    }
    
} else {
    // 404 - 端点不存在
    logMessage("未找到端点: /{$path}", 'WARNING');
    
    $availableEndpoints = array_keys($routes);
    apiResponse(HTTP_NOT_FOUND, '端点不存在', [
        'requested_path' => "/{$path}",
        'available_endpoints' => $availableEndpoints
    ], false);
}
?>
