<?php
/**
 * 批量上传传感器数据接口
 * POST /api/sensor_data/endpoints/batch_upload.php
 * 
 * 功能：批量接收鸿蒙应用上传的传感器数据并存入数据库
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

// 验证数据格式
if (!isset($data['data']) || !is_array($data['data']) || empty($data['data'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '数据格式错误，需要提供data数组'
    ]);
    exit();
}

// 获取用户ID（可选，从请求数据中获取）
$user_id = isset($data['user_id']) ? intval($data['user_id']) : null;

// 为每条数据添加用户ID
$dataArray = [];
foreach ($data['data'] as $item) {
    if (empty($item['device_topic'])) {
        continue; // 跳过缺少device_topic的数据
    }
    
    $item['user_id'] = $user_id;
    $dataArray[] = $item;
}

if (empty($dataArray)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '没有有效的数据可以保存'
    ]);
    exit();
}

// 批量保存数据
$sensorData = new SensorData($db);
$result = $sensorData->batchCreate($dataArray);

http_response_code(201);
echo json_encode([
    'success' => true,
    'message' => '批量上传完成',
    'data' => [
        'total' => count($dataArray),
        'success' => $result['success'],
        'failed' => $result['failed']
    ]
]);
?>

