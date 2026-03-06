-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: hm_zybbq_xyz
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `device_sensor_data`
--

DROP TABLE IF EXISTS `device_sensor_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_sensor_data` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `device_id` varchar(64) NOT NULL,
  `data_type` enum('raw','processed') NOT NULL,
  `timestamp` datetime NOT NULL,
  `camera_image_url` varchar(255) DEFAULT NULL,
  `camera_image_base64` longtext,
  `fire_value` double DEFAULT NULL,
  `fire_status` varchar(16) DEFAULT NULL,
  `gas_value` double DEFAULT NULL,
  `gas_type` varchar(16) DEFAULT NULL,
  `pm25_value` double DEFAULT NULL,
  `pm25_aqi_level` varchar(16) DEFAULT NULL,
  `sensors_json` longtext,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_device_time` (`device_id`,`timestamp`),
  KEY `idx_type_time` (`data_type`,`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_sensor_data`
--

LOCK TABLES `device_sensor_data` WRITE;
/*!40000 ALTER TABLE `device_sensor_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `device_sensor_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `device_id` varchar(64) NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'online',
  `last_seen` datetime DEFAULT NULL,
  `metadata` longtext,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensor_data`
--

DROP TABLE IF EXISTS `sensor_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensor_data` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int DEFAULT NULL COMMENT '用户ID（可选，关联users表）',
  `device_topic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备主题/标识',
  `temperature` decimal(5,2) DEFAULT NULL COMMENT '温度（℃）',
  `humidity` decimal(5,2) DEFAULT NULL COMMENT '湿度（%）',
  `light_intensity` decimal(7,2) DEFAULT NULL COMMENT '光照强度（lux）',
  `water_depth` decimal(7,2) DEFAULT NULL COMMENT '水深（cm）',
  `soil_moisture` decimal(5,2) DEFAULT NULL COMMENT '土壤湿度（%）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_device_time` (`user_id`,`device_topic`,`created_at`),
  KEY `idx_device_time` (`device_topic`,`created_at`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器数据表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor_data`
--

LOCK TABLES `sensor_data` WRITE;
/*!40000 ALTER TABLE `sensor_data` DISABLE KEYS */;
INSERT INTO `sensor_data` VALUES (1,1,'farm001',25.50,68.00,850.00,15.20,45.00,'2025-10-25 06:12:53'),(2,1,'farm001',26.00,67.50,870.00,15.50,44.50,'2025-10-25 05:12:53'),(3,1,'farm001',25.80,68.50,860.00,15.30,45.20,'2025-10-25 04:12:53'),(4,1,'farm001',24.50,69.00,830.00,15.80,46.00,'2025-10-25 03:12:53'),(5,1,'farm001',25.20,68.20,845.00,15.40,45.50,'2025-10-25 02:12:53'),(6,1,'farm001',24.80,67.00,820.00,16.00,47.00,'2025-10-24 06:12:53'),(7,1,'farm001',25.00,66.50,815.00,16.20,47.50,'2025-10-24 06:12:53'),(8,1,'farm001',24.20,68.00,810.00,16.50,48.00,'2025-10-24 06:12:53'),(9,1,'farm002',23.50,70.00,780.00,14.50,50.00,'2025-10-25 06:12:53'),(10,1,'farm002',23.80,69.50,790.00,14.80,49.50,'2025-10-25 05:12:53'),(11,1,'farm001',23.00,71.00,800.00,17.00,49.00,'2025-10-23 06:12:53'),(12,1,'farm001',22.50,72.00,795.00,17.50,50.00,'2025-10-22 06:12:53'),(13,1,'farm001',24.00,70.50,805.00,16.80,48.50,'2025-10-21 06:12:53'),(14,1,'farm001',25.50,69.00,825.00,16.00,47.50,'2025-10-20 06:12:53'),(15,1,'farm001',26.50,68.00,850.00,15.50,46.00,'2025-10-19 06:12:53');
/*!40000 ALTER TABLE `sensor_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensor_data_daily_stats`
--

DROP TABLE IF EXISTS `sensor_data_daily_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensor_data_daily_stats` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int DEFAULT NULL COMMENT '用户ID',
  `device_topic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备主题',
  `date` date NOT NULL COMMENT '日期',
  `avg_temperature` decimal(5,2) DEFAULT NULL COMMENT '平均温度',
  `max_temperature` decimal(5,2) DEFAULT NULL COMMENT '最高温度',
  `min_temperature` decimal(5,2) DEFAULT NULL COMMENT '最低温度',
  `avg_humidity` decimal(5,2) DEFAULT NULL COMMENT '平均湿度',
  `max_humidity` decimal(5,2) DEFAULT NULL COMMENT '最高湿度',
  `min_humidity` decimal(5,2) DEFAULT NULL COMMENT '最低湿度',
  `avg_light_intensity` decimal(7,2) DEFAULT NULL COMMENT '平均光照',
  `max_light_intensity` decimal(7,2) DEFAULT NULL COMMENT '最高光照',
  `min_light_intensity` decimal(7,2) DEFAULT NULL COMMENT '最低光照',
  `record_count` int DEFAULT '0' COMMENT '记录数',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_device_date` (`user_id`,`device_topic`,`date`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器数据每日统计表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor_data_daily_stats`
--

LOCK TABLES `sensor_data_daily_stats` WRITE;
/*!40000 ALTER TABLE `sensor_data_daily_stats` DISABLE KEYS */;
INSERT INTO `sensor_data_daily_stats` VALUES (1,1,'farm001','2025-10-25',25.40,26.00,24.50,68.24,69.00,67.50,851.00,870.00,830.00,5,'2025-10-25 06:20:54','2025-10-25 06:20:54'),(2,1,'farm001','2025-10-24',24.67,25.00,24.20,67.17,68.00,66.50,815.00,820.00,810.00,3,'2025-10-25 06:20:54','2025-10-25 06:20:54'),(3,1,'farm002','2025-10-25',23.65,23.80,23.50,69.75,70.00,69.50,785.00,790.00,780.00,2,'2025-10-25 06:20:54','2025-10-25 06:20:54');
/*!40000 ALTER TABLE `sensor_data_daily_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensor_devices`
--

DROP TABLE IF EXISTS `sensor_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensor_devices` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int DEFAULT NULL COMMENT '所属用户ID',
  `device_topic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备主题（唯一标识）',
  `device_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '设备名称',
  `device_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '设备类型',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '设备位置',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '设备描述',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '是否激活',
  `last_data_time` timestamp NULL DEFAULT NULL COMMENT '最后数据时间',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_device_topic` (`device_topic`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='传感器设备信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor_devices`
--

LOCK TABLES `sensor_devices` WRITE;
/*!40000 ALTER TABLE `sensor_devices` DISABLE KEYS */;
INSERT INTO `sensor_devices` VALUES (1,1,'farm001','1号温室传感器','sensor','北区温室A栋','主要监测温室环境参数，包括温度、湿度、光照强度等',1,'2025-10-25 06:17:04','2025-10-25 06:17:04','2025-10-25 06:17:04'),(2,1,'farm002','2号大棚传感器','sensor','南区大棚B区','用于监测大棚内的环境数据，配备土壤湿度和水深传感器',1,'2025-10-25 06:17:04','2025-10-25 06:17:04','2025-10-25 06:17:04'),(3,1,'farm003','3号露天传感器','sensor','东区露天种植区','露天农田环境监测设备，防水防尘等级IP67',1,NULL,'2025-10-25 06:17:04','2025-10-25 06:17:04');
/*!40000 ALTER TABLE `sensor_devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮箱地址',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '加密密码',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '?' COMMENT '用户头像',
  `bio` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '智慧农业用户' COMMENT '个人简介',
  `user_mode` enum('not_logged_in','guest','logged_in') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'not_logged_in' COMMENT '用户模式',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '账号是否激活',
  `is_admin` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否为管理员',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login` timestamp NULL DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_is_admin` (`is_admin`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','test@example.com','13800138000','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','👨‍🌾','智慧农场测试用户','not_logged_in',1,0,'2025-10-15 07:16:13','2025-10-15 07:51:01',NULL),(2,'123456','478201690@qq.com','13037687602','$2y$12$IBU7DI7cbaQ1wa6nk56dw.6gv36ICkeXAFzAbw03GBLus15zTc3sK','👨‍🌾','智慧农业用户7777','logged_in',1,0,'2025-10-15 07:57:20','2025-11-14 11:44:33','2025-11-14 11:44:33'),(3,'admin','1741065057@qq.com','admin','$2y$12$qsE3EWoHODWTvg39QkqI0.jGmtYGKv6PDLhk7oyFGuB.89tCDcfDe','👤','幼安厨卫管理员账号111','logged_in',1,1,'2025-10-15 08:29:46','2025-12-26 09:13:01','2025-12-26 09:13:01'),(4,'l567xv','cm20050427@qq.com','18567780725','$2y$12$LVoh20t8Vk5lO5o23P6NDuL17ecYQcTCS0PzvWl5dVU1re0srV0R.','👤','智慧农业用户','logged_in',1,0,'2025-10-17 11:01:23','2025-10-17 11:07:00','2025-10-17 11:07:00'),(5,'110824962','1741065051@qq.com','13037687602','$2y$12$5ZLqkbi9rolEppTQe2dDLeuQS/HBbRwVChy1wIInMlm.E4Ytv7gzK','👤','智慧农业用户','not_logged_in',1,0,'2025-10-17 11:26:27','2025-10-17 11:26:27',NULL),(6,'czp','478201691@qq.com','13779081088','$2y$12$97UIDR3ISzguYGNHiaJM8OkUlJjjI5fEEPXSbJh65qcRu4u3y8umq','👤','智慧农业用户','not_logged_in',1,0,'2025-10-18 05:22:45','2025-10-18 05:22:45',NULL),(9,'xcc','11@qq.com','13037687609','$2y$12$FSd/4rN67870QetgiDtIwuKqzIdgNGj7zC5xxhsUlRAOwFWCCmtRG','👤','智慧农业用户','logged_in',1,0,'2025-10-26 11:38:57','2025-10-26 11:39:31','2025-10-26 11:39:31'),(10,'cmm','1212121212@qq.com','16612121212','$2y$12$O3gFcUUUHTFjhEuNLFoZceIATe/ATTCF6xcO9xctZVNUbzC4mT4Ga','👤','智慧农业用户','logged_in',1,0,'2025-11-05 12:01:46','2025-11-05 12:02:03','2025-11-05 12:02:03'),(11,'12345','1212123@qq.com','12345678999','$2y$12$7XXTOxGChVjTkZ1QktKNQu3qEVA0rhFu6jSUcup5TlBdNrjlKb2Ae','👤','智慧农业用户','logged_in',1,0,'2025-11-11 12:57:38','2025-11-15 02:43:02','2025-11-15 02:43:02'),(12,'789654','123@qq.com','55555','$2y$12$eIwb5K0n8htBlVoVnqOiVegv6klelI1B.Enmu/GlOWrE.tz3Us1vq','👤','幼安厨卫用户','logged_in',1,0,'2025-12-02 06:17:42','2025-12-03 09:20:30','2025-12-03 09:20:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'hm_zybbq_xyz'
--

--
-- Dumping routines for database 'hm_zybbq_xyz'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-06  1:30:02
