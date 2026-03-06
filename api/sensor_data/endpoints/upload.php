<?php
/**
 * 传感器数据上传接口
 * POST /api/sensor_data/endpoints/upload.php
 * 
 * 功能：接收鸿蒙应用上传的传感器数据并存入数据库
 */

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
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

// 仅允许POST请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => '仅支持POST请求'
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

// 获取POST数据
$data = json_decode(file_get_contents("php://input"), true);

// 验证必需字段
if (empty($data['device_topic'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '缺少必需字段：device_topic'
    ]);
    exit();
}

// 检查是否至少有一个传感器数据字段
$hasData = false;
$sensorFields = ['temperature', 'humidity', 'light_intensity', 'water_depth', 'soil_moisture'];
foreach ($sensorFields as $field) {
    if (isset($data[$field]) && $data[$field] !== null && $data[$field] !== '') {
        $hasData = true;
        break;
    }
}

if (!$hasData) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '至少需要提供一个传感器数据字段（temperature, humidity, light_intensity, water_depth, soil_moisture）'
    ]);
    exit();
}

// 获取用户ID（可选，从请求数据中获取）
$user_id = isset($data['user_id']) ? intval($data['user_id']) : null;

// 创建传感器数据对象
$sensorData = new SensorData($db);
$sensorData->user_id = $user_id;
$sensorData->device_topic = $data['device_topic'];
$sensorData->temperature = $data['temperature'] ?? null;
$sensorData->humidity = $data['humidity'] ?? null;
$sensorData->light_intensity = $data['light_intensity'] ?? null;
$sensorData->water_depth = $data['water_depth'] ?? null;
$sensorData->soil_moisture = $data['soil_moisture'] ?? null;

// 保存数据
if ($sensorData->create()) {
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => '传感器数据上传成功',
        'data' => [
            'id' => $sensorData->id,
            'device_topic' => $sensorData->device_topic,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '传感器数据保存失败'
    ]);
}
?>

