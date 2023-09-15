const jwt = require('jsonwebtoken');
const userModel=require("../models/userModel")
const fixerModel=require("../models/fixerModel")
const AppError =require("../utils/AppError")
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET, {
      expiresIn: "90m"
    });
};
  

const createSendToken = (user, statusCode=201, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};


exports.login = async (req, res, next) => {
  //usa ambos model para aher el loguin
    console.log(req.body.mail);

    //const logueadod= userModel.findOne({ mail:"useruser@email.com"})
    //console.log
    //("logueadod", logueadod);

    const { mail, password , sesionComo} = req.body;
    console.log(mail, password, sesionComo);
    // 1) Check if mail and password exist
    if (!mail || !password || !sesionComo) {
      return next(new AppError('Please provide mail and password and rol!', 400));
    }
    // 2) Check if user exists && password is correct
    if(sesionComo!=="user" && sesionComo!=="fixer"){
        return next(new AppError('rol no establecido!', 400));
    }
    let model;
    if(sesionComo==="user"){
        model=userModel
    }
    else{
        model=fixerModel
    }
    
    const logueado= await model.findOne({ mail:mail }).select('+password')
    //console.log("comparo", password, logueado.password);
    const soniguales= await logueado.checkPassword(password, logueado.password)
    if(!soniguales){
      return next(new AppError('Incorrect email or password', 401));
    }
    /*
    //if(logueado.password !== password){
        return next(new AppError('Incorrect email or password', 401));
    }
  */
    // 3) If everything ok, send token to client
    createSendToken(logueado, 200, res);
  };

exports.identificar = async (req, res, next) => {
  try {
    
    
    // 1) Getting token and check of it's there
      let token;
      if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
    
      if (!token) {
        return next(
          new AppError('You are not logged in! Please log in to get access.', 401)
        );
      }
    
      // 2) Verification token
      //const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
      const decoded = jwt.verify(token, process.env.SECRET);
    
      // 3) Check if user still exists
      let currentUser = await userModel.findById(decoded.id);
      
      if (!currentUser) {
        currentUser = await fixerModel.findById(decoded.id);
        if(!currentUser){
          return next(
            new AppError(
              'The user belonging to this token does no longer exist.',401)
          );
        }    
        
      }
    
      // GRANT ACCESS
      console.log("       * * * * * * * *     ");
      console.log("    GRANTED  ");
      console.log("       * * * * * * * *     ");
      req.user = currentUser;
      console.log("user aca", req.user);
      console.log(" ");
      next();
  } catch (error) {
    next(new AppError("error el identificar token", 401))
  } 
};

exports.onlyRoles=(roles)=>{
    return (req, res, next) => {
      console.log("dentro de ",req.originalUrl," !!!");
      console.log("esto es el id",req.params.id);
      console.log("tu rol es",req.user.rol,"y se compara con", roles);
      console.log("tu rol es",typeof req.user.rol);
      console.log(roles.includes(req.user.rol));
      if (!roles.includes(req.user.rol)) {
        console.log("not allowed");
            return next(
              new AppError('tu rol no te permite hacer esto', 403)
            );
      }
  
      return next();
    };
};

exports.createAdmin=async(req,res,next)=>{
  try {
    const admin=await userModel.create(req.body)
    createSendToken(admin, 201, res);
  } catch (error) {
    return next(
      new AppError('error creando el admin', 403)
    );
  }
  

}


exports.setMe=async(req,res,next)=>{
  try {
      console.log(" seting me");
      req.me=req.user.id
      next()
  } catch (error) {
      console.log("catching");
      return next(error)
  }
}

exports.createUser=async(req,res,next)=>{
    try {
        console.log("body ",req.body);
        const newuser=await userModel.create(req.body)
        createSendToken(newuser, 201, res);
        
    } catch (error) {
        console.log("catching");
        next(error)
    }
}

exports.createFixer=async(req,res,next)=>{
    try {
        const fixer = await fixerModel.create(req.body)
        createSendToken(fixer, 201, res);
    } catch (error) {
        next(error)
    }


}

//**************
exports.logout = (req, res,next) => {
  const faketoken="asdasdasd"
  res.status(200).json({
    status: 'loged out',
    token:faketoken,
    data: {
        user:null
    }
  });
};

/*
exports.MODIFICARLASPASS=async(req, res,next) => {
  
  const newpassword=await bcrypt.hash("test12345", 10)
  await userModel.updateMany({ }, {$set:{password:newpassword}})
  await fixerModel.updateMany({ }, {$set:{password:newpassword}})
  res.send("ok");
}
*/