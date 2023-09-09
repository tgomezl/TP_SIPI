const express = require('express');
const barriocontroller = require('../controllers/barrioController');
const tipoServicioController= require("../controllers/tipoServicioController")

const router = express.Router();


router
  .route('/barrios')
  .get(barriocontroller.getAll)
  .post(barriocontroller.create);

router
  .route('/tiposdeservicio')
  .get(tipoServicioController.getAll)
  .post(tipoServicioController.create);


module.exports = router;