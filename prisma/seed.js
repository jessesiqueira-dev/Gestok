const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const products = [
  { name: "Água mineral 500 ml", price: 2.5, stock: 40 },
  { name: "Refrigerante lata 350 ml", price: 5, stock: 24 },
  { name: "Suco de laranja 1 L", price: 9.9, stock: 12 },
  { name: "Café torrado 500 g", price: 18.9, stock: 8 },
  { name: "Leite integral 1 L", price: 5.49, stock: 18 },
  { name: "Pão de forma", price: 8.5, stock: 10 },
  { name: "Biscoito recheado", price: 3.99, stock: 20 },
  { name: "Chocolate ao leite 90 g", price: 6.9, stock: 15 },
  { name: "Salgado assado", price: 7.5, stock: 6 },
  { name: "Barra de cereal", price: 3.25, stock: 4 },
  { name: "Sabonete", price: 2.99, stock: 14 },
  { name: "Pilha AA — pacote com 2", price: 12.9, stock: 3 },
];

async function main() {
  const result = await prisma.$transaction(async (transaction) => {
    let created = 0;
    let skipped = 0;

    for (const product of products) {
      const existing = await transaction.product.findFirst({
        where: { name: product.name },
        select: { id: true },
      });

      if (existing) {
        skipped += 1;
      } else {
        await transaction.product.create({ data: product });
        created += 1;
      }
    }

    return { created, skipped };
  });

  console.log(
    `Carga concluída: ${result.created} produtos criados e ${result.skipped} já existentes ignorados.`,
  );
}

main()
  .catch((error) => {
    console.error("Não foi possível carregar os produtos:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
