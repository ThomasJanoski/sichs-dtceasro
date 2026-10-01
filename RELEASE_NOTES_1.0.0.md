# SICHS 1.0.0

Primeira versão do SICHS para apoiar o controle operacional de hidrômetros e o cadastro de militares do DTCEA-SRO.

## Destaques

- Painel autenticado com navegação para leituras, militares e relatórios.
- Consulta de leituras registradas, com filtro por hidrômetro e dados do coletor, medição, data, hora e consumo.
- Formulário de leitura com seleção do hidrômetro e do militar coletor, cálculo do consumo e campo de observações.
- Cadastro, edição e remoção de militares.
- Geração de relatório PDF por hidrômetro e período selecionado.
- Interface responsiva com estados de carregamento, mensagens de erro e notificações de sucesso.
- Frontend Angular servido pelo backend Laravel após a publicação do build.

## Tecnologias

- Angular 22 e TypeScript no frontend.
- PHP 8.3 ou superior, Laravel 13 e Composer no backend.
- DomPDF para geração de relatórios.
- MySQL como configuração de referência no arquivo `backend/.env.example`; ajuste a conexão ao ambiente de instalação.

## Verificação

Build de produção e testes unitários do frontend executados com sucesso:

- `npm run build`
- `npm test -- --watch=false` (3 testes)

## Instalação e publicação

Consulte o [README](README.md) para os pré-requisitos, configuração local, conexão com o banco de dados e publicação.

Antes de aplicar migrações em um banco legado, faça backup e revise o esquema. Os seeders criam dados de demonstração e são destinados apenas a bancos locais descartáveis; não os execute em produção.

## Observação sobre o script de deploy

O `deploy.sh` incluído está configurado para o host SSH `DC2` e o caminho `C:/laragon/www/sichs`. Revise esses valores e as credenciais do ambiente antes de usar o script fora dessa configuração.