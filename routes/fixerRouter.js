const express = require('express');
const controller = require('../controllers/fixerController');
const trabajoRouter=require("../routes/trabajoRouter")
const router = express.Router();


router
  .route('/')
  .get(controller.getAll)
  .post(controller.create);

router
  .route('/:id')
  .get(controller.getOne)

  //los trabajos de este fixer
router
  .use("/:id/trabajos", trabajoRouter)


module.exports = router;