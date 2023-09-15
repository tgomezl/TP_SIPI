const express = require('express');
const controller = require('../controllers/fixerController');
const trabajoRouter=require("../routes/trabajoRouter")
const router = express.Router();
const authController=require("../controllers/authController")
const reviewRouter=require("../routes/reviewRouter")

/*
router
  .route('/miperfil')
  .get(authController.setMe,controller.getOne)
*/
router
  .route('/endpointparapruebas')
  .get(controller.pruebas)

router
  .route('/fixersporzona')
  .get(controller.FixersPorZona)
  
router
  .route('/fixersporjobzona')
  .get(controller.FixersPorJobZona)   //necesita recibir zona y especialidad
  
router
  .route('/bestfixers')
  .get(controller.bestfixers, controller.getAll)

router
  .route('/')
  .get(controller.getAll)
  //.post(controller.create); //esto hay que moverlo


router
  .route('/updateme')
  .patch(authController.identificar,
    authController.onlyRoles(["fixer"]), 
    controller.updateMe)  //el propio fixer

router
    .route('/miperfil')
    .get(authController.identificar,
      authController.onlyRoles(["fixer"]),
      authController.setMe,
      controller.getOne)
  

router
  .route('/:id')
  .get(authController.identificar,controller.getOne)
  .delete(authController.identificar,
    authController.onlyRoles(["admin"]), controller.deleteOne)   //solo admin
  .patch(authController.identificar,
    authController.onlyRoles(["admin"]),controller.updateOne)



  //los trabajos de este fixer son visibles para todos
router
  .use("/:id/trabajos", authController.identificar,trabajoRouter)

  //todas las reviews de un fixer
router
  .use("/:id/reviews",authController.identificar, reviewRouter)



module.exports = router;