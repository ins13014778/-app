<?php
class Device {
    private $conn;
    private $table_name = 'devices';

    public $device_id;
    public $status; // online | offline | warning | danger
    public $last_seen;
    public $metadata;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createTable() {
        $sql = "CREATE TABLE IF NOT EXISTS `" . $this->table_name . "` (
            `device_id` VARCHAR(64) NOT NULL,
            `status` VARCHAR(32) NOT NULL DEFAULT 'online',
            `last_seen` DATETIME NULL,
            `metadata` LONGTEXT NULL,
            `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`device_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

        $this->conn->exec($sql);
    }

    public function upsertStatus($device_id, $status, $last_seen) {
        $query = "INSERT INTO " . $this->table_name . " (device_id, status, last_seen)
                  VALUES (:device_id, :status, :last_seen)
                  ON DUPLICATE KEY UPDATE status = VALUES(status), last_seen = VALUES(last_seen)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':device_id', $device_id);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':last_seen', $last_seen);
        return $stmt->execute();
    }

    public function getStatus($device_id) {
        $query = "SELECT device_id, status, last_seen, metadata, updated_at FROM " . $this->table_name . " WHERE device_id = :device_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':device_id', $device_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
