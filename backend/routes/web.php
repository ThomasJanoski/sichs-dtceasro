<?php

use App\Http\Controllers\Api\HidrometroController;
use App\Http\Controllers\Api\MilitarController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::get('militares', [MilitarController::class, 'index']);
    Route::post('militares', [MilitarController::class, 'store']);
    Route::get('militares/{id}', [MilitarController::class, 'show']);
    Route::put('militares/{id}', [MilitarController::class, 'update']);
    Route::delete('militares/{id}', [MilitarController::class, 'destroy']);

    Route::get('hidrometros/tabelas', [HidrometroController::class, 'tabelas']);
    Route::get('hidrometros/{tabela}/pdf', [HidrometroController::class, 'pdf']);
    Route::get('hidrometros/{tabela}/ultima', [HidrometroController::class, 'ultima']);
    Route::get('hidrometros/{tabela}', [HidrometroController::class, 'index']);
    Route::post('hidrometros/{tabela}', [HidrometroController::class, 'store']);
    Route::get('hidrometros/{tabela}/{id}', [HidrometroController::class, 'show']);
    Route::put('hidrometros/{tabela}/{id}', [HidrometroController::class, 'update']);
    Route::delete('hidrometros/{tabela}/{id}', [HidrometroController::class, 'destroy']);
});

Route::fallback(function () {
    $path = trim(request()->path(), '/');

    if ($path !== '' && is_file(public_path($path))) {
        return response()->file(public_path($path));
    }

    $indexPath = public_path('index.html');

    if (! is_file($indexPath)) {
        abort(404, 'Frontend build not found. Execute npm run build inside frontend.');
    }

    return response()->file($indexPath);
});
