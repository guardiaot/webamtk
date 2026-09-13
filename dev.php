<?php





$source = 'resources/_DEV/app.blade.dev';
$destination = 'resources/views/app.blade.dev';

if (copy($source, $destination)) {
    echo "Arquivo app.blade.dev copiado com sucesso!".PHP_EOL;
} else {
    echo "Erro ao copiar app.blade.dev".PHP_EOL;
}

$nomeoriginal = 'resources/views/app.blade.dev';
$novonome = 'resources/views/app.blade.php';

if (rename($nomeoriginal, $novonome)) {
    echo "Arquivo app.blade.dev renomeado com sucesso!".PHP_EOL;
} else {
    echo "Erro ao renomear o arquivo.".PHP_EOL;
}
