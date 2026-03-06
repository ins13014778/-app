<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With, Device-ID');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/DeviceSensorData.php';
require_once __DIR__ . '/../models/Device.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '仅支持POST请求']);
    exit();
}

$database = new Database();
$db = $database->getConnection();
if ($db === null) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '数据库连接失败']);
    exit();
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '请求体必须为JSON']);
    exit();
}

$deviceId = $payload['device_id'] ?? ($_SERVER['HTTP_DEVICE_ID'] ?? null);
$timestamp = $payload['timestamp'] ?? null;
$sensors = $payload['sensors'] ?? null;

if (empty($deviceId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '缺少必需字段：device_id']);
    exit();
}
if (empty($timestamp)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '缺少必需字段：timestamp']);
    exit();
}
if (!is_array($sensors) || count($sensors) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '缺少必需字段：sensors']);
    exit();
}

try {
    $dataModel = new DeviceSensorData($db);
    $dataModel->createTable();
    $deviceModel = new Device($db);
    $deviceModel->createTable();

    $dataModel->device_id = $deviceId;
    $dataModel->data_type = 'processed';
    $dataModel->timestamp = date('Y-m-d H:i:s', strtotime($timestamp));

    $camera = $sensors['camera'] ?? [];
    $fire = $sensors['fire_sensor'] ?? [];
    $gas = $sensors['gas_sensor'] ?? [];
    $pm25 = $sensors['pm25_sensor'] ?? [];

    $dataModel->camera_image_url = $camera['image_url'] ?? null;
    $dataModel->camera_image_base64 = $camera['image_base64'] ?? null;
    $dataModel->fire_value = isset($fire['value']) ? floatval($fire['value']) : null;
    $dataModel->fire_status = $fire['status'] ?? null;
    $dataModel->gas_value = isset($gas['value']) ? floatval($gas['value']) : null;
    $dataModel->gas_type = $gas['gas_type'] ?? null;
    $dataModel->pm25_value = isset($pm25['value']) ? floatval($pm25['value']) : null;
    $dataModel->pm25_aqi_level = $pm25['aqi_level'] ?? null;
    $dataModel->sensors_json = json_encode($sensors, JSON_UNESCAPED_UNICODE);

    if ($dataModel->create()) {
        $deviceModel->upsertStatus($deviceId, 'online', $dataModel->timestamp);
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => '处理数据上报成功',
            'data' => [
                'id' => $dataModel->id,
                'device_id' => $deviceId,
                'timestamp' => $dataModel->timestamp
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => '数据保存失败']);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '服务器错误', 'error' => $e->getMessage()]);
}
?>
