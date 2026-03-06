<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/Device.php';
require_once __DIR__ . '/../models/DeviceSensorData.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '仅支持GET请求']);
    exit();
}

$deviceId = $_GET['device_id'] ?? null;
if (empty($deviceId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '缺少必需参数：device_id']);
    exit();
}

$database = new Database();
$db = $database->getConnection();
if ($db === null) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '数据库连接失败']);
    exit();
}

try {
    $deviceModel = new Device($db);
    $deviceModel->createTable();
    $status = $deviceModel->getStatus($deviceId);

    $dataModel = new DeviceSensorData($db);
    $dataModel->createTable();
    $stmt = $db->prepare("SELECT data_type, timestamp FROM device_sensor_data WHERE device_id = :device_id ORDER BY timestamp DESC LIMIT 1");
    $stmt->bindParam(':device_id', $deviceId);
    $stmt->execute();
    $latest = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$status) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => '设备不存在或无状态']);
        exit();
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => '设备状态查询成功',
        'data' => [
            'device' => $status,
            'latest_data' => $latest
        ]
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '服务器错误', 'error' => $e->getMessage()]);
}
?>
