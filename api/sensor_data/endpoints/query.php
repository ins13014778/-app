<?php
/**
 * 查询传感器数据接口
 * GET /api/sensor_data/endpoints/query.php
 * 
 * 功能：查询传感器数据，支持多种过滤条件，按时间排序
 * 
 * 查询参数：
 * - device_topic: 设备主题（可选）
 * - start_time: 开始时间，格式：YYYY-MM-DD HH:MM:SS（可选）
 * - end_time: 结束时间，格式：YYYY-MM-DD HH:MM:SS（可选）
 * - limit: 返回记录数，默认100，最大1000（可选）
 * - offset: 偏移量，用于分页（可选）
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

// 构建过滤条件
$filters = [];

if ($user_id !== null) {
    $filters['user_id'] = $user_id;
}

if (isset($_GET['device_topic']) && !empty($_GET['device_topic'])) {
    $filters['device_topic'] = $_GET['device_topic'];
}

if (isset($_GET['start_time']) && !empty($_GET['start_time'])) {
    $filters['start_time'] = $_GET['start_time'];
}

if (isset($_GET['end_time']) && !empty($_GET['end_time'])) {
    $filters['end_time'] = $_GET['end_time'];
}

// 限制返回数量（默认100，最大1000）
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
if ($limit < 1) $limit = 100;
if ($limit > 1000) $limit = 1000;
$filters['limit'] = $limit;

// 偏移量（用于分页）
if (isset($_GET['offset']) && intval($_GET['offset']) > 0) {
    $filters['offset'] = intval($_GET['offset']);
}

// 查询数据
$sensorData = new SensorData($db);
$results = $sensorData->read($filters);

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => '查询成功',
    'data' => [
        'total' => count($results),
        'records' => $results,
        'filters' => [
            'device_topic' => $filters['device_topic'] ?? null,
            'start_time' => $filters['start_time'] ?? null,
            'end_time' => $filters['end_time'] ?? null,
            'limit' => $filters['limit'],
            'offset' => $filters['offset'] ?? 0
        ]
    ]
]);
?>

