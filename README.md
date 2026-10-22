# Gestock

Aplicação web para acompanhar produtos, estoque, vendas e receitas.

## Tecnologias

- **Next.js 16.4.2** com App Router
- **React 19.3** e **TypeScript 5.9**
- **PostgreSQL 17** e **Prisma ORM 5.19**
- **Tailwind CSS 3.4** e componentes **shadcn/ui** com Radix UI
- **Zod 3.23** para validação e **React Hook Form 7.53** para formulários
- **TanStack Table 8.20** para tabelas e **Recharts 2.15** para gráficos
- **next-safe-action 7.9** para ações do servidor
- **Sonner 2.0** para notificações

### Organização da aplicação

- `app/(dashboard)`: visão geral e indicadores.
- `app/products` e `app/sales`: telas de produtos, estoque e vendas.
- `app/_actions`: operações de escrita e validações das ações do servidor.
- `app/_data-access`: consultas de leitura ao banco, separadas por domínio.
- `app/_components`: layout compartilhado e componentes de interface.
- `prisma`: schema, migrações e cargas de dados de demonstração.

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
