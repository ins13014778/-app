<?php
/**
 * 传感器数据模型类
 * 处理传感器数据的数据库操作
 */

class SensorData {
    private $conn;
    private $table_name = 'sensor_data';
    
    // 数据属性
    public $id;
    public $user_id;
    public $device_topic;
    public $temperature;
    public $humidity;
    public $light_intensity;
    public $water_depth;
    public $soil_moisture;
    public $created_at;
    
    /**
     * 构造函数
     * @param PDO $db 数据库连接
     */
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * 创建传感器数据记录
     * @return bool
     */
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                 SET user_id = :user_id,
                     device_topic = :device_topic,
                     temperature = :temperature,
                     humidity = :humidity,
                     light_intensity = :light_intensity,
                     water_depth = :water_depth,
                     soil_moisture = :soil_moisture";
        
        $stmt = $this->conn->prepare($query);
        
        // 清理数据
        $this->user_id = $this->user_id ?? null;
        $this->device_topic = htmlspecialchars(strip_tags($this->device_topic));
        $this->temperature = isset($this->temperature) ? floatval($this->temperature) : null;
        $this->humidity = isset($this->humidity) ? floatval($this->humidity) : null;
        $this->light_intensity = isset($this->light_intensity) ? intval($this->light_intensity) : null;
        $this->water_depth = isset($this->water_depth) ? floatval($this->water_depth) : null;
        $this->soil_moisture = isset($this->soil_moisture) ? floatval($this->soil_moisture) : null;
        
