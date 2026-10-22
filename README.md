# Gestock

Aplicação web para acompanhar produtos, estoque, vendas e receitas.

## Requisitos

- Node.js 20.9 ou superior
- npm
- Docker Desktop (para executar o PostgreSQL local)

## Configuração

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env`.
3. Inicie o banco com `docker compose up -d`.
4. Aplique as migrações com `npx prisma migrate deploy`.
5. Carregue os produtos de exemplo com `npm run db:seed` (opcional).
6. Carregue as vendas de exemplo com `npm run db:seed:sales` (opcional; requer os produtos de exemplo).
7. Inicie a aplicação com `npm run dev` e abra http://localhost:3000.

O cliente Prisma é gerado automaticamente durante a instalação das dependências.
