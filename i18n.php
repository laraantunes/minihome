<?php
function i18n($lang, $key, ...$replacements) {
    static $translations = [];
    
    if (!isset($translations[$lang])) {
        $file = __DIR__ . "/lang/{$lang}.json";
        if (file_exists($file)) {
            $json = file_get_contents($file);
            $translations[$lang] = json_decode($json, true) ?? [];
        } else {
            $translations[$lang] = [];
        }
    }
    
    $text = $translations[$lang][$key] ?? $key;
    
    if (!empty($replacements)) {
        $text = sprintf($text, ...$replacements);
    }
    
    return $text;
}
