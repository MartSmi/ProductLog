const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

async function seed() {
  // Blitz everything!
  await prisma.note.deleteMany();
  await prisma.author.deleteMany();

  const author = await prisma.author.create({
    data: {
      username: 'neohed'
    },
  });

  await prisma.note.create({
    data: {
      title: 'A New Note',
      content: 'This note is retrieved from the database!',
      authorId: author.id,
      lang: 'en',
      isLive: true,
      category: '',
    },
  });

  console.log(`Database has been seeded. 🌱`)
}

seed()
  .then(() => {
    console.log('Prisma seed function in prisma/seed.js executed!')
  })
  .catch((e) => {
    console.error(e);
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
