<?php
header('Content-Type: application/json');

try {
    $repoUrl = 'https://api.github.com/repos/laraantunes/minihome/releases/latest';
    $options = [
        'http' => [
            'header' => "User-Agent: minihome-updater\r\n"
        ]
    ];
    $context = stream_context_create($options);
    $response = @file_get_contents($repoUrl, false, $context);
    
    if (!$response) {
        throw new Exception("Falha ao obter informações do GitHub. Verifique a conexão ou limite de requisições.");
    }
    
    $releaseInfo = json_decode($response, true);
    $downloadUrl = null;
    
    if (isset($releaseInfo['assets'])) {
        foreach ($releaseInfo['assets'] as $asset) {
            if ($asset['name'] === 'minihome-release.zip') {
                $downloadUrl = $asset['browser_download_url'];
                break;
            }
        }
    }
    
    if (!$downloadUrl) {
        // Fallback para o código fonte (zipball)
        $downloadUrl = $releaseInfo['zipball_url'] ?? null;
    }
    
    if (!$downloadUrl) {
        throw new Exception("Nenhum arquivo de atualização encontrado na última release.");
    }

    $zipFile = __DIR__ . '/update_temp.zip';
    
    // Configurar timeout e seguir redirecionamentos para o download do ZIP
    $downloadOptions = [
        'http' => [
            'header' => "User-Agent: minihome-updater\r\n",
            'follow_location' => 1,
            'timeout' => 60
        ]
    ];
    $downloadContext = stream_context_create($downloadOptions);
    $zipContent = @file_get_contents($downloadUrl, false, $downloadContext);
    
    if (!$zipContent) {
        throw new Exception("Falha ao baixar o arquivo de atualização. " . error_get_last()['message']);
    }
    
    file_put_contents($zipFile, $zipContent);
    
    $zip = new ZipArchive();
    if ($zip->open($zipFile) === TRUE) {
        $extractPath = __DIR__ . '/';
        $rootFolder = '';
        
        $firstEntry = $zip->getNameIndex(0);
        if (strpos($firstEntry, '/') !== false && substr_count($firstEntry, '/') == 1 && substr($firstEntry, -1) == '/') {
            $rootFolder = $firstEntry;
        }

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $filename = $zip->getNameIndex($i);
            $destName = $filename;
            
            if ($rootFolder && strpos($filename, $rootFolder) === 0) {
                $destName = substr($filename, strlen($rootFolder));
            }
            
            if (empty($destName)) continue;
            
            if (substr($destName, -1) === '/') {
                if (!is_dir($extractPath . $destName)) {
                    mkdir($extractPath . $destName, 0755, true);
                }
            } else {
                $dirname = dirname($extractPath . $destName);
                if (!is_dir($dirname)) {
                    mkdir($dirname, 0755, true);
                }
                $content = $zip->getFromIndex($i);
                file_put_contents($extractPath . $destName, $content);
            }
        }
        $zip->close();
        unlink($zipFile);
        
        $version = $releaseInfo['tag_name'] ?? 'nova';
        echo json_encode(['success' => true, 'message' => "Minihome atualizado com sucesso para a versão {$version}! A página será recarregada."]);
    } else {
        if(file_exists($zipFile)) unlink($zipFile);
        throw new Exception("Não foi possível abrir o arquivo ZIP da atualização.");
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
