Claro, entendi perfeitamente. Você quer um README mais limpo, focado no propósito do projeto e que dê os devidos créditos.

Aqui está uma versão mais enxuta e apresentável:

-----

# InvestWise

InvestWise é uma plataforma completa de gerenciamento de finanças pessoais, projetada para ajudar os usuários a obter controle total sobre suas receitas, despesas e investimentos.

A aplicação é construída com uma arquitetura moderna, separando o frontend (React) do backend (NestJS) para melhor manutenibilidade e escalabilidade.

## Principais Funcionalidades

  * **Autenticação Segura:** Sistema de login e registro de usuários usando JWT e criptografia de senhas.
  * **Gerenciamento de Transações:** Permite ao usuário cadastrar, editar e excluir suas receitas e despesas.
  * **Categorização:** Classifique suas transações e investimentos com categorias e cores personalizadas para fácil visualização.
  * **Acompanhamento de Investimentos:** Uma seção dedicada para monitorar o crescimento do seu portfólio de investimentos.
  * **Dashboard Visual:** Gráficos interativos (criados com `Chart.js` e `Recharts`) que fornecem uma visão clara da sua saúde financeira.
  * **Assistente com IA:** Integração com o Google Generative AI para responder dúvidas financeiras e oferecer insights.
  * **Exportação de Relatórios:** Exporte seus dados financeiros para formatos PDF (`jspdf`) e Excel (`xlsx`).

## Tecnologias Utilizadas

Este projeto é um monorepo que utiliza as seguintes tecnologias principais:

  * **Frontend (Cliente):**

      * React
      * Vite
      * Tailwind CSS
      * React Router
      * Axios

  * **Backend (API):**

      * NestJS
      * Prisma (ORM)
      * PostgreSQL (Banco de Dados)
      * Passport (Autenticação JWT)

## Como Executar o Projeto

Para rodar o projeto localmente, você precisará de um banco de dados PostgreSQL.

1.  **Backend (Pasta `/api`)**

      * Instale as dependências: `npm install`
      * Configure seu arquivo `.env` com a URL do banco de dados (`DATABASE_URL`).
      * Execute as migrações do banco: `npx prisma migrate deploy`
      * Inicie o servidor: `npm run start:dev`

2.  **Frontend (Pasta Raiz `/`)**

      * Instale as dependências: `npm install`
      * Inicie a aplicação: `npm run dev`

## Autores

Este projeto foi desenvolvido por:

  * **[Andre Oliveira](https://github.com/andreoliveira509)**
  * **[Isaac Amorim](https://github.com/isaacamorimm)**
