<?php
header('Content-Type: application/xml; charset=utf-8');

if (!isset($_GET['url']) || empty($_GET['url'])) {
    http_response_code(400);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Missing URL parameter</error>';
    exit;
}

$url = $_GET['url'];

// Basic validation
if (filter_var($url, FILTER_VALIDATE_URL) === false) {
    http_response_code(400);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Invalid URL</error>';
    exit;
}

// Fetch the content using file_get_contents with a small timeout
$options = [
    'http' => [
        'method' => 'GET',
        'timeout' => 5,
        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ]
];
$context = stream_context_create($options);
$content = @file_get_contents($url, false, $context);

if ($content === false) {
    http_response_code(500);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Failed to fetch feed</error>';
    exit;
}

echo $content;
