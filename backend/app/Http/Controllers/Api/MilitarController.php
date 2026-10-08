<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Militar;
use Illuminate\Http\Request;

class MilitarController extends Controller
{
    public function index()
    {
        $pk = $this->primaryKey();

        return response()->json(
            Militar::query()->orderBy($pk)->get()
        );
    }

    public function show(int $id)
    {
        return response()->json($this->findMilitar($id));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $militar = Militar::create($data);

        return response()->json($militar, 201);
    }

    public function update(Request $request, int $id)
    {
        $data = $this->validated($request);
        $militar = $this->findMilitar($id);
        $militar->update($data);

        return response()->json($militar);
    }

    public function destroy(int $id)
    {
        $this->findMilitar($id)->delete();

        return response()->json([], 204);
    }

    private function findMilitar(int $id): Militar
    {
        return Militar::query()
            ->where($this->primaryKey(), $id)
            ->firstOrFail();
    }

    private function primaryKey(): string
    {
        return config('sichs.militares.primary_key', 'idmilitares');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'posto' => ['required', 'string', 'max:50'],
            'nomecomp' => ['required', 'string', 'max:255'],
            'saram' => ['required', 'string', 'max:50'],
            'ultimapromocao' => ['nullable', 'string', 'max:50'],
        ]);
    }
}
