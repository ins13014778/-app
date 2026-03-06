# 智慧农场监测应用 API 文档

## 概述

这是一个基于 PHP 和 MySQL 的 RESTful API，专为鸿蒙应用的智慧农场监测系统设计。API 提供完整的用户认证和传感器数据管理功能。



## 宝塔伪静态配置
location /api {
    # 如果不是真实的 PHP 文件，直接转发到 index.php 处理
    try_files $uri /api/index.php?$query_string;
}

location ~ /api/.*\.php$ {
    include fastcgi_params;
    fastcgi_pass unix:/tmp/php-cgi-84.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}

## 技术栈

- **PHP**: 7.4+
- **数据库**: MySQL 5.7+
- **认证**: 简化认证（无JWT）
- **加密**: PHP password_hash/password_verify
- **架构**: RESTful API

## 项目结构

```
api58/
├── config/
│   ├── config.php          # 全局配置文件
│   └── database.php        # 数据库连接类
├── models/
│   └── User.php           # 用户模型
├── endpoints/
│   ├── register.php       # 用户注册
│   ├── login.php          # 用户登录
│   └── profile.php        # 用户信息管理
├── profile/
│   └── change-password.php # 修改密码
├── sensor_data/
│   ├── models/
│   │   └── SensorData.php  # 传感器数据模型
│   ├── endpoints/
│   │   ├── upload.php      # 上传传感器数据
│   │   ├── batch_upload.php # 批量上传
│   │   ├── query.php       # 查询数据
│   │   ├── latest.php      # 获取最新数据
│   │   └── stats.php       # 数据统计
│   └── database/
│       └── create_sensor_tables.sql # 传感器数据表SQL
├── database/
│   ├── create_tables.sql   # 用户表SQL
│   └── init_database.php   # 数据库初始化脚本
├── logs/                  # 日志目录（自动创建）
├── index.php              # API主入口
└── README.md              # 本文档
```

## 数据库配置

### 1. 配置数据库连接

编辑 `config/database.php` 文件中的数据库连接参数：

```php
private $host = "localhost";
private $db_name = "hm_zybbq_xyz";  // 您的数据库名
private $username = "hm_zybbq_xyz";  // 您的数据库用户名
private $password = "your_password"; // 您的数据库密码
```

### 2. 创建数据库表

**方法1：使用SQL文件**
```sql
-- 导入用户表
source database/create_tables.sql;

-- 导入传感器数据表
source sensor_data/database/create_sensor_tables.sql;
```

**方法2：使用PHP初始化脚本**
```bash
php database/init_database.php
```

## API 端点

### 基础信息

- **Base URL**: `http://your-domain/api/`
- **Content-Type**: `application/json`
- **认证方式**: 无JWT认证，使用user_id参数

---

### 用户相关接口

#### 1. 用户注册
**端点**: `POST /api/register`

