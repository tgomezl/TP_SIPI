const express = require('express');
const trabajoController = require('../controllers/trabajoController');
const authController = require("../controllers/authController")
const router = express.Router({mergeParams:true});
const reviewRouter=require("../routes/reviewRouter")

router
  .route('/enviaremaildeprueba')
  .get(
    trabajoController.enviaremaildeprueba)

//quien tendria acceso a todos los trabajos??
router
  .route('/')
  .get(
    trabajoController.getAll)  //todos pueden ver esto
    
  .post(
    authController.identificar,
    trabajoController.allowUserCreate,  //solo el USER CREA el TRABAJO
    trabajoController.create);

router
  .route('/:id/aceptar')
  .patch( authController.identificar,
    trabajoController.allowFixerModify,  //solo el fixer modifica el TRABAJO
    trabajoController.aceptar)

    router
    .route('/:id/finalizar')
    .patch( authController.identificar,
      trabajoController.allowFixerModify,  //solo el fixer finaliza el TRABAJO
      trabajoController.finalizar)

router
  .route('/:id')
  //.get(authController.identificar,trabajoController.getOne)
  .get(trabajoController.getOne)
  .patch(
    authController.identificar,
    trabajoController.allowFixerModify,  //solo el fixer modifica el TRABAJO
    trabajoController.uploadPhotosTrabajo,
    //trabajoController.uploadPhotosTrabajo,
    trabajoController.update)
  .delete(trabajoController.delete);
module.exports = router;

