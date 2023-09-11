const express = require('express');
const trabajoController = require('../controllers/trabajoController');
const authController = require("../controllers/authController")
const router = express.Router({mergeParams:true});
const reviewRouter=require("../routes/reviewRouter")
router
  .route('/')
  .get(trabajoController.getAll)
  .post(authController.identificar,
    trabajoController.allowUserCreate,  //solo el USER CREA el TRABAJO
    trabajoController.create);

  const probandoEndpoint=(req,res,next)=>{
    res.status(200).json({saludo:"probandoEndpoint"})
  }

router
  .route('/:id/aceptar')
  .get(probandoEndpoint)
  .patch( authController.identificar,
    trabajoController.allowFixerModify,  //solo el fixer modifica el TRABAJO
    trabajoController.aceptar)

router
  .use('/:id/review',reviewRouter )
  

router
  .route('/:id')
  .get(trabajoController.getOne)
  .patch(
    authController.identificar,
    trabajoController.allowFixerModify,  //solo el fixer modifica el TRABAJO
    trabajoController.update)
  .delete(trabajoController.delete);
module.exports = router;

