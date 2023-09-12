const express = require('express');
const userController = require('../controllers/userController');
const reviewRouter = require("../routes/reviewRouter")
const router = express.Router();
const authController =require("../controllers/authController")
const sharedController=require("../controllers/sharedController")

router
  .route('/miperfil')
  .get(authController.setMe,userController.getUser)


router
  .route('/')
  .get(userController.getAllUsers)
  //.post(userController.setRol, userController.createUser); //esto hay que moveerlo

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.modifyBody, userController.updateUser)
  .delete(authController.onlyRoles(["admin"]) ,userController.deleteUser);
//---------------------------------------------------------------------
router
  .get('/:id/reviews', sharedController.getAllReviewsFromUser)

  //SOLO EL USER PUEDE VER TODOS SUS TRBAJOS!!!!
router
  .get('/:id/trabajos',sharedController.getAllJobsFromUser)

module.exports = router;