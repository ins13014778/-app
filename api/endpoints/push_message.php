<?php
/**
 * 推送消息API接口
 * 封装巴法云(bemfa)推送消息服务
 * POST /api/push-message
 * 
 * 功能：向指定主题发送消息，支持向微信推送通知
 */

require_once __DIR__ . '/../config/config.php';

// 只允许POST请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    apiResponse(405, '只允许POST请求', null, false);
}

// 巴法云API配置
define('BEMFA_API_URL', 'https://apis.bemfa.com/va/postJsonMsg');

try {
    // 获取请求数据
    $input = json_decode(file_get_contents('php://input'), true);

    // 验证必填字段
    if (empty($input['uid'])) {
        apiResponse(HTTP_BAD_REQUEST, '缺少uid参数（用户私钥）', null, false);
    }

    if (empty($input['topic'])) {
        apiResponse(HTTP_BAD_REQUEST, '缺少topic参数（主题名称）', null, false);
    }

    if (!isset($input['type']) || !in_array($input['type'], [1, 3])) {
        apiResponse(HTTP_BAD_REQUEST, 'type参数错误（1=MQTT协议，3=TCP协议）', null, false);
    }

    if (empty($input['msg'])) {
        apiResponse(HTTP_BAD_REQUEST, '缺少msg参数（消息内容）', null, false);
    }

    // 构建请求数据
    $postData = [
        'uid' => $input['uid'],
        'topic' => $input['topic'],
        'type' => intval($input['type']),
        'msg' => $input['msg']
    ];

    // 可选参数
    if (isset($input['share'])) {
        $postData['share'] = (bool)$input['share'];
    }

    if (isset($input['wemsg']) && !empty($input['wemsg'])) {
        $postData['wemsg'] = $input['wemsg'];
    }

    // 发送请求到巴法云
    $result = sendToBemfa($postData);

    if ($result['success']) {
        logMessage("推送消息成功: topic={$input['topic']}, msg={$input['msg']}", 'INFO');
        apiResponse(HTTP_OK, '推送消息成功', $result['data']);
    } else {
        logMessage("推送消息失败: " . $result['message'], 'ERROR');
        apiResponse(HTTP_INTERNAL_SERVER_ERROR, $result['message'], $result['data'], false);
    }

} catch (Exception $e) {
    logMessage("推送消息接口异常: " . $e->getMessage(), 'ERROR');
    apiResponse(HTTP_INTERNAL_SERVER_ERROR, '服务器内部错误', null, false);
}

/**
 * 发送请求到巴法云API
 * @param array $data 请求数据
 * @return array 返回结果
 */
function sendToBemfa($data) {
    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => BEMFA_API_URL,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
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
    $errorMsg = $errorMessages[$errorCode] ?? ($responseData['message'] ?? '推送失败');

    return [
        'success' => false,
        'message' => $errorMsg,
        'data' => $responseData
    ];
}
?>
