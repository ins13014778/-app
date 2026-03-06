<?php
/**
 * 获取消息API接口
 * 封装巴法云(bemfa)获取主题消息服务
 * GET /api/get-message
 * 
 * 功能：获取主题的历史消息
 */

require_once __DIR__ . '/../config/config.php';

// 只允许GET请求
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    apiResponse(405, '只允许GET请求', null, false);
}

// 巴法云API配置
define('BEMFA_GET_MSG_URL', 'https://apis.bemfa.com/va/getmsg');

try {
    // 获取请求参数
    $uid = isset($_GET['uid']) ? $_GET['uid'] : null;
    $topic = isset($_GET['topic']) ? $_GET['topic'] : null;
    $type = isset($_GET['type']) ? intval($_GET['type']) : null;
    $num = isset($_GET['num']) ? intval($_GET['num']) : 1;

    // 验证必填字段
    if (empty($uid)) {
        apiResponse(HTTP_BAD_REQUEST, '缺少uid参数（用户私钥）', null, false);
    }

    if (empty($topic)) {
        apiResponse(HTTP_BAD_REQUEST, '缺少topic参数（主题名称）', null, false);
    }

    if (!in_array($type, [1, 3])) {
        apiResponse(HTTP_BAD_REQUEST, 'type参数错误（1=MQTT协议，3=TCP协议）', null, false);
    }

    // 验证num范围
    if ($num < 1) {
        $num = 1;
    }
    if ($num > 5000) {
        $num = 5000;
    }

    // 构建请求URL
    $queryParams = http_build_query([
        'uid' => $uid,
        'topic' => $topic,
        'type' => $type,
        'num' => $num
    ]);

    $requestUrl = BEMFA_GET_MSG_URL . '?' . $queryParams;

    // 发送请求到巴法云
    $result = fetchFromBemfa($requestUrl);

    if ($result['success']) {
        logMessage("获取消息成功: topic={$topic}, num={$num}", 'INFO');
        apiResponse(HTTP_OK, '获取消息成功', $result['data']);
    } else {
        logMessage("获取消息失败: " . $result['message'], 'ERROR');
        apiResponse(HTTP_INTERNAL_SERVER_ERROR, $result['message'], $result['data'], false);
    }

} catch (Exception $e) {
    logMessage("获取消息接口异常: " . $e->getMessage(), 'ERROR');
    apiResponse(HTTP_INTERNAL_SERVER_ERROR, '服务器内部错误', null, false);
}

/**
 * 从巴法云API获取数据
 * @param string $url 请求URL
 * @return array 返回结果
 */
function fetchFromBemfa($url) {
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json; charset=utf-8'
        ],
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return [
            'success' => false,
            'message' => 'CURL错误: ' . $error,
            'data' => null
        ];
    }

    $responseData = json_decode($response, true);

    if ($responseData === null) {
        return [
            'success' => false,
            'message' => '解析响应失败',
            'data' => $response
        ];
    }

    // 巴法云返回 code=0 表示成功
    if (isset($responseData['code']) && $responseData['code'] === 0) {
        return [
            'success' => true,
            'message' => 'OK',
            'data' => $responseData
        ];
    }

    // 错误码映射
    $errorMessages = [
        10002 => '请求参数有误',
        40000 => '未知错误',
        40004 => '私钥或主题错误'
    ];

    $errorCode = $responseData['code'] ?? 'unknown';
    $errorMsg = $errorMessages[$errorCode] ?? ($responseData['message'] ?? '获取消息失败');

    return [
        'success' => false,
        'message' => $errorMsg,
        'data' => $responseData
    ];
}
?>