**请求体**:
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "phone": "13800138000",
    "avatar": "👤",
    "bio": "智慧农业用户"
}
```

**响应**:
```json
{
    "success": true,
    "code": 201,
    "message": "注册成功",
    "data": {
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "phone": "13800138000",
            "avatar": "👤",
            "bio": "智慧农业用户",
            "user_mode": "logged_in"
        }
    },
    "timestamp": "2024-01-15 10:30:00"
}
```

#### 2. 用户登录
**端点**: `POST /api/login`

**请求体**:
```json
{
    "login": "testuser",
    "password": "password123"
}
```

**响应**:
```json
{
    "success": true,
    "code": 200,
    "message": "登录成功",
    "data": {
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "phone": "13800138000",
            "avatar": "👤",
            "bio": "智慧农业用户",
            "user_mode": "logged_in",
            "last_login": "2024-01-15 10:30:00"
        }
    },
    "timestamp": "2024-01-15 10:30:00"
}
```

#### 3. 获取用户信息
**端点**: `GET /api/profile?user_id={id}`

**响应**:
```json
{
    "success": true,
    "code": 200,
    "message": "获取用户信息成功",
    "data": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "phone": "13800138000",
        "avatar": "👤",
        "bio": "智慧农业用户",
        "user_mode": "logged_in",
        "created_at": "2024-01-15 10:00:00",
        "last_login": "2024-01-15 10:30:00"
    },
    "timestamp": "2024-01-15 10:35:00"
}
```

#### 4. 更新用户信息
**端点**: `PUT /api/profile`

**请求体**:
```json
{
    "user_id": 1,
    "phone": "13900139000",
    "avatar": "🧑‍🌾",
    "bio": "智慧农业专家",
    "user_mode": "logged_in"
}
```

#### 5. 修改密码
**端点**: `POST /api/profile/change-password`

**请求体**:
```json
{
    "user_id": 1,
    "old_password": "oldpass123",
    "new_password": "newpass123"
}
```

---

### 传感器数据接口

#### 1. 上传传感器数据
**端点**: `POST /api/sensor_data/endpoints/upload`

**请求体**:
```json
{
    "user_id": 1,
    "device_topic": "farm001",
    "temperature": 25.5,
    "humidity": 68.0,
    "light_intensity": 850,
    "water_depth": 15.2,
    "soil_moisture": 45.0
}
```

**响应**:
```json
{
    "success": true,
    "message": "传感器数据上传成功",
    "data": {
        "id": 123,
        "device_topic": "farm001",
        "created_at": "2024-01-15 10:30:00"
    }
}
```

#### 2. 批量上传传感器数据
**端点**: `POST /api/sensor_data/endpoints/batch_upload`

**请求体**:
```json
{
    "user_id": 1,
    "data": [
        {
            "device_topic": "farm001",
            "temperature": 25.5,
            "humidity": 68.0,
            "light_intensity": 850
        },
        {
            "device_topic": "farm001",
            "temperature": 26.0,
            "humidity": 67.5,
            "light_intensity": 870
        }
    ]
}
```

#### 3. 查询传感器数据
**端点**: `GET /api/sensor_data/endpoints/query`

**查询参数**:
- `user_id` - 用户ID（可选）
- `device_topic` - 设备主题（可选）
- `start_time` - 开始时间，格式：YYYY-MM-DD HH:MM:SS（可选）
- `end_time` - 结束时间（可选）
- `limit` - 返回记录数，默认100，最大1000（可选）
- `offset` - 偏移量，用于分页（可选）

**示例**: `/api/sensor_data/endpoints/query?user_id=1&device_topic=farm001&limit=50`

#### 4. 获取最新数据
**端点**: `GET /api/sensor_data/endpoints/latest`

**查询参数**:
- `user_id` - 用户ID（可选）
- `device_topic` - 设备主题（可选）

**示例**: `/api/sensor_data/endpoints/latest?user_id=1&device_topic=farm001`

#### 5. 数据统计
**端点**: `GET /api/sensor_data/endpoints/stats`

**查询参数**:
- `user_id` - 用户ID（可选）
- `device_topic` - 设备主题（可选）
- `type` - 统计类型：`today`（今日统计）或 `range`（时间范围统计），默认：today
- `start_date` - 开始日期，格式：YYYY-MM-DD（仅用于range类型）
- `end_date` - 结束日期（仅用于range类型）
- `limit` - 返回记录数（仅用于range类型），默认30天

**示例**: `/api/sensor_data/endpoints/stats?user_id=1&type=today`

---

## 错误响应格式

所有错误响应都遵循统一格式：

```json
{
    "success": false,
    "code": 400,
    "message": "错误描述",
    "timestamp": "2024-01-15 10:30:00"
}
```

### 常见错误码

- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 端点不存在
- `409`: 冲突（用户名或邮箱已存在）
- `500`: 服务器内部错误

## 鸿蒙应用集成示例

### 网络请求配置

```typescript
import http from '@ohos.net.http';

class ApiService {
  private baseUrl = 'http://your-domain/api/';
  private userId: number = 0;

  // 设置用户ID
  setUserId(userId: number) {
    this.userId = userId;
  }

  // 通用请求方法
  private async request(endpoint: string, method: string, data?: any) {
    const httpRequest = http.createHttp();
    
    const options = {
      method: method,
      header: {
        'Content-Type': 'application/json'
      },
      extraData: data ? JSON.stringify(data) : undefined
    };

    try {
      const response = await httpRequest.request(this.baseUrl + endpoint, options);
      return JSON.parse(response.result.toString());
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    } finally {
      httpRequest.destroy();
    }
  }

  // 用户登录
  async login(loginData: any) {
    const response = await this.request('login', 'POST', loginData);
    if (response.success && response.data.user) {
      this.setUserId(response.data.user.id);
    }
    return response;
  }

  // 上传传感器数据
  async uploadSensorData(sensorData: any) {
    const data = {
      user_id: this.userId,
      ...sensorData
    };
    return this.request('sensor_data/endpoints/upload', 'POST', data);
  }

