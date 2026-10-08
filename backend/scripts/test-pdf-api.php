<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$pk = config('sisos.os_externas.primary_key', 'idmilitar');
$os = App\Models\OsExterna::query()->orderByDesc($pk)->first();

if (! $os) {
    echo "Nenhuma OS encontrada na tabela ".config('sisos.os_externas.table').PHP_EOL;
    exit(1);
}

$id = $os->getKey();
$response = app(App\Services\OsExternaPdfService::class)->stream($os, 'chefe_sa');
$content = $response->getContent();
$out = __DIR__.'/../storage/app/os-'.$id.'.pdf';
file_put_contents($out, $content);

echo "OS #{$id} — PDF OK: ".strlen($content)." bytes (%PDF)".PHP_EOL;
echo "Arquivo: {$out}".PHP_EOL;
