const express = require('express');
const barriocontroller = require('../controllers/barrioController');
const tipoServicioController= require("../controllers/tipoServicioController")
const authController = require("../controllers/authController")


const router = express.Router();
/*
router.use(
  authController.identificar,
  authController.onlyRoles(["admin"]))
*/
router
  .route('/barrios')
  .get(barriocontroller.getAll)
  .post(authController.identificar,
    authController.onlyRoles(["admin"]),
    barriocontroller.create);

router
  .route('/tiposdeservicio')
  .get(tipoServicioController.getAll)
  .post(authController.identificar,
    authController.onlyRoles(["admin"]),
    tipoServicioController.create);


module.exports = router;