  // 获取最新传感器数据
  async getLatestSensorData(deviceTopic: string) {
    const endpoint = `sensor_data/endpoints/latest?user_id=${this.userId}&device_topic=${deviceTopic}`;
    return this.request(endpoint, 'GET');
  }
}
```

## 安全特性

1. **密码加密**: 使用PHP的`password_hash()`函数
2. **输入验证**: 严格的数据验证和清理
3. **SQL注入防护**: 使用PDO预处理语句
4. **CORS支持**: 支持跨域请求
5. **日志记录**: 完整的操作日志

## 部署说明

### 宝塔面板部署步骤

1. **上传文件**
   - 将整个 `api58` 文件夹上传到网站根目录（例如：`/www/wwwroot/your-domain/api58`）

2. **配置数据库**
   - 编辑 `config/database.php`，确保数据库连接参数正确

3. **导入数据库表**
   - 在宝塔面板的phpMyAdmin中执行 `database/create_tables.sql`
   - 执行 `sensor_data/database/create_sensor_tables.sql`

4. **设置文件权限**
   - `logs/` 目录：755 或 777（自动创建）
   - 其他文件：644
   - 目录：755

5. **配置伪静态**
   - 在网站设置中选择"伪静态"
   - 添加 Nginx 或 Apache 重写规则（见下文）

### Nginx 伪静态配置

```nginx
location /api58/ {
    try_files $uri $uri/ /api58/index.php?$query_string;
}
```

### Apache .htaccess

在 `api58` 目录创建 `.htaccess` 文件：

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

6. **测试API**
   - 访问 `http://your-domain/api58/` 应该看到API信息

## 日志和监控

- API访问日志存储在`logs/`目录
- 日志文件按日期分割：`api_2024-01-15.log`
- 包含详细的错误信息和用户操作记录

## 常见问题

### 1. 数据库连接失败
**解决方案**: 
- 检查 `config/database.php` 中的连接参数
- 确保MySQL服务正在运行
- 检查数据库用户权限

### 2. 404错误
**解决方案**: 
- 确保伪静态规则配置正确
- 检查文件路径是否正确

### 3. CORS错误
**解决方案**: 
- 已在 `config.php` 中配置CORS允许所有来源
- 如需限制来源，修改 `Access-Control-Allow-Origin` 的值

## 版本信息

- **当前版本**: v1.0
- **PHP版本要求**: 7.4+
- **MySQL版本要求**: 5.7+
- **认证方式**: 简化认证（无JWT）

## 注意事项

⚠️ **重要提示**:
- 本API已移除JWT认证机制，采用简化的user_id方式
- 所有需要用户身份的接口都通过 `user_id` 参数传递
- 生产环境建议添加更严格的身份验证机制

## 联系支持

如有问题或建议，请查看项目文档或联系开发团队。
\n+---
\n+## 设备 v1 接口与数据结构
\n+### 新增端点
- `POST /api/device/v1/data/raw` 原始设备数据上报
- `POST /api/device/v1/data/processed` 处理后设备数据上报
- `GET /api/device/v1/status?device_id={id}` 设备状态查询
- `POST /api/device/v1/command` 设备控制指令
\n+### 设备数据结构（JSON）
```json
{
  "模型名称": "SensorData",
  "字段": {
    "device_id": { "type": "string", "description": "设备唯一标识", "example": "esp32_kitchen_001" },
    "timestamp": { "type": "string", "description": "数据采集时间", "format": "date-time" },
    "sensors": {
      "type": "object",
      "properties": {
        "camera": { "image_url": "string", "image_base64": "string" },
        "fire_sensor": { "value": "number", "unit": "ADC", "status": "normal|warning|danger" },
        "gas_sensor": { "value": "number", "unit": "ppm", "gas_type": "smoke|methane|lpg" },
        "pm25_sensor": { "value": "number", "unit": "μg/m³", "aqi_level": "good|moderate|unhealthy" }
      }
    }
  }
}
```
\n+### Postman 前置脚本
```javascript
pm.request.headers.add({
  key: 'Device-ID',
  value: `esp32_${Date.now()}`
});

pm.request.body.raw = JSON.stringify({
  ...JSON.parse(pm.request.body.raw),
  timestamp: new Date().toISOString()
});
```
\n+### 测试场景建议
- 正常数据上报测试：完整 `sensors` 字段，期望 `201`
- 异常数据格式测试：缺失字段，期望 `400`
- 网络中断重试测试：模拟失败重试，验证幂等
- 批量数据压力测试：高并发上报，观察性能
\n+### MQTT 数据通道
- 主题：`kitchen/sensor/data`
- 订阅脚本：`php mqtt/kitchen_sensor_subscriber.php`
- 环境变量：`MQTT_HOST`、`MQTT_PORT`、`MQTT_USER`、`MQTT_PASS`
- 依赖安装：`composer require php-mqtt/client`
\n+消息格式同“原始数据上报”，订阅后以 `raw` 存储并更新设备 `last_seen`。
