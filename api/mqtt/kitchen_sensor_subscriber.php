<?php
// 订阅 MQTT 主题 kitchen/sensor/data 并入库到 device_sensor_data（data_type=raw）
// 依赖：建议使用 composer 安装 php-mqtt/client
// composer require php-mqtt/client

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../device_v1/models/DeviceSensorData.php';
require_once __DIR__ . '/../device_v1/models/Device.php';

$brokerHost = getenv('MQTT_HOST') ?: '127.0.0.1';
$brokerPort = intval(getenv('MQTT_PORT') ?: '1883');
$brokerUser = getenv('MQTT_USER') ?: null;
$brokerPass = getenv('MQTT_PASS') ?: null;
$clientId = 'api_kitchen_sensor_' . getmypid();
$topic = 'kitchen/sensor/data';

if (!class_exists('PhpMqtt\\Client\\MqttClient')) {
    fwrite(STDERR, "未检测到 PhpMqtt\\Client 库。请先运行: composer require php-mqtt/client\n");
    exit(2);
}

use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\Exceptions\MqttClientException;

try {
    $client = new MqttClient($brokerHost, $brokerPort, $clientId);
    $client->connect($brokerUser, $brokerPass);

    $client->subscribe($topic, function (string $topic, string $message) {
        $database = new Database();
        $db = $database->getConnection();
        if ($db === null) {
            error_log('MQTT消息处理：数据库连接失败');
            return;
        }

        $dataModel = new DeviceSensorData($db);
        $dataModel->createTable();
        $deviceModel = new Device($db);
        $deviceModel->createTable();

        $payload = json_decode($message, true);
        if (!is_array($payload)) {
            error_log('MQTT消息处理：payload 非JSON');
            return;
        }

        $deviceId = $payload['device_id'] ?? null;
        $timestamp = $payload['timestamp'] ?? null;
        $sensors = $payload['sensors'] ?? [];
        if (!$deviceId || !$timestamp) {
            error_log('MQTT消息处理：缺少 device_id 或 timestamp');
            return;
        }

        $dataModel->device_id = $deviceId;
        $dataModel->data_type = 'raw';
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
        } else {
            error_log('MQTT消息处理：入库失败');
        }
    }, 0);

    $client->loop(true);
    $client->disconnect();
} catch (MqttClientException $e) {
    fwrite(STDERR, 'MQTT连接错误: ' . $e->getMessage() . "\n");
    exit(1);
}
?>
