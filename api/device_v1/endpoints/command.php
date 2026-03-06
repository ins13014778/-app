<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With');

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/DeviceCommand.php';
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

$deviceId = $payload['device_id'] ?? null;
$command = $payload['command'] ?? null;
$params = $payload['params'] ?? [];

if (empty($deviceId) || empty($command)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '缺少必需字段：device_id 或 command']);
    exit();
}

try {
    $deviceModel = new Device($db);
    $deviceModel->createTable();
    $deviceModel->upsertStatus($deviceId, 'online', date('Y-m-d H:i:s'));

    $cmdModel = new DeviceCommand($db);
    $cmdModel->createTable();
    $paramsJson = json_encode($params, JSON_UNESCAPED_UNICODE);

    if ($cmdModel->createCommand($deviceId, $command, $paramsJson)) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => '设备指令创建成功',
            'data' => [
                'command_id' => $cmdModel->id,
                'device_id' => $deviceId,
                'command' => $command,
                'status' => 'pending'
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => '指令创建失败']);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '服务器错误', 'error' => $e->getMessage()]);
}
?>
