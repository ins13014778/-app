-- ================================================
-- 传感器数据表创建SQL
-- 用于存储鸿蒙应用上传的传感器数据
-- ================================================

-- 创建传感器数据表
CREATE TABLE IF NOT EXISTS `sensor_data` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` INT(11) UNSIGNED DEFAULT NULL COMMENT '用户ID（关联users表）',
    `device_topic` VARCHAR(100) NOT NULL COMMENT '设备主题名称',
    `temperature` DECIMAL(5,2) DEFAULT NULL COMMENT '温度（摄氏度）',
    `humidity` DECIMAL(5,2) DEFAULT NULL COMMENT '湿度（百分比）',
    `light_intensity` INT(11) DEFAULT NULL COMMENT '光照强度（Lux）',
    `water_depth` DECIMAL(5,2) DEFAULT NULL COMMENT '水深（厘米）',
    `soil_moisture` DECIMAL(5,2) DEFAULT NULL COMMENT '土壤湿度（百分比）',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据采集时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',
    PRIMARY KEY (`id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_device_topic` (`device_topic`),
    INDEX `idx_created_at` (`created_at` DESC),
    INDEX `idx_user_device_time` (`user_id`, `device_topic`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器数据表';

-- 创建传感器数据统计表（用于快速查询每日统计）
CREATE TABLE IF NOT EXISTS `sensor_data_daily_stats` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` INT(11) UNSIGNED DEFAULT NULL COMMENT '用户ID',
    `device_topic` VARCHAR(100) NOT NULL COMMENT '设备主题名称',
    `stat_date` DATE NOT NULL COMMENT '统计日期',
    `temp_max` DECIMAL(5,2) DEFAULT NULL COMMENT '最高温度',
    `temp_min` DECIMAL(5,2) DEFAULT NULL COMMENT '最低温度',
    `temp_avg` DECIMAL(5,2) DEFAULT NULL COMMENT '平均温度',
    `humidity_max` DECIMAL(5,2) DEFAULT NULL COMMENT '最高湿度',
    `humidity_min` DECIMAL(5,2) DEFAULT NULL COMMENT '最低湿度',
    `humidity_avg` DECIMAL(5,2) DEFAULT NULL COMMENT '平均湿度',
    `light_max` INT(11) DEFAULT NULL COMMENT '最大光照强度',
    `light_min` INT(11) DEFAULT NULL COMMENT '最小光照强度',
    `light_avg` DECIMAL(8,2) DEFAULT NULL COMMENT '平均光照强度',
    `data_count` INT(11) DEFAULT 0 COMMENT '数据记录数',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_user_device_date` (`user_id`, `device_topic`, `stat_date`),
    INDEX `idx_stat_date` (`stat_date` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器数据每日统计表';

-- 创建设备信息表（可选，用于记录设备基本信息）
CREATE TABLE IF NOT EXISTS `sensor_devices` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` INT(11) UNSIGNED NOT NULL COMMENT '用户ID',
    `device_topic` VARCHAR(100) NOT NULL COMMENT '设备主题名称',
    `device_name` VARCHAR(100) DEFAULT NULL COMMENT '设备昵称',
    `device_type` VARCHAR(50) DEFAULT 'sensor' COMMENT '设备类型',
    `location` VARCHAR(200) DEFAULT NULL COMMENT '设备位置',
    `description` TEXT DEFAULT NULL COMMENT '设备描述',
    `is_active` TINYINT(1) DEFAULT 1 COMMENT '是否激活（1=是，0=否）',
    `last_data_time` TIMESTAMP NULL DEFAULT NULL COMMENT '最后数据上传时间',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_user_device` (`user_id`, `device_topic`),
    INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器设备表';

