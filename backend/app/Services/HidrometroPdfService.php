<?php

namespace App\Services;

use App\Models\LeituraHidrometro;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\DB;

class HidrometroPdfService
{
    public function renderRelatorio(string $tabela, string $datainicio, string $datafinal): string
    {
        // 1. Usamos selectRaw para trazer o valor anterior e o cálculo da diferença
        // Se for o primeiro registro, o COALESCE garante que o anterior seja 0
        $leituras = LeituraHidrometro::forTable($tabela)
            ->newQuery()
            ->select('*')
            ->selectRaw('LAG(hidrometro) OVER (ORDER BY datacoleta, horacoleta) as hid_anterior')
            ->selectRaw('hidrometro - LAG(hidrometro) OVER (ORDER BY datacoleta, horacoleta) as total_calculado')
            ->whereBetween('datacoleta', [$datainicio, $datafinal])
            ->orderBy('datacoleta')
            ->orderBy('horacoleta')
            ->get();

        $label = collect(config('sichs.hidrometros.tabelas', []))
            ->firstWhere('tabela', $tabela)['label'] ?? $tabela;

        $html = view('pdf.hidrometro-relatorio', [
            'label' => $label,
            'datainicio' => $datainicio,
            'datafinal' => $datafinal,
            'leituras' => $leituras,
        ])->render();

        $options = new Options;
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->output();
    }
}