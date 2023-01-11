const { prisma } = require("./db");

async function getItems() {
  return prisma.item.findMany();
}

async function getItemsFuzzy(searchPhrase) {
  return prisma.item.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchPhrase,
          },
        },
        {
          EAN: {
            contains: searchPhrase,
          },
        },
        {
          artNumber: {
            contains: searchPhrase,
          },
        },
      ],
    },
  });
}

module.exports = {
  getItems,
  getItemsFuzzy,
};
