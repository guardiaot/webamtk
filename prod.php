<?php


$source = 'public/build/.vite/manifest.json';
$destination = 'public/build/manifest.json';

    if(!file_exists($source)){
        echo "Arquivo manifest.json não encontrado!".PHP_EOL;
        echo "Verifique se o arquivo manifest.json está no diretório public/build/.vite/".PHP_EOL;
        echo "Caso não esteja, execute o comando 'vite build' para gerar o arquivo manifest.json".PHP_EOL;
        echo "Após gerar o arquivo manifest.json, execute o comando 'php prod.php' novamente".PHP_EOL;
        exit;
    } else {
        if (copy($source, $destination)) {
            echo "Arquivo manifest.json copiado com sucesso!".PHP_EOL;
        } else {
            echo "Erro ao copiar manifest.json".PHP_EOL;
        }
    }


$source = 'resources/_DEV/app.blade.prod';
$destination = 'resources/views/app.blade.prod';

    if (copy($source, $destination)) {
        echo "Arquivo app.blade.prod copiado com sucesso!".PHP_EOL;
    } else {
        echo "Erro ao copiar app.blade.prod".PHP_EOL;
    }

$nomeoriginal = 'resources/views/app.blade.prod';
$novonome = 'resources/views/app.blade.php';

    if (rename($nomeoriginal, $novonome)) {
        echo "Arquivo app.blade.prod renomeado com sucesso!".PHP_EOL;
    } else {
        echo "Erro ao renomear o arquivo.".PHP_EOL;
    }



?>