const { prisma } = require("./db")

async function getAuthor(id) {
  return prisma.author.findUnique({ where: { id } })
}

async function getAuthorByName(username) {
  return prisma.author.findUnique({ where: { username } })
}

async function createAuthor(
  author
) {
  return prisma.author.create({
    data: author
  })
}

module.exports = {
  getAuthor,
  getAuthorByName,
  createAuthor,
}
