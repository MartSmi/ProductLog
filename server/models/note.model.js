const { prisma } = require("./db")

async function getNotes() {
  return prisma.note.findMany()
}

async function getNote(id) {
  return prisma.note.findUnique({ where: { id } })
}

async function createNote(
  note
) {
  return prisma.note.create({
    data: note
  })
}

async function updateNote(
  id, note
) {
  return prisma.note.update({
    data: note,
    where: {
      id
    }
  })
}

async function deleteNote(
  id
) {
  return prisma.note.delete({
    where: {
      id
    }
  })
}

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
}
