const express = require('express');
const controller = require('../controllers/fixerController');

const router = express.Router();


router
  .route('/')
  .get(controller.getAll)
  .post(controller.create);


module.exports = router;