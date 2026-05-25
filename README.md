# SICHS - DTCEA-SRO

SICHS é um sistema web para gestão de hidrometria e controle operacional do DTCEA-SRO, desenvolvido com **Angular** no frontend e **Laravel** no backend.

## Visão geral

O sistema foi pensado para centralizar os principais fluxos de operação do setor:

- **Leituras de hidrômetros**: cadastro, consulta, cálculo de consumo e exclusão de registros.
- **Gestão de militares**: cadastro, edição e manutenção de dados cadastrais.
- **Relatórios em PDF**: geração de relatórios por medidor e período.
- **Interface moderna**: dashboard com layout responsivo e experiência mais consistente para uso diário.

## Stack

- **Frontend**: Angular 21
- **Backend**: Laravel
- **Relatórios**: DomPDF
- **Banco de dados**: o padrão configurado no projeto Laravel

A aplicação frontend utiliza o proxy local configurado para encaminhar chamadas para o backend Laravel.

## Observações importantes

- O backend já está preparado para servir o build do Angular em ambiente de produção.

## Licença

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.