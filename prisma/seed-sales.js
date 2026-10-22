const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// IDs fixos tornam a carga repetível sem duplicar vendas ou baixar o estoque
// novamente quando o script for executado mais de uma vez.
const sales = [
  { id: "ad801d01-0001-4000-8000-000000000001", daysAgo: 13, hour: 9, items: [["Água mineral 500 ml", 2], ["Pão de forma", 1]] },
  { id: "ad801d01-0002-4000-8000-000000000002", daysAgo: 12, hour: 11, items: [["Leite integral 1 L", 2], ["Biscoito recheado", 1]] },
  { id: "ad801d01-0003-4000-8000-000000000003", daysAgo: 11, hour: 14, items: [["Refrigerante lata 350 ml", 2], ["Chocolate ao leite 90 g", 1]] },
  { id: "ad801d01-0004-4000-8000-000000000004", daysAgo: 10, hour: 10, items: [["Café torrado 500 g", 1], ["Leite integral 1 L", 1]] },
  { id: "ad801d01-0005-4000-8000-000000000005", daysAgo: 9, hour: 16, items: [["Suco de laranja 1 L", 1], ["Barra de cereal", 2]] },
  { id: "ad801d01-0006-4000-8000-000000000006", daysAgo: 8, hour: 12, items: [["Água mineral 500 ml", 3], ["Salgado assado", 1]] },
  { id: "ad801d01-0007-4000-8000-000000000007", daysAgo: 7, hour: 15, items: [["Pão de forma", 1], ["Sabonete", 1]] },
  { id: "ad801d01-0008-4000-8000-000000000008", daysAgo: 6, hour: 9, items: [["Refrigerante lata 350 ml", 2], ["Biscoito recheado", 2]] },
  { id: "ad801d01-0009-4000-8000-000000000009", daysAgo: 5, hour: 17, items: [["Leite integral 1 L", 2], ["Chocolate ao leite 90 g", 1]] },
  { id: "ad801d01-0010-4000-8000-000000000010", daysAgo: 4, hour: 13, items: [["Café torrado 500 g", 1], ["Água mineral 500 ml", 2]] },
  { id: "ad801d01-0011-4000-8000-000000000011", daysAgo: 3, hour: 10, items: [["Suco de laranja 1 L", 1], ["Pilha AA — pacote com 2", 1]] },
  { id: "ad801d01-0012-4000-8000-000000000012", daysAgo: 2, hour: 16, items: [["Refrigerante lata 350 ml", 2], ["Salgado assado", 1]] },
  { id: "ad801d01-0013-4000-8000-000000000013", daysAgo: 1, hour: 11, items: [["Leite integral 1 L", 2], ["Barra de cereal", 1], ["Sabonete", 1]] },
  { id: "ad801d01-0014-4000-8000-000000000014", daysAgo: 0, hour: 10, items: [["Água mineral 500 ml", 2], ["Pão de forma", 1], ["Chocolate ao leite 90 g", 1]] },
];

async function main() {
  const result = await prisma.$transaction(async (transaction) => {
    const products = await transaction.product.findMany();
    const productsByName = new Map(products.map((product) => [product.name, product]));
    const missingNames = [...new Set(sales.flatMap((sale) => sale.items.map(([name]) => name)))].filter(
      (name) => !productsByName.has(name),
    );

    if (missingNames.length) {
      throw new Error(
        `Produtos não encontrados: ${missingNames.join(", ")}. Execute npm run db:seed antes da carga de vendas.`,
      );
    }

    let created = 0;
    let skipped = 0;

    for (const saleData of sales) {
      const existing = await transaction.sale.findUnique({ where: { id: saleData.id }, select: { id: true } });
      if (existing) {
        skipped += 1;
        continue;
      }

      const saleItems = saleData.items.map(([name, quantity]) => {
        const product = productsByName.get(name);
        return { product, quantity };
      });

      for (const { product, quantity } of saleItems) {
        if (product.stock < quantity) {
          throw new Error(`Estoque insuficiente para "${product.name}". Carga cancelada sem alterações.`);
        }
      }

      const date = new Date();
      date.setDate(date.getDate() - saleData.daysAgo);
      date.setHours(saleData.hour, 0, 0, 0);

      await transaction.sale.create({
        data: {
          id: saleData.id,
          date,
          saleProducts: {
            create: saleItems.map(({ product, quantity }) => ({
              productId: product.id,
              unitPrice: product.price,
              quantity,
            })),
          },
        },
      });

      for (const { product, quantity } of saleItems) {
        await transaction.product.update({
          where: { id: product.id },
          data: { stock: { decrement: quantity } },
        });
        product.stock -= quantity;
      }

      created += 1;
    }

    return { created, skipped };
  });

  console.log(`Carga de vendas concluída: ${result.created} vendas criadas e ${result.skipped} já existentes ignoradas.`);
}

main()
  .catch((error) => {
    console.error("Não foi possível carregar as vendas:", error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
