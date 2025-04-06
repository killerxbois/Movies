<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['url'])) {
    $url = $_POST['url'];
    $url = strtok($url, '?'); // Remove query parameters
    $url = $url . '?__a=1&__d=dis'; // Instagram internal API

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    $videoUrl = $data['graphql']['shortcode_media']['video_url'] ?? null;

    echo json_encode([
        "video" => $videoUrl
    ]);
}
