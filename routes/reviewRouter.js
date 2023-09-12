const express = require('express');
const reviewcontroller =require("../controllers/reviewController")
const router = express.Router({mergeParams:true});
const authController =require("../controllers/authController")


router
  .route('/')
  .get(authController.identificar,
      reviewcontroller.getAll)
  .post( authController.identificar,
      reviewcontroller.allowUserCreate,  //solo el user crea review.OK
      reviewcontroller.create);

router
  .route('/:id')
  .get(authController.identificar,
    reviewcontroller.getOne)
  .patch( authController.identificar,
      reviewcontroller.allowUserModify,  //SOLO EL USER MODIFICA LA REVIEW
      reviewcontroller.update)

module.exports = router;