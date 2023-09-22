const express = require('express');
const router = express.Router();
const path = require('path');


//    /api/v1/images/users
//router.use("/users",express.static('public/img/users'));
        //user-6504973779fd1b4b0492e1d8-pedro


router
  .route('/users/:imagename')
  .get( (req,res,next)=>{
    const nombrerecibido=req.params.imagename
    //nombrerecibido es imagendos.jpg
    console.log("imagename",nombrerecibido);
    console.log("dirname actual",__dirname);

    let ruta=path.join(__dirname,"../public/img/users/",nombrerecibido);
    console.log("subi una ruta", ruta);

    res.sendFile(ruta);
  })

router
  .route('/fixers/:imagename')
  .get( (req,res,next)=>{
    const nombrerecibido=req.params.imagename
    //nombrerecibido es imagendos.jpg
    console.log("imagename",nombrerecibido);
    console.log("dirname actual",__dirname);

    let ruta=path.join(__dirname,"../public/img/fixers/",nombrerecibido);
    console.log("subi una ruta", ruta);

    res.sendFile(ruta);
  })

router
  .route('/trabajos/:imagename')
  .get( (req,res,next)=>{
    const nombrerecibido=req.params.imagename
    //nombrerecibido es imagendos.jpg
    console.log("imagename",nombrerecibido);
    console.log("dirname actual",__dirname);

    let ruta=path.join(__dirname,"../public/img/trabajos/",nombrerecibido);
    console.log("subi una ruta", ruta);

    res.sendFile(ruta);
  })

router
  .route('/reviews/:imagename')
  .get( (req,res,next)=>{
    const nombrerecibido=req.params.imagename
    //nombrerecibido es imagendos.jpg
    console.log("imagename",nombrerecibido);
    console.log("dirname actual",__dirname);

    let ruta=path.join(__dirname,"../public/img/reviews/",nombrerecibido);
    console.log("subi una ruta", ruta);

    res.sendFile(ruta);
  })


module.exports = router;

//    /api/v1/images/users/user-6504973779fd1b4b0492e1d8-pedro