const express = require('express');
const controller = require('../controllers/fixerController');
const trabajoRouter=require("../routes/trabajoRouter")
const router = express.Router();
const authController=require("../controllers/authController")
const reviewRouter=require("../routes/reviewRouter")

router
  .route('/miperfil')
  .get(authController.setMe,controller.getOne)


router
  .route('/')
  .get(controller.getAll)
  //.post(controller.create); //esto hay que moverlo

router
  .route('/:id')
  .get(controller.getOne)
  //.delete()
  //.patch()

  //los trabajos de este fixer son visibles para todos
router
  .use("/:id/trabajos", trabajoRouter)

  //todas las reviews de un fixer
router
  .use("/:id/reviews", reviewRouter)

module.exports = router;