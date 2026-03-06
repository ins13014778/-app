<?php
/**
 * 获取最新传感器数据接口
 * GET /api/sensor_data/endpoints/latest.php
 * 
 * 功能：获取最新的传感器数据
 * 
 * 查询参数：
 * - device_topic: 设备主题（可选）
 */

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With');

// 引入必要的文件
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/SensorData.php';

// 处理OPTIONS预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 仅允许GET请求
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '仅支持GET请求'
    ]);
    exit();
}

// 获取数据库连接
$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '数据库连接失败'
    ]);
    exit();
}

// 获取用户ID（可选，从URL参数获取）
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

// 获取设备主题
$device_topic = isset($_GET['device_topic']) ? $_GET['device_topic'] : null;

// 查询最新数据
$sensorData = new SensorData($db);
$result = $sensorData->getLatest($user_id, $device_topic);

if ($result) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => '查询成功',
        'data' => $result
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => '未找到数据'
    ]);
}
?>

