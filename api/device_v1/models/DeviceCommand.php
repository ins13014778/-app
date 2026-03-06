<?php
class DeviceCommand {
    private $conn;
    private $table_name = 'device_commands';

    public $id;
    public $device_id;
    public $command;
    public $params;
    public $status; // pending|sent|executed|failed

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createTable() {
        $sql = "CREATE TABLE IF NOT EXISTS `" . $this->table_name . "` (
            `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `device_id` VARCHAR(64) NOT NULL,
            `command` VARCHAR(64) NOT NULL,
            `params` LONGTEXT NULL,
            `status` ENUM('pending','sent','executed','failed') NOT NULL DEFAULT 'pending',
            `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            INDEX `idx_device_status` (`device_id`, `status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        $this->conn->exec($sql);
    }

    public function createCommand($device_id, $command, $params_json) {
        $query = "INSERT INTO " . $this->table_name . " (device_id, command, params, status) VALUES (:device_id, :command, :params, 'pending')";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':device_id', $device_id);
        $stmt->bindParam(':command', $command);
        $stmt->bindParam(':params', $params_json);
        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }
}
?>
