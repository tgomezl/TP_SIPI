const express = require('express');
const trabajoController = require('../controllers/trabajoController');

const router = express.Router();

router
  .route('/')
  .get(trabajoController.getAll)
  .post(trabajoController.create);

router
  .route('/:id')
  .get(trabajoController.getOne)
  .patch(trabajoController.update)
  .delete(trabajoController.delete);

module.exports = router;