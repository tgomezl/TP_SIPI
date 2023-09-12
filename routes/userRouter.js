const express = require('express');
const userController = require('../controllers/userController');
const reviewRouter = require("../routes/reviewRouter")
const router = express.Router();
const authController =require("../controllers/authController")
const sharedController=require("../controllers/sharedController")

router
  .route('/miperfil')
  .get(authController.identificar,
    authController.setMe,
    userController.getUser)

router
    .route('/updateme')
    .patch(authController.identificar,
      authController.onlyRoles(["user"]),
      userController.updateMe)


router
  .route('/')
  .get(authController.identificar,userController.getAllUsers)
  //.post(userController.setRol, userController.createUser); //esto hay que moveerlo

router
  .route('/:id')
  .get(authController.identificar,
    userController.getUser)
  .patch(authController.identificar,
    authController.onlyRoles(["admin"]) ,
    userController.modifyBody, 
    userController.updateUser)
  .delete(authController.identificar,
    authController.onlyRoles(["admin"]) ,
    userController.deleteUser);
//---------------------------------------------------------------------
router
  .get('/:id/reviews', 
  authController.identificar,
  sharedController.getAllReviewsFromUser)

  //SOLO EL USER PUEDE VER TODOS SUS TRBAJOS??
  //por ahora no pero se puede modificar
router
  .get('/:id/trabajos',
  authController.identificar,
  sharedController.getAllJobsFromUser)

module.exports = router;