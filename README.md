# SICHS | DTCEA-SRO

Sistema web do DTCEA-SRO para registrar e consultar leituras de hidrômetros, administrar o cadastro de militares e emitir relatórios em PDF.

O projeto é dividido em uma aplicação Angular e uma API Laravel. Em desenvolvimento, o Angular encaminha as chamadas `/api` ao backend local; em produção, o Laravel pode servir o build da aplicação a partir de `backend/public`.

## Funcionalidades

- Autenticação e acesso ao painel operacional.
- Consulta de leituras por hidrômetro, com identificação do coletor, data, hora e consumo.
- Registro de leituras com cálculo do consumo a partir da leitura anterior.
- Cadastro, edição, consulta e remoção de militares.
- Emissão de relatório PDF por hidrômetro e intervalo de datas.
- Estados de carregamento, mensagens de erro e notificações de sucesso.

Os hidrômetros disponíveis são configurados em `backend/config/sichs.php`. O frontend está organizado em componentes Angular standalone, separados em pastas com arquivos TypeScript, HTML e CSS.

## Tecnologias

- **Frontend:** Angular 22, TypeScript, RxJS e Vitest.
- **Backend:** PHP 8.3 ou superior, Laravel 13 e Composer.
- **Relatórios:** DomPDF.
- **Banco de dados de referência:** MySQL, conforme `backend/.env.example`; a conexão deve ser ajustada ao ambiente e ao banco SICHS utilizado.

## Pré-requisitos

- PHP 8.3 ou superior e Composer.
- Node.js e npm em versões compatíveis com o Angular CLI 22.
- MySQL e a extensão PDO correspondente, se esse for o banco escolhido.
- Acesso a um banco com o esquema esperado pelo SICHS.

## Executar localmente

### Backend

No PowerShell:

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Em Bash, substitua `Copy-Item` por `cp .env.example .env`.

Edite `backend/.env` para informar a conexão correta. O arquivo de exemplo usa MySQL, banco `sisagua`, usuário `root` e senha vazia; não presuma que esses valores servem para sua instalação. Para um banco local descartável, crie o banco configurado e aplique as migrações:

```bash
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

Se precisar de dados de demonstração, execute `php artisan db:seed` somente em uma base local descartável. Os seeders inserem registros de exemplo e não devem ser executados em produção. Em bancos legados ou já utilizados, faça backup e confira as migrações antes de aplicá-las; não use `migrate:fresh` em uma base com dados que precisam ser preservados.

### Frontend

Em outro terminal:

```bash
cd frontend
npm ci
npm start
```

Abra `http://localhost:4200`. O proxy em `frontend/proxy.conf.json` encaminha `/api` para `http://127.0.0.1:8000`.

## Build e testes

Na pasta `frontend/`:

```bash
npm run build
npm test -- --watch=false
```

O build de produção é gerado em `frontend/dist/frontend/browser/`. Para os testes do backend, execute na pasta `backend/`:

```bash
composer test
```

## Publicação

Para compilar o frontend, execute `npm run build` em `frontend/` e publique o conteúdo de `frontend/dist/frontend/browser/` em `backend/public/`, preservando o `index.php` do Laravel. O fallback em `backend/routes/web.php` entrega o `index.html` para as rotas da aplicação.

O script `deploy.sh` é específico do ambiente configurado no repositório: usa SSH para o host `DC2` e o caminho `C:/laragon/www/sichs`. Revise host, caminho, credenciais e banco antes de utilizá-lo em outro ambiente. Em produção, configure `APP_ENV=production`, `APP_DEBUG=false`, HTTPS e credenciais próprias; não publique `.env` nem execute seeders de demonstração.

## Estrutura do projeto

```text
backend/   API Laravel, migrações, seeders e publicação do frontend
frontend/  aplicação Angular, componentes, estilos e testes
deploy.sh  script de publicação para o ambiente configurado
```

## Release

Consulte as [notas da versão 1.0.0](RELEASE_NOTES_1.0.0.md).

## Licença

Este projeto está licenciado sob a licença MIT. Consulte [LICENSE](LICENSE) para mais detalhes.