<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$leituras = collect([
    (object) [
        'nomecoletor' => 'CAP TESTE',
        'hidrometro' => '125.500',
        'datacoleta' => '2026-05-17',
        'horacoleta' => '08:00',
        'total' => '5.200',
        'hid_cal' => '120.300',
        'observacoes' => 'Teste PDF',
    ],
]);

$html = view('pdf.hidrometro-relatorio', [
    'label' => 'Hidrometro 1 (Principal)',
    'datainicio' => '2026-05-01',
    'datafinal' => '2026-05-17',
    'leituras' => $leituras,
])->render();

$options = new Dompdf\Options;
$options->set('isHtml5ParserEnabled', true);
$dompdf = new Dompdf\Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$bytes = $dompdf->output();

$out = __DIR__.'/../storage/app/test-relatorio-hidrometro.pdf';
file_put_contents($out, $bytes);
echo 'OK: '.strlen($bytes).' bytes, magic='.substr($bytes, 0, 4).PHP_EOL;
