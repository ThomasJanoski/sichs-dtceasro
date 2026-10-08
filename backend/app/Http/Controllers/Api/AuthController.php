<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $data = $request->validate([
        'username' => ['required', 'string'],
        'password' => ['required', 'string'],
    ]);

    // Usando o Model (agora corrigido)
    $user = Usuario::where('login', $data['username'])->first();

    if (!$user) {
        return response()->json(['message' => 'Usuário não encontrado'], 401);
    }

    // Se a senha no banco for texto puro, comparamos direto:
    if ($user->senha !== $data['password']) {
         // Se quiser manter suporte a senhas antigas (texto puro) e novas (hash):
         if (!password_verify($data['password'], $user->senha)) {
            return response()->json(['message' => 'Senha incorreta'], 401);
         }
    }

    return response()->json([
        'token' => \Illuminate\Support\Str::random(60),
        'user' => [
            'usuario' => $user->login,
            'id' => $user->id,
            'role' => $user->niveis_acesso_id,
        ],
    ]);
}
}
