<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HidrometroControllerTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_can_get_leituras_index()
    {
        $response = $this->getJson('/api/hidrometros/hidrometros');

        $response->assertStatus(200);
    }

    public function test_pdf_endpoint_requires_dates()
    {
        $response = $this->getJson('/api/hidrometros/hidrometros/pdf');

        $response->assertStatus(422);
    }
}