        // 绑定参数
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':device_topic', $this->device_topic);
        $stmt->bindParam(':temperature', $this->temperature);
        $stmt->bindParam(':humidity', $this->humidity);
        $stmt->bindParam(':light_intensity', $this->light_intensity);
        $stmt->bindParam(':water_depth', $this->water_depth);
        $stmt->bindParam(':soil_moisture', $this->soil_moisture);
        
        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        
        return false;
    }
    
    /**
     * 批量创建传感器数据记录
     * @param array $dataArray 数据数组
     * @return array 成功和失败的记录数
     */
    public function batchCreate($dataArray) {
        $success = 0;
        $failed = 0;
        
        foreach ($dataArray as $data) {
            $this->user_id = $data['user_id'] ?? null;
            $this->device_topic = $data['device_topic'] ?? '';
            $this->temperature = $data['temperature'] ?? null;
            $this->humidity = $data['humidity'] ?? null;
            $this->light_intensity = $data['light_intensity'] ?? null;
            $this->water_depth = $data['water_depth'] ?? null;
            $this->soil_moisture = $data['soil_moisture'] ?? null;
            
            if ($this->create()) {
                $success++;
            } else {
                $failed++;
            }
        }
        
        return ['success' => $success, 'failed' => $failed];
    }
    
    /**
     * 获取传感器数据列表（按时间排序）
     * @param array $filters 过滤条件
     * @return array
     */
    public function read($filters = []) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE 1=1";
        
        // 添加过滤条件
        if (isset($filters['user_id'])) {
            $query .= " AND user_id = :user_id";
        }
        if (isset($filters['device_topic'])) {
            $query .= " AND device_topic = :device_topic";
        }
        if (isset($filters['start_time'])) {
            $query .= " AND created_at >= :start_time";
        }
        if (isset($filters['end_time'])) {
            $query .= " AND created_at <= :end_time";
        }
        
        // 按时间降序排序
        $query .= " ORDER BY created_at DESC";
        
        // 限制返回数量
        if (isset($filters['limit'])) {
            $query .= " LIMIT :limit";
        }
        if (isset($filters['offset'])) {
            $query .= " OFFSET :offset";
        }
        
        $stmt = $this->conn->prepare($query);
        
        // 绑定参数
        if (isset($filters['user_id'])) {
            $stmt->bindParam(':user_id', $filters['user_id'], PDO::PARAM_INT);
        }
        if (isset($filters['device_topic'])) {
            $stmt->bindParam(':device_topic', $filters['device_topic']);
        }
        if (isset($filters['start_time'])) {
            $stmt->bindParam(':start_time', $filters['start_time']);
        }
        if (isset($filters['end_time'])) {
            $stmt->bindParam(':end_time', $filters['end_time']);
        }
        if (isset($filters['limit'])) {
            $stmt->bindParam(':limit', $filters['limit'], PDO::PARAM_INT);
        }
        if (isset($filters['offset'])) {
            $stmt->bindParam(':offset', $filters['offset'], PDO::PARAM_INT);
        }
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * 获取最新的传感器数据
     * @param int $user_id 用户ID
     * @param string $device_topic 设备主题
     * @return array|null
     */
    public function getLatest($user_id = null, $device_topic = null) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE 1=1";
        
        if ($user_id !== null) {
            $query .= " AND user_id = :user_id";
        }
        if ($device_topic !== null) {
            $query .= " AND device_topic = :device_topic";
        }
        
        $query .= " ORDER BY created_at DESC LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        
        if ($user_id !== null) {
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        }
        if ($device_topic !== null) {
            $stmt->bindParam(':device_topic', $device_topic);
        }
        
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * 获取今日统计数据
     * @param int $user_id 用户ID
     * @param string $device_topic 设备主题
     * @return array|null
     */
    public function getTodayStats($user_id = null, $device_topic = null) {
        $query = "SELECT 
                    COUNT(*) as total_count,
                    MAX(temperature) as temp_max,
                    MIN(temperature) as temp_min,
                    AVG(temperature) as temp_avg,
                    MAX(humidity) as humidity_max,
                    MIN(humidity) as humidity_min,
                    AVG(humidity) as humidity_avg,
                    MAX(light_intensity) as light_max,
                    MIN(light_intensity) as light_min,
                    AVG(light_intensity) as light_avg
                  FROM " . $this->table_name . "
                  WHERE DATE(created_at) = CURDATE()";
        
        if ($user_id !== null) {
            $query .= " AND user_id = :user_id";
        }
        if ($device_topic !== null) {
            $query .= " AND device_topic = :device_topic";
        }
        
        $stmt = $this->conn->prepare($query);
        
        if ($user_id !== null) {
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        }
        if ($device_topic !== null) {
            $stmt->bindParam(':device_topic', $device_topic);
        }
        
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    /**
     * 获取指定时间范围的统计数据
     * @param array $filters 过滤条件
     * @return array
     */
    public function getStats($filters = []) {
        $query = "SELECT 
                    DATE(created_at) as stat_date,
                    COUNT(*) as total_count,
                    MAX(temperature) as temp_max,
                    MIN(temperature) as temp_min,
                    AVG(temperature) as temp_avg,
                    MAX(humidity) as humidity_max,
                    MIN(humidity) as humidity_min,
                    AVG(humidity) as humidity_avg,
                    MAX(light_intensity) as light_max,
                    MIN(light_intensity) as light_min,
                    AVG(light_intensity) as light_avg
                  FROM " . $this->table_name . "
                  WHERE 1=1";
        
        if (isset($filters['user_id'])) {
            $query .= " AND user_id = :user_id";
        }
        if (isset($filters['device_topic'])) {
            $query .= " AND device_topic = :device_topic";
        }
        if (isset($filters['start_date'])) {
            $query .= " AND DATE(created_at) >= :start_date";
        }
        if (isset($filters['end_date'])) {
            $query .= " AND DATE(created_at) <= :end_date";
        }
        
        $query .= " GROUP BY DATE(created_at) ORDER BY stat_date DESC";
        
        if (isset($filters['limit'])) {
            $query .= " LIMIT :limit";
        }
        
        $stmt = $this->conn->prepare($query);
        
        if (isset($filters['user_id'])) {
            $stmt->bindParam(':user_id', $filters['user_id'], PDO::PARAM_INT);
        }
        if (isset($filters['device_topic'])) {
            $stmt->bindParam(':device_topic', $filters['device_topic']);
        }
        if (isset($filters['start_date'])) {
            $stmt->bindParam(':start_date', $filters['start_date']);
        }
        if (isset($filters['end_date'])) {
            $stmt->bindParam(':end_date', $filters['end_date']);
        }
        if (isset($filters['limit'])) {
            $stmt->bindParam(':limit', $filters['limit'], PDO::PARAM_INT);
        }
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * 删除指定时间之前的数据
     * @param string $before_date 日期（YYYY-MM-DD格式）
     * @return bool
     */
    public function deleteOldData($before_date) {
        $query = "DELETE FROM " . $this->table_name . " WHERE DATE(created_at) < :before_date";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':before_date', $before_date);
        
        return $stmt->execute();
    }
}
?>

