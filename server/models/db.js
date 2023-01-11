const { PrismaClient } = require("@prisma/client")

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  const {__db__} = global;

  if (__db__) {
    prisma = __db__
  } else {
    prisma = new PrismaClient({
      log: [
        {
          emit: "event",
          level: "query",
        },
        "info",
        "warn",
        "error",
      ],
    });

    prisma.$on("query", ({query, duration}) => {
      console.log(`\x1b[36mprisma:query\x1b[0m ${query}`);
      console.log(`Took: ${duration}ms`)
    });

    global.__db__ = prisma
  }

  prisma.$connect();
}

module.exports = {
  prisma
}
