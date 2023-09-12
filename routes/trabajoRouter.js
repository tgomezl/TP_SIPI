const express = require('express');
const trabajoController = require('../controllers/trabajoController');
const authController = require("../controllers/authController")
const router = express.Router({mergeParams:true});
const reviewRouter=require("../routes/reviewRouter")



//quien tendria acceso a todos los trabajos??
router
  .route('/')
  .get(
    trabajoController.getAll)
    
  .post(
    trabajoController.allowUserCreate,  //solo el USER CREA el TRABAJO
    trabajoController.create);

router
  .route('/:id/aceptar')
  .patch( authController.identificar,
    trabajoController.allowFixerModify,  //solo el fixer modifica el TRABAJO
    trabajoController.aceptar)


    //para el post review???
/*
router
  .use('/:id/review',reviewRouter )
*/

router
  .route('/:id')
  .get(trabajoController.getOne)
  .patch(
    authController.identificar,
    trabajoController.allowFixerModify,  //solo el fixer modifica el TRABAJO
    trabajoController.update)
  .delete(trabajoController.delete);
module.exports = router;

