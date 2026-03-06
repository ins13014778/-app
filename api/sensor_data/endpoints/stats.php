<?php
/**
 * 传感器数据统计接口
 * GET /api/sensor_data/endpoints/stats.php
 * 
 * 功能：获取传感器数据的统计信息（最大值、最小值、平均值等）
 * 
 * 查询参数：
 * - device_topic: 设备主题（可选）
 * - start_date: 开始日期，格式：YYYY-MM-DD（可选）
 * - end_date: 结束日期，格式：YYYY-MM-DD（可选）
 * - type: 统计类型，today=今日统计，range=时间范围统计（默认：today）
 * - limit: 返回记录数，仅用于range类型，默认30天（可选）
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

// 获取统计类型
$type = isset($_GET['type']) ? $_GET['type'] : 'today';

// 获取设备主题
$device_topic = isset($_GET['device_topic']) ? $_GET['device_topic'] : null;

$sensorData = new SensorData($db);

if ($type === 'today') {
    // 今日统计
    $result = $sensorData->getTodayStats($user_id, $device_topic);
    
    if ($result) {
        // 格式化数据
        $formattedResult = [
            'date' => date('Y-m-d'),
            'total_count' => intval($result['total_count']),
            'temperature' => [
                'max' => $result['temp_max'] !== null ? floatval($result['temp_max']) : null,
                'min' => $result['temp_min'] !== null ? floatval($result['temp_min']) : null,
                'avg' => $result['temp_avg'] !== null ? round(floatval($result['temp_avg']), 2) : null
            ],
            'humidity' => [
                'max' => $result['humidity_max'] !== null ? floatval($result['humidity_max']) : null,
                'min' => $result['humidity_min'] !== null ? floatval($result['humidity_min']) : null,
                'avg' => $result['humidity_avg'] !== null ? round(floatval($result['humidity_avg']), 2) : null
            ],
            'light_intensity' => [
                'max' => $result['light_max'] !== null ? intval($result['light_max']) : null,
                'min' => $result['light_min'] !== null ? intval($result['light_min']) : null,
                'avg' => $result['light_avg'] !== null ? round(floatval($result['light_avg']), 2) : null
            ]
        ];
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => '查询成功',
            'data' => $formattedResult
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => '今日暂无数据'
        ]);
    }
    
} else if ($type === 'range') {
    // 时间范围统计
    $filters = [];
    
    if ($user_id !== null) {
        $filters['user_id'] = $user_id;
    }
    
    if ($device_topic !== null) {
        $filters['device_topic'] = $device_topic;
    }
    
    if (isset($_GET['start_date']) && !empty($_GET['start_date'])) {
        $filters['start_date'] = $_GET['start_date'];
    }
    
    if (isset($_GET['end_date']) && !empty($_GET['end_date'])) {
        $filters['end_date'] = $_GET['end_date'];
    }
    
    // 限制返回天数（默认30天）
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 30;
    if ($limit < 1) $limit = 30;
    if ($limit > 365) $limit = 365;
    $filters['limit'] = $limit;
    
    $results = $sensorData->getStats($filters);
    
    // 格式化数据
    $formattedResults = [];
    foreach ($results as $row) {
        $formattedResults[] = [
            'date' => $row['stat_date'],
            'total_count' => intval($row['total_count']),
            'temperature' => [
                'max' => $row['temp_max'] !== null ? floatval($row['temp_max']) : null,
                'min' => $row['temp_min'] !== null ? floatval($row['temp_min']) : null,
                'avg' => $row['temp_avg'] !== null ? round(floatval($row['temp_avg']), 2) : null
            ],
            'humidity' => [
                'max' => $row['humidity_max'] !== null ? floatval($row['humidity_max']) : null,
                'min' => $row['humidity_min'] !== null ? floatval($row['humidity_min']) : null,
                'avg' => $row['humidity_avg'] !== null ? round(floatval($row['humidity_avg']), 2) : null
            ],
            'light_intensity' => [
                'max' => $row['light_max'] !== null ? intval($row['light_max']) : null,
                'min' => $row['light_min'] !== null ? intval($row['light_min']) : null,
                'avg' => $row['light_avg'] !== null ? round(floatval($row['light_avg']), 2) : null
            ]
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => '查询成功',
        'data' => [
            'total' => count($formattedResults),
            'stats' => $formattedResults
        ]
    ]);
    
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => '无效的统计类型，支持：today, range'
    ]);
}
?>

