<?php
/**
 * 全局配置文件
 * 智慧农场监测应用API配置
 */

// 设置时区
date_default_timezone_set('Asia/Shanghai');

// 错误报告设置
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS设置 - 允许鸿蒙应用跨域访问
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// 处理预检请求
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// API版本
define('API_VERSION', 'v1');

// 响应状态码
define('HTTP_OK', 200);
define('HTTP_CREATED', 201);
define('HTTP_BAD_REQUEST', 400);
define('HTTP_UNAUTHORIZED', 401);
define('HTTP_FORBIDDEN', 403);
define('HTTP_NOT_FOUND', 404);
define('HTTP_CONFLICT', 409);
define('HTTP_INTERNAL_SERVER_ERROR', 500);

/**
 * 统一API响应格式
 * @param int $code HTTP状态码
 * @param string $message 响应消息
 * @param mixed $data 响应数据
 * @param bool $success 是否成功
 */
function apiResponse($code, $message, $data = null, $success = true) {
    http_response_code($code);
    
    $response = [
        'success' => $success,
        'code' => $code,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * 记录API日志
 * @param string $message 日志消息
 * @param string $level 日志级别
 */
function logMessage($message, $level = 'INFO') {
    $logFile = __DIR__ . '/../logs/api_' . date('Y-m-d') . '.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] [{$level}] {$message}" . PHP_EOL;
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}
?>