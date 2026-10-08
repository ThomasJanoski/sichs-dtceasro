<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <style>
        /* Paleta de cores do Sistema */
        :root {
            --bg-color: #f3f6f5;
            --text-primary: #1d3036;
            --text-secondary: #63757a;
            --border-color: #d8e2e1;
            --primary: #176b87;
            --success: #287653;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: var(--text-primary);
            background-color: #ffffff;
            margin: 20px;
        }

        .header {
            margin-bottom: 20px;
        }

        .center {
            text-align: center;
        }

        h2 {
            color: var(--primary);
            margin: 5px 0;
            font-size: 16px;
        }

        h3 {
            color: var(--text-secondary);
            margin: 5px 0;
            font-size: 13px;
            font-weight: normal;
        }

        .block {
            border: 1px solid var(--border-color);
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 4px;
            /* O Dompdf ignora border-radius, mas fica como boa prática */
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            padding: 4px 0;
            vertical-align: top;
        }

        .label {
            color: var(--text-secondary);
            font-size: 11px;
        }

        .value {
            font-weight: bold;
        }

        hr {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 15px 0;
        }

        .obs {
            margin-top: 8px;
            padding: 8px;
            background-color: var(--bg-color);
            border-left: 3px solid var(--primary);
            font-style: italic;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="center">
            <b>PRIMEIRO CENTRO INTEGRADO DE DEFESA AEREA E CONTROLE DE TRAFEGO AEREO</b><br>
            <b>DESTACAMENTO DE CONTROLE DO ESPACO AEREO DE SAO ROQUE</b>
            <h2>Relatório: {{ $label }}</h2>
            <h3>Período: {{ \Carbon\Carbon::parse($datainicio)->format('d/m/Y') }} a
                {{ \Carbon\Carbon::parse($datafinal)->format('d/m/Y') }}
            </h3>
        </div>
    </div>

    @forelse($leituras as $l)
        <div class="block">
            <table>
                <tr>
                    <td colspan="2"><span class="label">Coletor:</span> <span class="value">{{ $l->nomecoletor }}</span>
                    </td>
                    <td style="text-align: right;"><span class="label">Data/Hora:</span> <span
                            class="value">{{ \Carbon\Carbon::parse($l->datacoleta)->format('d/m/Y') }} {{ $l->horacoleta }}</span></td>
                </tr>
                <tr>
                    <td><span class="label">Hidrômetro:</span><br><span class="value">{{ $l->hidrometro }} m³</span></td>
                    <td><span class="label">Leitura Ant.:</span><br><span class="value">{{ $l->hid_anterior }} m³</span>
                    </td>
                    <td style="text-align: right;">
                        <span class="label">Consumo no período:</span><br>
                        <span class="value" style="
                                font-weight: bold;
                                color: 
                                    @if($l->total_calculado >= 32) #b33f3f; /* Vermelho Erro */
                                    @elseif($l->total_calculado >= 25) #96611f; /* Âmbar Atenção */
                                    @else #287653; /* Verde Sucesso */
                                    @endif
                            ">
                            {{ round($l->total_calculado ?? 0, 2) }} m³
                        </span>
                    </td>
                </tr>
            </table>

            @if($l->observacoes)
                <div class="obs">
                    <span class="label">Observações:</span> {{ $l->observacoes }}
                </div>
            @endif
        </div>
    @empty
        <p class="center">Nenhuma leitura encontrada no período.</p>
    @endforelse
</body>

</html>