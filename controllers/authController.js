const jwt = require('jsonwebtoken');
const userModel=require("../models/userModel")
const fixerModel=require("../models/fixerModel")
const AppError =require("../utils/AppError")


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
    if(logueado.password !== password){
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(logueado, 200, res);
  };

exports.identificar = async (req, res, next) => {
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
    next();
};