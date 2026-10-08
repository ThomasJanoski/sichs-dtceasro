<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\LeituraHidrometro;
use Illuminate\Support\Facades\DB;

class ImportarLeiturasAntigas extends Command
{
    protected $signature = 'importar:leituras';
    protected $description = 'Importa leituras antigas e calcula o consumo';

    public function handle()
    {
        // Organize seus dados aqui
        $dados = [
            ['S2 NE Everton Nascimento Dos Santos', '10869.619', '2026-04-22', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '10910.834', '2026-04-23', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '10936.42', '2026-04-25', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '10971.885', '2026-04-26', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '10972.885', '2026-04-27', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11000.001', '2026-04-28', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11001.653', '2026-04-30', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11054.403', '2026-05-01', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11531.045', '2026-05-01', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11066.501', '2026-05-02', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11082.969', '2026-05-03', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11095.321', '2026-05-04', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11144.43', '2026-05-05', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11149.43', '2026-05-06', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11157.166', '2026-05-07', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11163.476', '2026-05-08', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11163.9', '2026-05-09', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11202.945', '2026-05-10', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11203.1', '2026-05-11', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11238.006', '2026-05-12', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11245.233', '2026-05-13', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11258.137', '2026-05-14', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11283.007', '2026-05-15', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11299.561', '2026-05-16', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11796.036', '2026-05-16', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11314.672', '2026-05-17', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11326.71', '2026-05-18', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11350.065', '2026-05-19', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11370.22', '2026-05-20', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11388.176', '2026-05-21', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11388.5', '2026-05-22', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11406.665', '2026-05-23', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11407', '2026-05-24', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11438.278', '2026-05-25', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11452.741', '2026-05-26', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11460.347', '2026-05-27', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11505.022', '2026-05-28', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11523.655', '2026-05-30', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11531.045', '2026-06-01', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12057.288', '2026-06-01', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12064.029', '2026-06-01', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11552.857', '2026-06-02', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11555.857', '2026-06-03', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11592.024', '2026-06-04', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11599.353', '2026-06-05', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11599.353', '2026-06-06', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11641.348', '2026-06-07', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11658.804', '2026-06-08', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11677.315', '2026-06-09', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11694.666', '2026-06-10', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11718.215', '2026-06-11', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11730.85', '2026-06-12', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11730.999', '2026-06-13', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11735', '2026-06-14', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11782.805', '2026-06-15', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11796.25', '2026-06-16', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11850', '2026-06-17', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11840.214', '2026-06-18', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11840.514', '2026-06-18', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '118420', '2026-06-19', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11851.996', '2026-06-20', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11885.606', '2026-06-21', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11902.145', '2026-06-22', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '1920.407', '2026-06-23', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11937.144', '2026-06-24', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11969.282', '2026-06-26', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11985.299', '2026-06-27', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11996.307', '2026-06-28', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12019.238', '2026-06-29', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12032.858', '2026-06-30', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11531.045', '2026-07-01', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11592.024', '2026-07-03', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11592.024', '2026-07-04', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11599.353', '2026-07-05', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11641.348', '2026-07-07', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11658.804', '2026-07-08', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11677.315', '2026-07-09', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11694.666', '2026-07-10', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11730.85', '2026-07-11', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11730.895', '2026-07-12', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11748.28', '2026-07-13', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11749.106', '2026-07-14', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11782.805', '2026-07-15', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11796.036', '2026-07-16', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11815.568', '2026-07-17', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11840.214', '2026-07-18', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11851.996', '2026-07-20', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '11885.609', '2026-07-21', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11902.145', '2026-07-22', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '1920.407', '2026-07-23', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11937.144', '2026-07-24', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11969.282', '2026-07-26', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11985.299', '2026-07-27', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '11996.307', '2026-07-28', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12019.238', '2026-07-29', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12032.858', '2026-07-30', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12064.029', '2026-08-01', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12064.2', '2026-08-02', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12064.5', '2026-08-03', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12116.132', '2026-08-04', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12141.667', '2026-08-05', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12141.9', '2026-08-06', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '1216.841', '2026-08-07', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12191.856', '2026-08-08', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12198.5', '2026-08-09', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12225.072', '2026-08-10', '08:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12225.4', '2026-08-11', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12280.072', '2026-08-12', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12289.035', '2026-08-13', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12311.54', '2026-08-14', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12311.95', '2026-08-16', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12345.999', '2026-08-17', '08:00', 'observado e passado para o encarregado e comandante.'],
            ['S2 NE Everton Nascimento Dos Santos', '12366.743', '2026-08-18', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12392.301', '2026-08-19', '08:00', 'observado e passado para o encarregado e comandante.'],
            ['S2 NE Everton Nascimento Dos Santos', '12413.323', '2026-08-20', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12430.345', '2026-08-21', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12448.415', '2026-08-22', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12456.85', '2026-08-23', '08:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12482.636', '2026-08-24', '15:00', 'observado e passado para o encarregado e comandante.'],
            ['S2 NE Everton Nascimento Dos Santos', '12506.233', '2026-08-25', '15:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12519.412', '2026-08-26', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12537.618', '2026-08-27', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12555.976', '2026-08-28', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12589.999', '2026-08-30', '15:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12609.156', '2026-08-31', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12618.984', '2026-09-01', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12644.395', '2026-09-02', '15:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12660.729', '2026-09-03', '15:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12682.455', '2026-09-04', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12699.617', '2026-09-05', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12705.871', '2026-09-06', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12731.376', '2026-09-07', '15:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12746.39', '2026-09-08', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12785.39', '2026-09-09', '15:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12805.352', '2026-09-10', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12834.833', '2026-09-11', '15:00', 'observado e passado para o comandante e encarregado.'],
            ['S2 NE Everton Nascimento Dos Santos', '12838.309', '2026-09-12', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12856.314', '2026-09-13', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12875.463', '2026-09-14', '15:00', null],
            ['S2 NE Everton Nascimento Dos Santos', '12885.849', '2026-09-15', '15:00', null],
        ];

        $tabela = 'hidrometros'; // Ajuste conforme necessário

        foreach (array_reverse($dados) as $dado) {
            $valorAtual = (float) str_replace(',', '.', $dado[1]);

            // Busca a última leitura antes da data atual para calcular o "total"
            $ultima = LeituraHidrometro::forTable($tabela)
                ->where('datacoleta', '<', $dado[2])
                ->orderByDesc('datacoleta')
                ->value('hidrometro');

            $valorUltima = (float) ($ultima ?? 0);
            $total = max(0, $valorAtual - $valorUltima);

            LeituraHidrometro::forTable($tabela)->create([
                'nomecoletor' => $dado[0],
                'hidrometro' => (string) $valorAtual,
                'datacoleta' => $dado[2],
                'horacoleta' => $dado[3],
                'total' => number_format($total, 3, '.', ''),
                'hid_cal' => (string) $valorUltima,
                'observacoes' => $dado[4],
            ]);

            $this->info("Importado: {$dado[2]} - Leitura: {$valorAtual}");
        }
    }
}