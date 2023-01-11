const express = require('express');
const noteRouter = express.Router();
const noteController = require('../controllers/note.controller');

noteRouter.get('/', noteController.getNotes);
noteRouter.get('/:id', noteController.getNote);
noteRouter.post('/', noteController.postNote);
noteRouter.put('/', noteController.putNote);
noteRouter.delete('/', noteController.deleteNote);

const routes = app => {
  app.use('/note', noteRouter);
};

module.exports = routes
