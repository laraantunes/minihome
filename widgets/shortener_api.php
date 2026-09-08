<?php
header("Content-Type: application/json");

$input = file_get_contents("php://input");
$data = json_decode($input, true);
$url = $data["url"] ?? "";

if (empty($url)) {
    http_response_code(400);
    echo json_encode(["error" => "URL is required"]);
    exit;
}

$ch = curl_init("https://ctln.link/api/link");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(["url" => $url]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpcode);
echo $response;
