<?php
class DeviceSensorData {
    private $conn;
    private $table_name = 'device_sensor_data';

    public $id;
    public $device_id;
    public $data_type; // raw | processed
    public $timestamp;
    public $camera_image_url;
    public $camera_image_base64;
    public $fire_value;
    public $fire_status;
    public $gas_value;
    public $gas_type;
    public $pm25_value;
    public $pm25_aqi_level;
    public $sensors_json;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createTable() {
        $sql = "CREATE TABLE IF NOT EXISTS `" . $this->table_name . "` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `device_id` VARCHAR(64) NOT NULL,
            `data_type` ENUM('raw','processed') NOT NULL,
            `timestamp` DATETIME NOT NULL,
            `camera_image_url` VARCHAR(255) NULL,
            `camera_image_base64` LONGTEXT NULL,
            `fire_value` DOUBLE NULL,
            `fire_status` VARCHAR(16) NULL,
            `gas_value` DOUBLE NULL,
            `gas_type` VARCHAR(16) NULL,
            `pm25_value` DOUBLE NULL,
            `pm25_aqi_level` VARCHAR(16) NULL,
            `sensors_json` LONGTEXT NULL,
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            INDEX `idx_device_time` (`device_id`, `timestamp`),
            INDEX `idx_type_time` (`data_type`, `timestamp`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        $this->conn->exec($sql);
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
            (device_id, data_type, timestamp, camera_image_url, camera_image_base64, fire_value, fire_status, gas_value, gas_type, pm25_value, pm25_aqi_level, sensors_json)
            VALUES (:device_id, :data_type, :timestamp, :camera_image_url, :camera_image_base64, :fire_value, :fire_status, :gas_value, :gas_type, :pm25_value, :pm25_aqi_level, :sensors_json)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':device_id', $this->device_id);
        $stmt->bindParam(':data_type', $this->data_type);
        $stmt->bindParam(':timestamp', $this->timestamp);
        $stmt->bindParam(':camera_image_url', $this->camera_image_url);
        $stmt->bindParam(':camera_image_base64', $this->camera_image_base64);
        $stmt->bindParam(':fire_value', $this->fire_value);
        $stmt->bindParam(':fire_status', $this->fire_status);
        $stmt->bindParam(':gas_value', $this->gas_value);
        $stmt->bindParam(':gas_type', $this->gas_type);
        $stmt->bindParam(':pm25_value', $this->pm25_value);
        $stmt->bindParam(':pm25_aqi_level', $this->pm25_aqi_level);
        $stmt->bindParam(':sensors_json', $this->sensors_json);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }
}
?>
