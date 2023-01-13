const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  // Blitz everything!
  await prisma.item.deleteMany();

  await prisma.item.create({
    data: {
      name: "Def",
      EAN: "87654321",
      artNumber: "7482",
      quantity: 2,
      store: process.env.FIRSTNAME,
    },
  });

  await prisma.item.create({
    data: {
      name: "Abc",
      EAN: "12345678",
      artNumber: "9101",
      quantity: 3,
      store: process.env.FIRSTNAME,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .then(() => {
    console.log("Prisma seed function in prisma/seed.js executed!");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
