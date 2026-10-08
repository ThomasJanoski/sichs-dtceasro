<?php

return [
    'militares' => [
        'table' => env('SICHS_MILITARES_TABLE', 'militares'),
        'primary_key' => env('SICHS_MILITARES_PK', 'idmilitares'),
        'timestamps' => env('SICHS_MILITARES_TIMESTAMPS', false),
    ],
    'usuarios' => [
        'table' => env('SICHS_USUARIOS_TABLE', 'usuarios'),
        'primary_key' => env('SICHS_USUARIOS_PK', 'id'),
        'timestamps' => env('SICHS_USUARIOS_TIMESTAMPS', false),
    ],
    'hidrometros' => [
        'tabelas' => [
            ['tabela' => 'hidrometros', 'label' => 'Hidrometro 1 (Principal)']
        //    ['tabela' => 'hidrometro02', 'label' => 'Hidrometro 2'],
        //    ['tabela' => 'hidrometro03', 'label' => 'Hidrometro 3'],
        //    ['tabela' => 'hidrometro04', 'label' => 'Hidrometro 4'],
        //    ['tabela' => 'hidrometro05', 'label' => 'Hidrometro 5'],
        //    ['tabela' => 'hidrometro06', 'label' => 'Hidrometro 6'],
        //    ['tabela' => 'hidrometro07', 'label' => 'Hidrometro 7'],
        //    ['tabela' => 'hidrometro08', 'label' => 'Hidrometro 8'],
        //    ['tabela' => 'hidrometro09', 'label' => 'Hidrometro 9'],
        //    ['tabela' => 'hidrometro10', 'label' => 'Hidrometro 10'],
        //    ['tabela' => 'hidrometro11', 'label' => 'Hidrometro 11'],
        ],
    ],
];
