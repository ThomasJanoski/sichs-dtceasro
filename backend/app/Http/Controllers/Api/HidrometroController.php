<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeituraHidrometro;
use App\Services\HidrometroPdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HidrometroController extends Controller
{
    public function __construct(private HidrometroPdfService $pdfService)
    {
    }

    public function tabelas()
    {
        return response()->json(config('sichs.hidrometros.tabelas', []));
    }

    public function index(Request $request)
    {
        // Se você não precisa mais do parâmetro $tabela vindo da URL, 
        // pode remover o argumento da função.

        $filtro = $request->validate([
            'datainicio' => ['nullable', 'date'],
            'datafinal' => ['nullable', 'date'],
        ]);

        $query = DB::table('hidrometros') // AQUI mudamos para o nome da sua tabela
            ->select('*')
            // Cálculo do consumo: Leitura atual menos a anterior do mesmo hidrômetro
            ->selectRaw('hidrometro - LAG(hidrometro) OVER (ORDER BY datacoleta, horacoleta) as total_calculado ')
            ->orderByDesc('datacoleta')
            ->orderByDesc('horacoleta');

        if (!empty($filtro['datainicio'])) {
            $query->where('datacoleta', '>=', $filtro['datainicio']);
        }
        if (!empty($filtro['datafinal'])) {
            $query->where('datacoleta', '<=', $filtro['datafinal']);
        }

        return response()->json($query->paginate(20));
    }

    public function show(string $tabela, int $id)
    {
        return response()->json($this->findLeitura($tabela, $id));
    }

    public function ultima()
    {
        $ultima = DB::table('hidrometros')
            ->orderByDesc('datacoleta')
            ->orderByDesc('horacoleta')
            ->first();

        return response()->json(['valor' => (string) ($ultima->hidrometro ?? '0')]);
    }

    public function store(Request $request, string $tabela)
    {
        $this->assertTabela($tabela);
        $data = $this->validated($request);
        $leitura = LeituraHidrometro::forTable($tabela)->create($data);

        return response()->json($leitura, 201);
    }

    public function update(Request $request, string $tabela, int $id)
    {
        $data = $this->validated($request);
        $leitura = $this->findLeitura($tabela, $id);
        $leitura->update($data);

        return response()->json($leitura);
    }

    public function destroy(string $tabela, int $id)
    {
        $this->findLeitura($tabela, $id)->delete();

        return response()->json([], 204);
    }

    public function pdf(Request $request, string $tabela)
    {
        $this->assertTabela($tabela);
        $filtro = $request->validate([
            'datainicio' => ['required', 'date'],
            'datafinal' => ['required', 'date'],
        ]);

        $label = collect(config('sichs.hidrometros.tabelas', []))
            ->firstWhere('tabela', $tabela)['label'] ?? $tabela;

        $bytes = $this->pdfService->renderRelatorio(
            $tabela,
            $filtro['datainicio'],
            $filtro['datafinal']
        );

        $filename = 'relatorio_' . $tabela . '.pdf';

        return response($bytes, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }

    private function findLeitura(string $tabela, int $id): LeituraHidrometro
    {
        $this->assertTabela($tabela);
        $pk = $this->pk($tabela);

        return LeituraHidrometro::forTable($tabela)
            ->newQuery()
            ->where($pk, $id)
            ->firstOrFail();
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'nomecoletor' => ['required', 'string', 'max:255'],
            'hidrometro' => ['required', 'string', 'max:50'],
            'datacoleta' => ['required', 'date'],
            'horacoleta' => ['required', 'string', 'max:20'],
            'observacoes' => ['nullable', 'string', 'max:500'],
        ]);
    }

    private function assertTabela(string $tabela): void
    {
        $valid = collect(config('sichs.hidrometros.tabelas', []))
            ->pluck('tabela')
            ->contains($tabela);

        if (!$valid) {
            abort(404, 'Hidrometro invalido.');
        }
    }

    private function pk(string $tabela): string
    {
        return 'id' . $tabela;
    }
}
