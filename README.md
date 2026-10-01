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

## Estrutura do projeto

```text
backend/   API Laravel, migrações, seeders e publicação do frontend
frontend/  aplicação Angular, componentes, estilos e testes
deploy.sh  script de publicação para o ambiente configurado
```