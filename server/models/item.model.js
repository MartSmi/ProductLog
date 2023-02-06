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
        {
          store: {
            contains: searchPhrase,
          },
        },
      ],
    },
  });
}
async function createItems(items) {
  for (const item of items) {
    if (item.EAN) {
      try {
        await prisma.item.upsert({
          where: { EAN: item.EAN },
          update: {},
          create: item,
        });
      } catch (error) {
        throw error;
      }
    } else {
      delete item.EAN;
      try {
        await prisma.item.upsert({
          where: {
            artNumber_store: { artNumber: item.artNumber, store: item.store },
          },
          update: {},
          create: item,
        });
      } catch (error) {
        throw error;
      }
    }
  }
}

async function upsertItems(items) {
  await Promise.all(items.map((item) => upsertItem(item)));
}

async function upsertItem(item) {
  if (item.EAN) {
    try {
      await prisma.item.upsert({
        where: { EAN: item.EAN },
        update: { quantity: item.quantity },
        create: item,
      });
    } catch (error) {
      throw error;
    }
  } else {
    delete item.EAN;
    try {
      await prisma.item.findUniqueOrThrow({
        where: {
          artNumber_store: { artNumber: item.artNumber, store: item.store },
        },
      });
      await prisma.item.update({
        where: {
          artNumber_store: { artNumber: item.artNumber, store: item.store },
        },
        data: {
          quantity: item.quantity,
          // name: item.name,
          // artNumber: item.artNumber,
          // store: item.store,
          // EAN: undefined,
        },
      });
    } catch (e) {
      if (e.name === "NotFoundError") {
        //TODO
        await prisma.item.create({
          data: {
            name: item.name,
            artNumber: item.artNumber,
            quantity: item.quantity,
            store: item.store,
            EAN: undefined,
          },
        });
      } else {
        throw e;
      }
    }
  }
}

module.exports = {
  getItems,
  getItemsFuzzy,
  createItems,
  upsertItem,
  upsertItems,
};
