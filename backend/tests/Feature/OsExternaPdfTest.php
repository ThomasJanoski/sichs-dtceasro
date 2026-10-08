<?php

namespace Tests\Feature;

use App\Models\OsExterna;
use App\Services\OsExternaPdfService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OsExternaPdfTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'sisos.os_externas.table' => 'os_externas',
            'sisos.os_externas.primary_key' => 'id',
            'sisos.os_externas.timestamps' => true,
        ]);
    }

    public function test_pdf_service_generates_valid_pdf_bytes(): void
    {
        $os = OsExterna::create([
            'nomecomp' => '1 TEN TESTE',
            'viatura' => 'VW AMAROK',
            'natsv' => 'Missao de teste',
            'destino' => 'Sao Roque',
            'datasai' => '2026-05-17',
            'horasai' => '08:00',
            'resultseg' => '04:00',
        ]);

        $bytes = app(OsExternaPdfService::class)->render($os, 'chefe_sa');

        $this->assertStringStartsWith('%PDF', $bytes);
        $this->assertGreaterThan(1000, strlen($bytes));
    }

    public function test_os_externa_pdf_endpoint_returns_pdf(): void
    {
        $os = OsExterna::create([
            'nomecomp' => 'SGT API',
            'viatura' => 'SAVEIRO',
            'natsv' => 'Servico',
            'destino' => 'Base',
            'datasai' => '2026-05-17',
            'horasai' => '09:00',
            'resultseg' => '02:00',
        ]);

        $response = $this->get("/api/os-externas/{$os->id}/pdf");

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
        $this->assertStringStartsWith('%PDF', $response->getContent());
    }
}
